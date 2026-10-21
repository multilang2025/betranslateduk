"use client";

import { useEffect, useState } from "react";

// Cookie banner: accept and reject side by side with the same weight, a link
// to the terms page, and a way back (the footer "Cookie settings" link
// dispatches "bt:cookies"). The choice is kept for 12 months.
const KEY = "bt-consent";
const TTL = 365 * 24 * 3600 * 1000;

const L = {
  title: "Cookies",
  text: "We use analytics cookies to see how the site is used and improve it. They only switch on if you accept.",
  accept: "Accept", reject: "Reject", policy: "Terms & Conditions", href: "/terms-conditions/",
};

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

  useEffect(() => {
    if (!read()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener("bt:cookies", reopen);
    return () => window.removeEventListener("bt:cookies", reopen);
  }, []);

  function choose(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() })); } catch {}
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="cc is-open" role="dialog" aria-live="polite" aria-labelledby="cc-title" aria-describedby="cc-text">
      <p className="cc__title" id="cc-title">{L.title}</p>
      <p className="cc__text" id="cc-text">{L.text} <a href={L.href}>{L.policy}</a></p>
      <div className="cc__actions">
        <button type="button" className="cc__btn" onClick={() => choose("denied")}>{L.reject}</button>
        <button type="button" className="cc__btn" onClick={() => choose("granted")}>{L.accept}</button>
      </div>
    </div>
  );
}
