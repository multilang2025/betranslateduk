// Shared constants/helpers for quote-form file attachments (app/api/quote/
// route.js). Mirrors BT-Digital's own lib/uploads.ts (same Supabase project,
// same private "lead-uploads" bucket, same limits and blocklist) rather than
// inventing a separate convention, since both apps' admins read these files
// from the same ops.lead_attachments table.

/** Private Supabase Storage bucket shared with BT-Digital's own uploads. */
export const LEAD_UPLOAD_BUCKET = "lead-uploads";

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
// This form already enforces a lower 25 MB *total* (components/home/
// QuoteForm.jsx MAX_TOTAL_MB) client-side; this is the per-file ceiling.
export const MAX_TOTAL_UPLOAD_BYTES = 25 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_SUBMISSION = 10;

// shortcut: extension allowlist/blocklist only, no magic-byte sniffing of the
// actual file contents -- upgrade to content-type sniffing (e.g. file-type
// package) if a malicious upload ever gets past this.
const BLOCKED_EXTENSIONS = new Set([
  "exe", "msi", "bat", "cmd", "com", "scr", "pif", "cpl",
  "sh", "bash", "ps1", "vbs", "vbe", "js", "jse", "wsf", "wsh",
  "jar", "app", "dmg", "deb", "rpm", "apk",
  "html", "htm", "xhtml", "shtml", "mhtml", "svg",
  "php", "php3", "php4", "php5", "php7", "phtml", "phar",
  "asp", "aspx", "jsp", "jspx", "hta",
]);

export function fileExtension(name) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function isBlockedExtension(name) {
  return BLOCKED_EXTENSIONS.has(fileExtension(name));
}

/** Sanitise a user-supplied filename for safe storage. */
export function sanitizeFilename(name) {
  const base = String(name || "")
    .replace(/[\r\n\t]/g, " ")
    .replace(/[^A-Za-z0-9._ -]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const safe = base.length > 0 ? base : "attachment";
  return safe.length > 120 ? safe.slice(-120) : safe;
}
