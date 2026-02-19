import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ── In-memory rate-limit stub (per-IP, resets on cold start) ──
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5; // requests
const RATE_WINDOW = 60_000; // 1 minute

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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  // Rate limit
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return json({ error: "Too many requests" }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const { name, email, subject, message, website } = body as Record<string, string>;

  // Honeypot check
  if (website) {
    return json({ ok: true }); // silently discard
  }

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return json({ error: "All fields are required" }, 400);
  }

  // Basic email check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Invalid email address" }, 400);
  }

  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  const CONTACT_TO_EMAIL = Deno.env.get("CONTACT_TO_EMAIL");
  const CONTACT_FROM_EMAIL = Deno.env.get("CONTACT_FROM_EMAIL");

  if (!SENDGRID_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error("Missing SendGrid env vars");
    return json({ error: "Server misconfiguration" }, 500);
  }

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeSubject = escapeHtml(subject.trim());
  const safeMessage = escapeHtml(message.trim());

  const sgPayload = {
    personalizations: [{ to: [{ email: CONTACT_TO_EMAIL }] }],
    from: { email: CONTACT_FROM_EMAIL },
    reply_to: { email: email.trim(), name: name.trim() },
    subject: `Contact: ${safeSubject}`,
    content: [
      {
        type: "text/html",
        value: `<p><strong>From:</strong> ${safeName} (${safeEmail})</p>
<p><strong>Subject:</strong> ${safeSubject}</p>
<hr/>
<p>${safeMessage.replace(/\n/g, "<br/>")}</p>`,
      },
    ],
  };

  try {
    const sgRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sgPayload),
    });

    if (!sgRes.ok) {
      const text = await sgRes.text();
      console.error("SendGrid error:", sgRes.status, text);
      return json({ error: "Failed to send email" }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    console.error("SendGrid fetch error:", err);
    return json({ error: "Failed to send email" }, 502);
  }
});
