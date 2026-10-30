"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile widget for the quote form. Renders nothing unless
// NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. The widget adds a hidden input named
// cf-turnstile-response to the surrounding form, which app/api/quote/route.js verifies.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export default function TurnstileField() {
  const box = useRef(null);

  useEffect(() => {
    if (!SITE_KEY || !box.current) return undefined;
    let widget = null;
    let cancelled = false;
    const render = () => {
      if (cancelled || !window.turnstile || !box.current) return;
      widget = window.turnstile.render(box.current, { sitekey: SITE_KEY, theme: "auto" });
    };
    if (window.turnstile) render();
    else {
      let s = document.querySelector(`script[src="${SRC}"]`);
      if (!s) {
        s = document.createElement("script");
        s.src = SRC;
        s.async = true;
        document.head.appendChild(s);
      }
      s.addEventListener("load", render);
    }
    return () => {
      cancelled = true;
      if (widget != null && window.turnstile) window.turnstile.remove(widget);
    };
  }, []);

  return SITE_KEY ? <div ref={box} className="quote-form__turnstile" /> : null;
}
