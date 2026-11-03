import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { LEAD_UPLOAD_BUCKET, MAX_TOTAL_UPLOAD_BYTES, MAX_ATTACHMENTS_PER_SUBMISSION, isBlockedExtension, sanitizeFilename } from "../../../lib/uploads";
import { verifyTurnstile } from "../../../lib/turnstile";
import { emailConfigured, sendQuoteNotification } from "../../../lib/email";

// UK quote form intake, modelled on the betranslated.es route (BTvibe-es
// app/api/contact/route.js). What it does, in order: rate limit per IP, validate
// name and email, drop honeypot hits, verify Turnstile (only when its keys are set),
// keep attachments (blocked extensions and size limits), store the lead in Supabase,
// then, behind env switches, mirror it into BT-Digital's ops.leads, post the Slack
// card and send the notification email. Every extra is best-effort and never blocks
// the response. If nothing could store or send the lead, the route answers 503 and the
// form falls back to the prefilled email, so no lead is lost.

const RATE_LIMIT_WINDOW_MINUTES = 10;
const RATE_LIMIT_MAX_PER_IP = 5;
const TABLE = "betranslated_uk_quote_submissions";
// Source tags so UK leads are distinguishable from betranslated.com and .es leads.
const UTM_SOURCE = "betranslated-couk";
const UTM_MEDIUM = "betranslated-couk-site";
const REF_CODE = "UKBT";
const QUOTE_TYPE_BY_KIND = { translation: "translation", certified: "translation", interpreting: "interpretation" };
const QUOTE_TYPE_SUFFIX = { translation: "T", interpretation: "I", digital: "D", general: "G" };
const KINDS = ["translation", "certified", "interpreting"];
const ADMIN_ASSIGNEE_OPTIONS = ["Mike", "Caridad", "Elena", "Anna", "Maral", "Suzy", "Other"];

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    : null;
const mirrorOps = () => Boolean(supabase) && process.env.QUOTE_MIRROR_OPS_LEADS === "1";
const slackOn = () => mirrorOps() && process.env.QUOTE_SLACK_ENABLED === "1" && Boolean(process.env.SLACK_BOT_TOKEN && process.env.SLACK_LEADS_CHANNEL_ID);

function clientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : req.headers.get("x-real-ip") || null;
}

// In-memory limiter used when Supabase is not configured (per server instance).
const recent = new Map();
function memoryLimited(ip) {
  const now = Date.now();
  const since = now - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;
  const hits = (recent.get(ip) || []).filter((t) => t > since);
  if (hits.length >= RATE_LIMIT_MAX_PER_IP) { recent.set(ip, hits); return true; }
  hits.push(now);
  recent.set(ip, hits);
  return false;
}

async function rateLimited(ip) {
  if (!ip) return false;
  if (!supabase) return memoryLimited(ip);
  try {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count, error } = await supabase.from(TABLE).select("*", { count: "exact", head: true }).eq("ip", ip).gte("received_at", since);
    return !error && (count ?? 0) >= RATE_LIMIT_MAX_PER_IP;
  } catch (err) {
    console.error("rate limit check failed", err);
    return false;
  }
}

const escapeSlackText = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const leadProfileUrl = (leadId) =>
  `${(process.env.NEXT_PUBLIC_DASHBOARD_ORIGIN || "https://betranslated.com").replace(/\/$/, "")}/digital/admin/leads/${leadId}`;

