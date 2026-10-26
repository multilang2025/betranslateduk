import { NextResponse } from "next/server";

// Same-origin relay: the browser cannot call betranslated.com/api/leads directly
// (no CORS), so the quote form posts JSON here and this route forwards it
// server-side. No credentials are involved; the .com intake is a public form endpoint.

const LEADS_URL = process.env.QUOTE_RELAY_URL || "https://betranslated.com/api/leads/";
const QUOTE_TYPE = { translation: "translation", certified: "general", interpreting: "interpretation" };
const LABELS = [
  ["languages", "Languages"], ["subject", "Subject"], ["wordCount", "Word count"], ["docType", "Document type"],
  ["pages", "Pages"], ["certification", "Certification"], ["delivery", "Delivery"], ["eventType", "Event type"],
  ["mode", "Interpreting mode"], ["eventDateStart", "Event start"], ["eventDateEnd", "Event end"],
  ["duration", "Duration"], ["location", "Location or platform"], ["venue", "Venue"], ["attendees", "Attendees"],
  ["equipment", "Equipment"], ["deadline", "Deadline"], ["phone", "Phone"],
];

const bad = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return bad("Bad request"); }
  if (b.website_url) return NextResponse.json({ ok: true });

  const name = String(b.name || "").trim();
  const email = String(b.email || "").trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Name and a valid email are required", 422);
  const type = QUOTE_TYPE[b.type] ? b.type : "translation";

  const header = [`Site: betranslated.co.uk`, `Form: ${type}`, `Page: ${String(b.page || "").slice(0, 200)}`];
  const details = LABELS.filter(([k]) => b[k]).map(([k, l]) => `${l}: ${String(b[k]).slice(0, 300)}`);
  const message = [...header, ...details, "", String(b.message || "").slice(0, 4000)].join("\n");

  const fwd = req.headers.get("x-forwarded-for");
  let res;
  try {
    res = await fetch(LEADS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(fwd ? { "x-forwarded-for": fwd } : {}) },
      body: JSON.stringify({
        name, email, phone: b.phone || undefined, message,
        source: "quote", quoteType: QUOTE_TYPE[type], locale: "en", attachments: [],
        website_url: "", _form_started: b._form_started,
      }),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    return bad("Upstream unavailable", 502);
  }
  if (!res.ok) return bad("Upstream rejected the request", 502);
  return NextResponse.json({ ok: true });
}
