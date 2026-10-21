"use client";

// Footer link that reopens the cookie banner (components/chrome/CookieConsent.jsx).
export default function CookieSettingsLink({ label }) {
  return (
    <button type="button" className="bt-footer__link bt-footer__cookies" onClick={() => window.dispatchEvent(new Event("bt:cookies"))}>
      {label}
    </button>
  );
}