// BT + MMDDYYYY + today's ops.leads count + quote-type letter + UK site code.
async function computeQuoteReference(quoteType) {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const mm = String(todayStart.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(todayStart.getUTCDate()).padStart(2, "0");
  const yyyy = todayStart.getUTCFullYear();
  let ref;
  try {
    if (!mirrorOps()) throw new Error("ops mirror off");
    const { count, error } = await supabase.schema("ops").from("leads").select("*", { count: "exact", head: true }).gte("created_at", todayStart.toISOString());
    if (error) throw error;
    ref = `BT${mm}${dd}${yyyy}-${String((count ?? 0) + 1).padStart(3, "0")}`;
  } catch {
    const now = new Date();
    ref = `BT${mm}${dd}${yyyy}-X${String(now.getUTCHours()).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}${Math.floor(Math.random() * 90 + 10)}`;
  }
  if (QUOTE_TYPE_SUFFIX[quoteType]) ref += `-${QUOTE_TYPE_SUFFIX[quoteType]}`;
  return `${ref}-${REF_CODE}`;
}

function buildLeadCardBlocks(leadId, ctx) {
  const fields = [
    { type: "mrkdwn", text: `*Reference:*\n\`${ctx.quoteReference}\`` },
    { type: "mrkdwn", text: `*Name:*\n${escapeSlackText(ctx.name)}` },
    { type: "mrkdwn", text: `*Email:*\n${escapeSlackText(ctx.email)}` },
    { type: "mrkdwn", text: `*Quote type:*\n${ctx.quoteType}` },
  ];
  if (ctx.phone) fields.push({ type: "mrkdwn", text: `*Phone:*\n${escapeSlackText(ctx.phone)}` });
  if (ctx.languages) fields.push({ type: "mrkdwn", text: `*Languages:*\n${escapeSlackText(ctx.languages)}` });
  fields.push({ type: "mrkdwn", text: `*Site:*\n\`${UTM_SOURCE}\`` });
  const blocks = [
    { type: "header", text: { type: "plain_text", text: `💬 ${ctx.quoteReference} · UK Quote: ${ctx.name}` } },
    { type: "section", fields },
  ];
  if (ctx.message) {
    const trimmed = ctx.message.length > 1500 ? `${ctx.message.slice(0, 1500)}…` : ctx.message;
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*Message:*\n${escapeSlackText(trimmed)}` } });
  }
  if (ctx.attachments?.length) {
    blocks.push({ type: "section", text: { type: "mrkdwn", text: `*Attachments:*\n${ctx.attachments.map((a) => `<${a.url}|${escapeSlackText(a.name)}>`).join("\n")}` } });
  }
  blocks.push({ type: "section", text: { type: "mrkdwn", text: "*Account Manager:* -" } });
  // Same action ids as BT-Digital's cards, so its Slack interactions keep working.
  blocks.push({
    type: "actions",
    block_id: `lead_assignment_picker:${leadId}`,
    elements: [
      {
        type: "static_select",
        action_id: "lead_assignment_pick",
        placeholder: { type: "plain_text", text: "-" },
        options: ADMIN_ASSIGNEE_OPTIONS.map((n) => ({ text: { type: "plain_text", text: n }, value: n })),
      },
      {
        type: "button",
        text: { type: "plain_text", text: "Send to Spam" },
        style: "danger",
        action_id: "lead_mark_spam",
        value: leadId,
        confirm: {
          title: { type: "plain_text", text: "Send to Spam?" },
          text: { type: "plain_text", text: "This marks the lead as spam. It can be reverted from the dashboard or Slack." },
          confirm: { type: "plain_text", text: "Send to Spam" },
          deny: { type: "plain_text", text: "Cancel" },
        },
      },
      { type: "button", text: { type: "plain_text", text: "Send to Services" }, action_id: "lead_send_to_services", value: leadId },
    ],
  });
  blocks.push({ type: "context", elements: [{ type: "mrkdwn", text: `Source: UK Quote · <${leadProfileUrl(leadId)}|Open lead profile>` }] });
  return blocks;
}

async function postLeadToSlack(leadId, ctx) {
  if (!slackOn()) return;
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_LEADS_CHANNEL_ID;
  try {
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        channel,
        text: `💬 ${ctx.quoteReference} · New UK quote from ${ctx.name} (${ctx.email})`,
        blocks: buildLeadCardBlocks(leadId, ctx),
      }),
    });
    const json = await res.json();
    if (!json.ok) { console.error("slack post failed", json.error); return; }
    if (json.ts) {
      await supabase.schema("ops").from("leads").update({ slack_lead_channel_id: channel, slack_lead_message_ts: json.ts }).eq("id", leadId);
    }
  } catch (err) {
    console.error("slack post threw", err);
  }
}

// Uploads each attachment to the private lead-uploads bucket (shared with BT-Digital),
// records it in ops.lead_attachments when the ops mirror is on, and returns 14-day
// signed download links (forced download, never inline). Best-effort per file.
async function uploadAttachments(leadId, quoteReference, fileBuffers) {
  const links = [];
  if (!supabase || !fileBuffers?.length) return links;
  const year = new Date().getUTCFullYear();
  for (let i = 0; i < fileBuffers.length; i++) {
    const f = fileBuffers[i];
    const name = sanitizeFilename(f.name);
    const storagePath = `quote-uk/${year}/${quoteReference}-${i + 1}-${name}`;
    try {
      const { error: upErr } = await supabase.storage.from(LEAD_UPLOAD_BUCKET).upload(storagePath, f.buffer, { contentType: f.type || "application/octet-stream", upsert: false });
      if (upErr) throw upErr;
      if (mirrorOps() && leadId) {
        await supabase.schema("ops").from("lead_attachments").insert({ lead_id: leadId, file_path: storagePath, file_name: name, file_size: f.size });
      }
      const { data: signed, error: signErr } = await supabase.storage.from(LEAD_UPLOAD_BUCKET).createSignedUrl(storagePath, 60 * 60 * 24 * 14, { download: true });
      if (signErr) throw signErr;
      if (signed?.signedUrl) links.push({ name, url: signed.signedUrl, size: f.size });
    } catch (err) {
      console.error("attachment upload/sign failed", name, err);
    }
  }
  return links;
}

// Mirrors the lead into BT-Digital's ops.leads (behind QUOTE_MIRROR_OPS_LEADS).
// Returns the lead id when the row was written, else null.
async function mirrorToOpsLeads(entry, leadId, quoteType, quoteReference) {
  if (!mirrorOps()) return null;
  const a = entry.details?.attribution || {};
  const { error } = await supabase.schema("ops").from("leads").insert({
    id: leadId,
    name: entry.name,
    email: entry.email.toLowerCase(),
    phone: entry.phone,
    message: entry.message,
    source: "quote",
    quote_type: quoteType,
    locale: "en",
    utm_source: UTM_SOURCE,
    utm_medium: UTM_MEDIUM,
    utm_campaign: a.utm_campaign || null,
    referrer: a.referrer || null,
    landing_page: a.landing_page || null,
    utm_term: a.utm_term || null,
    utm_content: a.utm_content || null,
    gclid: a.gclid || null,
    msclkid: a.msclkid || null,
    fbclid: a.fbclid || null,
    quote_reference: quoteReference,
  });
  if (error) { console.error("ops.leads insert failed", error); return null; }
  return leadId;
}

export async function POST(req) {
  const ip = clientIp(req);
  if (await rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body;
  const fileBuffers = [];
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    let form;
    try { form = await req.formData(); } catch { return NextResponse.json({ ok: false, error: "invalid_form" }, { status: 400 }); }
    body = {};
    for (const [k, v] of form.entries()) {
      if (k === "files") continue;
      if (typeof v === "string" && body[k] == null) body[k] = v;
    }
    const rawFiles = form.getAll("files").filter((f) => f && typeof f === "object" && "arrayBuffer" in f && f.size > 0);
    let total = 0;
    for (const f of rawFiles.slice(0, MAX_ATTACHMENTS_PER_SUBMISSION)) {
      if (isBlockedExtension(f.name) || total + f.size > MAX_TOTAL_UPLOAD_BYTES) continue;
      total += f.size;
      fileBuffers.push({ name: f.name, type: f.type, size: f.size, buffer: Buffer.from(await f.arrayBuffer()) });
    }
  } else {
    try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 }); }
  }

  const { name, email, phone, type, website_url, website, "cf-turnstile-response": turnstileToken, files: _files, ...rest } = body || {};
  // Honeypot filled in: a bot. Answer ok so it moves on, store nothing.
  if (String(website_url || website || "").trim()) return NextResponse.json({ ok: true });
  if (!String(name || "").trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""))) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 422 });
  }
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "spam_check_failed" }, { status: 400 });
  }

  const clip = (x, n = 2000) => (x == null || x === "" ? null : String(x).trim().slice(0, n) || null);
  const details = Object.fromEntries(
    Object.entries(rest)
      .filter(([k]) => !k.startsWith("attr_"))
      .slice(0, 30)
      .map(([k, x]) => [k.slice(0, 40), clip(x)])
      .filter(([, x]) => x !== null),
  );
  // Visit attribution (lib/attribution.js: attr_referrer, attr_landing_page, attr_utm_*, attr_gclid...),
  // stored with the lead as one nested object.
  const attribution = Object.fromEntries(
    Object.entries(rest)
      .filter(([k]) => k.startsWith("attr_"))
      .slice(0, 12)
      .map(([k, x]) => [k.slice(5, 45), clip(x, 300)])
      .filter(([, x]) => x !== null),
  );
  if (Object.keys(attribution).length) details.attribution = attribution;

  const message = String(details.message || "").trim();
  delete details.message;
  const kind = KINDS.includes(type) ? type : null;
  const deadline = /^\d{4}-\d{2}-\d{2}$/.test(String(details.deadline || "")) ? details.deadline : null;
  const entry = {
    kind,
    name: String(name).trim().slice(0, 200),
    email: String(email).trim().slice(0, 200),
    phone: clip(phone, 60),
    languages: clip(details.languages, 300),
    message,
    deadline,
    details,
    files: fileBuffers.map((f) => f.name),
  };

  const quoteType = QUOTE_TYPE_BY_KIND[kind] || "translation";
  const leadId = randomUUID();
  const quoteReference = await computeQuoteReference(quoteType);

  let stored = false;
  if (supabase) {
    const { error } = await supabase.from(TABLE).insert({
      kind: entry.kind,
      name: entry.name,
      email: entry.email,
      phone: entry.phone,
      languages: entry.languages,
      message: entry.message || null,
      deadline: entry.deadline,
      files: entry.files,
      details: entry.details,
      ip,
    });
    if (error) console.error("quote insert failed", error);
    else stored = true;
  }

  const attachments = await uploadAttachments(leadId, quoteReference, fileBuffers);
  const mirrored = await mirrorToOpsLeads(entry, leadId, quoteType, quoteReference);
  if (mirrored) {
    await postLeadToSlack(leadId, { ...entry, quoteType, quoteReference, attachments });
  }
  const emailed = await sendQuoteNotification({ entry, quoteReference, attachments });

  // Nothing stored and nothing sent: tell the form to use its email fallback.
  if (!stored && !emailed && !mirrored) {
    return NextResponse.json({ ok: false, error: emailConfigured() || supabase ? "delivery_failed" : "not_configured" }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
