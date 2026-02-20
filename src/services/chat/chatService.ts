import { supabase } from "@/services/auth/supabaseClient";
import { env } from "@/services/config/env";

export interface ChatThread {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  role: "system" | "user" | "assistant";
  content: string;
  provider: string | null;
  model: string | null;
  created_at: string;
}

export const chatService = {
  async getThreads(): Promise<ChatThread[]> {
    const { data, error } = await supabase
      .from("chat_threads")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getMessages(threadId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async deleteThread(threadId: string): Promise<void> {
    const { error } = await supabase
      .from("chat_threads")
      .delete()
      .eq("id", threadId);

    if (error) throw error;
  },

  async *sendMessage(
    message: string,
    threadId?: string
  ): AsyncGenerator<
    { type: "content"; content: string } | { type: "done"; threadId?: string }
  > {
    const session = (await supabase.auth.getSession()).data.session;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      apikey: env.supabaseAnonKey,
    };
    if (session) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const res = await fetch(`${env.supabaseUrl}/functions/v1/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, threadId }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error || `Request failed (${res.status})`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        try {
          const parsed = JSON.parse(trimmed.slice(6));
          if (parsed.done) {
            yield { type: "done", threadId: parsed.threadId };
          } else if (parsed.content) {
            yield { type: "content", content: parsed.content };
          }
        } catch {
          // skip unparseable
        }
      }
    }
  },
};
