// First-party visit attribution for lead forms. Stores where the visitor came
// from (external referrer, landing page, utm_* and the ad click ids) in
// sessionStorage, so a quote form submitted later in the same visit can send it
// along. Nothing is sent anywhere by this module and nothing outlives the tab,
// so it needs no cookie consent.
//
// Self-contained on purpose: copy this file to any new site, call
// captureAttribution() once per page load and getAttribution() when a form
// submits (see components/AttributionCapture.jsx and components/home/QuoteForm.jsx).
const KEY = "bt_attribution_v1";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "msclkid", "fbclid"];

function read() {
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

// First touch of the visit wins, unless a later page arrives with new campaign
// parameters (the visitor clicked another ad): then that campaign replaces it.
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const params = new URL(window.location.href).searchParams;
    const found = {};
    for (const p of PARAMS) {
      const v = params.get(p);
      if (v) found[p] = v.slice(0, 200);
    }
    const prev = read();
    if (prev && !Object.keys(found).length) return;
    let referrer = "";
    try {
      const r = new URL(document.referrer);
      // External referrers only, without the query string.
      if (r.hostname !== window.location.hostname) referrer = (r.origin + r.pathname).slice(0, 300);
    } catch {}
    window.sessionStorage.setItem(KEY, JSON.stringify({
      ...found,
      referrer: referrer || (prev && prev.referrer) || "",
      landing_page: window.location.pathname,
      at: new Date().toISOString(),
    }));
  } catch {}
}

// Flat { attr_referrer, attr_landing_page, attr_utm_source, ... } ready to merge
// into a form payload; empty when nothing was captured.
export function getAttribution() {
  if (typeof window === "undefined") return {};
  const a = read() || {};
  const out = {};
  for (const [k, v] of Object.entries(a)) if (v) out[`attr_${k}`] = String(v);
  return out;
}
