"use client";

import { useEffect, useState } from "react";

const LABEL = {
  es: { dark: "Activar modo oscuro", light: "Activar modo claro" },
  en: { dark: "Switch to dark mode", light: "Switch to light mode" },
  fr: { dark: "Activer le mode sombre", light: "Activer le mode clair" },
};

// Light/dark switch. Without a choice the site follows the system setting;
// a click stores the choice (localStorage "bt-theme") and sets
// html[data-theme], which app/dark.css honours (lib/themeScript.js restores it
// before the first paint).

const isDark = () => {
  const t = document.documentElement.getAttribute("data-theme");
  return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function ThemeToggle({ locale = "en" }) {
  const [dark, setDark] = useState(null);
  useEffect(() => {
    setDark(isDark());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setDark(isDark());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const toggle = () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("bt-theme", next); } catch (e) {}
    setDark(next === "dark");
  };
  const l = LABEL[locale] || LABEL.en;
  const label = dark ? l.light : l.dark;
  return (
    <button type="button" className="bt-theme" onClick={toggle} aria-label={label} title={label} aria-pressed={dark === null ? undefined : dark}>
      <svg className="bt-theme__sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      <svg className="bt-theme__moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5z" /></svg>
    </button>
  );
}
