"use client";

import { useEffect, useState } from "react";

// Cookie banner (AEPD guidance): accept and reject side by side with the same
// weight, a link to the cookie policy, and a way back (the footer "Cookies"
// link dispatches "bt:cookies"). The choice is kept for 12 months. Accepting
// loads the analytics tags through window.btLoadTracking (components/Tracking.jsx).
const KEY = "bt-consent";
const TTL = 365 * 24 * 3600 * 1000;

const L = {
  en: {
    title: "Cookies",
    text: "We use analytics cookies to see how the site is used and improve it. They only switch on if you accept.",
    short: "Analytics cookies, only if you accept.",
    accept: "Accept", reject: "Reject", policy: "Terms & conditions", href: "/terms-conditions/",
  },
};

const localeOf = () => "en";

function read() {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || "null");
    return c && Date.now() - c.t < TTL ? c.v : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState("es");

  useEffect(() => {
    setLocale(localeOf(window.location.pathname));
    if (!read()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("bt:cookies", reopen);
    return () => window.removeEventListener("bt:cookies", reopen);
  }, []);

  function choose(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() })); } catch {}
    if (v === "granted") window.btLoadTracking?.();
    else if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
    setOpen(false);
  }

  if (!open) return null;
  const l = L[locale] || L.en;
  return (
    <div className="cc is-open" role="dialog" aria-live="polite" aria-labelledby="cc-title" aria-describedby="cc-text">
      <p className="cc__title" id="cc-title">{l.title}</p>
      <p className="cc__text" id="cc-text"><span className="cc__long">{l.text}</span><span className="cc__short">{l.short}</span> <a href={l.href} hrefLang="en">{l.policy}</a></p>
      <div className="cc__actions">
        <button type="button" className="cc__btn" onClick={() => choose("denied")}>{l.reject}</button>
        <button type="button" className="cc__btn" onClick={() => choose("granted")}>{l.accept}</button>
      </div>
    </div>
  );
}
