// Notification email for the UK quote form. Env-gated: with no RESEND_API_KEY,
// QUOTE_FROM_EMAIL or QUOTE_NOTIFY_EMAIL, sendQuoteNotification() does nothing and
// returns false. Returns true only when the email was handed to Resend.
import { Resend } from "resend";

let _client = null;
function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_client) _client = new Resend(key);
  return _client;
}

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.QUOTE_FROM_EMAIL && process.env.QUOTE_NOTIFY_EMAIL);
}

export async function sendQuoteNotification({ entry, quoteReference, attachments }) {
  const resend = emailConfigured() ? client() : null;
  if (!resend) return false;
  const rows = [
    ["Reference", quoteReference],
    ["Form", entry.kind],
    ["Name", entry.name],
    ["Email", entry.email],
    ["Phone", entry.phone],
    ["Languages", entry.languages],
    ["Deadline", entry.deadline],
    ...Object.entries(entry.details || {})
      .filter(([k]) => !["attribution", "message", "languages", "type", "page"].includes(k))
      .map(([k, v]) => [k, v]),
    ["Page", entry.details?.page],
    ["Source", entry.details?.attribution ? Object.values(entry.details.attribution).join(", ") : null],
  ].filter(([, v]) => v);
  const table = rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td>${esc(v)}</td></tr>`).join("");
  const filesHtml = attachments?.length
    ? `<p><strong>Attachments:</strong></p><ul>${attachments.map((a) => `<li><a href="${esc(a.url)}">${esc(a.name)}</a></li>`).join("")}</ul>`
    : entry.files?.length ? `<p><strong>Files sent:</strong> ${esc(entry.files.join(", "))}</p>` : "";
  const html = `
    <table>${table}</table>
    ${entry.message ? `<p><strong>Message:</strong><br>${esc(entry.message).replace(/\n/g, "<br>")}</p>` : ""}
    ${filesHtml}
  `;
  try {
    const { error } = await resend.emails.send({
      from: process.env.QUOTE_FROM_EMAIL,
      to: process.env.QUOTE_NOTIFY_EMAIL,
      replyTo: entry.email,
      subject: `${quoteReference} · New quote request (${entry.name})`,
      html,
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("quote notification email failed", err);
    return false;
  }
}
