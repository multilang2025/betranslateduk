// Cloudflare Turnstile verification for the quote form. Env-gated: with no
// TURNSTILE_SECRET_KEY, verifyTurnstile() always passes, so the form works
// without it. To switch it on, create a Turnstile site in the Cloudflare
// dashboard, then set TURNSTILE_SECRET_KEY (server) and
// NEXT_PUBLIC_TURNSTILE_SITE_KEY (browser widget, components/home/TurnstileField.jsx).
// A request without a token is refused once the secret is set; the form then
// falls back to the email route, so no lead is lost.
export async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    });
    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error("turnstile verify failed", err);
    // Fail open: a Cloudflare outage should not block every lead.
    return true;
  }
}
