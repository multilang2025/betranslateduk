"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND, WHATSAPP } from "./socialIcons";

const L = {
  es: { wa: "Escríbenos por WhatsApp", waText: "Hola, quiero pedir un presupuesto de traducción.", prev: "Sección anterior", next: "Sección siguiente", top: "Volver arriba", nav: "Navegar por la página" },
  en: { wa: "Message us on WhatsApp", waText: "Hello, I would like a translation quote.", prev: "Previous section", next: "Next section", top: "Back to top", nav: "Page navigation" },
  fr: { wa: "Écrivez-nous sur WhatsApp", waText: "Bonjour, je souhaite un devis de traduction.", prev: "Section précédente", next: "Section suivante", top: "Retour en haut", nav: "Navigation dans la page" },
};

const localeOf = () => "en";
const clip = (s, n = 46) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

// Section headings the arrows step through: visible H2s inside <main>.
function headings() {
  return Array.from(document.querySelectorAll("main h2")).filter((h) => h.offsetParent !== null && h.textContent.trim());
}

function headerOffset() {
  const h = document.querySelector(".bt-header");
  return (h ? h.getBoundingClientRect().height : 72) + 16;
}

// Floating WhatsApp button plus a section stepper: previous section, a ring
// that fills with reading progress and takes you back to the top, next section.
// The hint beside each arrow names the section it jumps to.
export default function FloatingTools() {
  const [locale, setLocale] = useState("en");
  const [shown, setShown] = useState(false);
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const ring = useRef(null);
  const targets = useRef({ prev: null, next: null });

  useEffect(() => {
    setLocale(localeOf(window.location.pathname));
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ring.current) ring.current.style.strokeDashoffset = String(100 - (max > 0 ? Math.min(100, (y / max) * 100) : 0));
      setShown(y > 500);
      const off = headerOffset() + 4;
      let p = null;
      let n = null;
      for (const h of headings()) {
        const top = h.getBoundingClientRect().top;
        if (top < off - 8) p = h;
        else if (top > off + 8 && !n) n = h;
      }
      targets.current = { prev: p, next: n };
      setPrev(p ? clip(p.textContent.trim()) : null);
      setNext(n ? clip(n.textContent.trim()) : null);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const smooth = () => (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  const go = (el) => {
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - headerOffset(), behavior: smooth() });
  };
  const top = () => window.scrollTo({ top: 0, behavior: smooth() });

  const l = L[locale] || L.es;
  const chev = (d) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
  );

  return (
    <div className={"ftools" + (shown ? " is-shown" : "")}>
      <nav className="ftools__nav" aria-label={l.nav}>
        <button type="button" className="ftools__step" onClick={() => go(targets.current.prev)} disabled={!prev} aria-label={prev ? `${l.prev}: ${prev}` : l.prev}>
          {chev("m6 15 6-6 6 6")}
          {prev ? <span className="ftools__hint" aria-hidden="true">{prev}</span> : null}
        </button>
        <button type="button" className="ftools__top" onClick={top} aria-label={l.top}>
          <svg className="ftools__ring" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="15.9" pathLength="100" className="ftools__track" />
            <circle ref={ring} cx="18" cy="18" r="15.9" pathLength="100" className="ftools__fill" />
          </svg>
          {chev("M12 19V5M5 12l7-7 7 7")}
          <span className="ftools__hint" aria-hidden="true">{l.top}</span>
        </button>
        <button type="button" className="ftools__step" onClick={() => go(targets.current.next)} disabled={!next} aria-label={next ? `${l.next}: ${next}` : l.next}>
          {chev("m6 9 6 6 6-6")}
          {next ? <span className="ftools__hint" aria-hidden="true">{next}</span> : null}
        </button>
      </nav>
      <a
        className="ftools__wa"
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(l.waText)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={l.wa}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d={BRAND.whatsapp} /></svg>
        <span className="ftools__hint ftools__hint--wa" aria-hidden="true">{l.wa}</span>
      </a>
    </div>
  );
}
