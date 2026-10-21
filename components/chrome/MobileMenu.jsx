"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const COPY = { open: "Open menu", close: "Close menu", title: "Menu", call: "Call us", note: "Reply within a maximum of 8 hours" };
const PHONE = { href: "tel:+442030269848", label: "+44 20 3026 9848" };

// One small line icon per top-level item, in menu order.
const NAV_ICONS = [
  <path key="home" d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  <g key="grid"><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></g>,
  <g key="globe"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></g>,
  <g key="layers"><path d="M12 2 2 7l10 5 10-5z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></g>,
  <g key="users"><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18 14.4c2 .8 3.4 2.8 3.4 5.6" /></g>,
  <g key="users2"><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /></g>,
  <g key="book"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M8 7h7M8 11h7" /></g>,
];

// Hamburger + slide-over drawer for < 900px. The drawer is portalled to
// <body>: the sticky header uses backdrop-filter, which would otherwise trap
// position:fixed children inside the header box. Locks body scroll while
// open, closes on Escape, scrim tap or link tap.
export default function MobileMenu({ items, ctaLabel, ctaHref }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname() || "/";
  const isHere = (href, exact) => (exact || href === "/" ? pathname === href : pathname.startsWith(href));

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const drawer = (
    <>
      <div className={"bt-scrim" + (open ? " is-open" : "")} onClick={close} aria-hidden="true" />
      <aside id="bt-drawer" className={"bt-drawer" + (open ? " is-open" : "")} aria-hidden={!open} inert={!open} aria-label={COPY.title}>
        <div className="bt-drawer__head">
          <span className="bt-drawer__title">{COPY.title}</span>
          <button type="button" className="bt-drawer__close" aria-label={COPY.close} onClick={close}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        <nav className="bt-drawer__nav" aria-label={COPY.title}>
          {items.map((item, i) => [
            <a key={item.href} href={item.href} className={"bt-drawer__link" + (isHere(item.href) ? " is-current" : "")} aria-current={isHere(item.href, true) ? "page" : undefined} onClick={close}>
              <span className="bt-drawer__ico"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{NAV_ICONS[i % NAV_ICONS.length]}</svg></span>
              <span className="bt-drawer__label">{item.label}</span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </a>,
            ...(item.children || []).map((ch) => (
              <a key={ch.href} href={ch.href} className={"bt-drawer__link bt-drawer__link--sub" + (isHere(ch.href, true) ? " is-current" : "")} aria-current={isHere(ch.href, true) ? "page" : undefined} onClick={close}>
                <span className="bt-drawer__label">{ch.label}</span>
              </a>
            )),
          ])}
        </nav>
        <div className="bt-drawer__cta">
          <a href={ctaHref} className="bt-btn bt-btn--primary bt-drawer__quote" onClick={close}>{ctaLabel}</a>
          <a href={PHONE.href} className="bt-btn bt-btn--ghost bt-drawer__call">{COPY.call} · {PHONE.label}</a>
          <p className="bt-drawer__note">{COPY.note}</p>
        </div>
      </aside>
    </>
  );

  return (
    <>
      <button
        type="button"
        className="bt-burger"
        aria-label={open ? COPY.close : COPY.open}
        aria-expanded={open}
        aria-controls="bt-drawer"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={"bt-burger__bars" + (open ? " is-open" : "")} />
      </button>
      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
