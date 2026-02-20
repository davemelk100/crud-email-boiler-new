import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── In-memory rate-limit stub (per-IP, resets on cold start) ──
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return json({ error: "Too many requests" }, 429);
  }

  // ── Auth ──
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return json({ error: "Missing authorization" }, 401);
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  // ── Parse body ──
  let body: { message?: string; threadId?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { message, threadId } = body;
  if (!message?.trim()) {
    return json({ error: "Message is required" }, 400);
  }

  // ── Thread management ──
  let activeThreadId = threadId;

  if (!activeThreadId) {
    const title = message.trim().slice(0, 40);
    const { data: thread, error: threadErr } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, title })
      .select("id")
      .single();

    if (threadErr || !thread) {
      console.error("Thread creation error:", threadErr);
      return json({ error: "Failed to create thread" }, 500);
    }
    activeThreadId = thread.id;
  } else {
    // Verify thread belongs to user
    const { data: existing } = await supabase
      .from("chat_threads")
      .select("id")
      .eq("id", activeThreadId)
      .eq("user_id", user.id)
      .single();

    if (!existing) {
      return json({ error: "Thread not found" }, 404);
    }
  }

  // ── Fetch context (last 50 messages) ──
  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("thread_id", activeThreadId)
    .order("created_at", { ascending: true })
    .limit(50);

  const contextMessages = (history ?? []).map((m: { role: string; content: string }) => ({
    role: m.role,
    content: m.content,
  }));

  // ── Save user message ──
  await supabase.from("chat_messages").insert({
    thread_id: activeThreadId,
    role: "user",
    content: message.trim(),
  });

  // ── Provider config ──
  const AI_PROVIDER = Deno.env.get("AI_PROVIDER") ?? "openai";
  const AI_MODEL =
    Deno.env.get("AI_MODEL") ??
    (AI_PROVIDER === "anthropic" ? "claude-sonnet-4-20250514" : "gpt-4o");

  const allMessages = [
    ...contextMessages,
    { role: "user", content: message.trim() },
  ];

  let aiResponse: Response;

  try {
    if (AI_PROVIDER === "anthropic") {
      const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
      if (!ANTHROPIC_API_KEY) {
        return json({ error: "Server misconfiguration" }, 500);
      }
      aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          max_tokens: 4096,
          stream: true,
          messages: allMessages,
        }),
      });
    } else {
      const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
      if (!OPENAI_API_KEY) {
        return json({ error: "Server misconfiguration" }, 500);
      }
      aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_MODEL,
          stream: true,
          messages: allMessages,
        }),
      });
    }
  } catch (err) {
    console.error("AI fetch error:", err);
    return json({ error: "Failed to reach AI provider" }, 502);
  }

  if (!aiResponse.ok) {
    const text = await aiResponse.text();
    console.error("AI provider error:", aiResponse.status, text);
    return json({ error: "AI provider error" }, 502);
  }

  // ── Stream response ──
  const reader = aiResponse.body!.getReader();
  const decoder = new TextDecoder();
  let fullContent = "";
  let buffer = "";

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      function send(data: string) {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              let chunk = "";

              if (AI_PROVIDER === "anthropic") {
                if (
                  parsed.type === "content_block_delta" &&
                  parsed.delta?.text
                ) {
                  chunk = parsed.delta.text;
                }
              } else {
                chunk = parsed.choices?.[0]?.delta?.content ?? "";
              }

              if (chunk) {
                fullContent += chunk;
                send(JSON.stringify({ content: chunk }));
              }
            } catch {
              // skip unparseable lines
            }
          }
        }

        // Save assistant message
        await supabase.from("chat_messages").insert({
          thread_id: activeThreadId,
          role: "assistant",
          content: fullContent,
          provider: AI_PROVIDER,
          model: AI_MODEL,
        });

        send(
          JSON.stringify({ done: true, threadId: activeThreadId })
        );
        controller.close();
      } catch (err) {
        console.error("Stream error:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
});
