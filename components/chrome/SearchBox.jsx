"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { t, SUGGEST, KIND } from "../../lib/i18n";

const Icon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  </svg>
);

// Header search: icon button (or Ctrl/Cmd+K) -> command-palette style dialog
// with live results from /api/search and quick links when empty.
export default function SearchBox({ locale = "en" }) {
  const ui = t(locale);
  const kind = KIND[locale] || KIND.en;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) { setResults(null); return; }
    const ctrl = new AbortController();
    const id = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?locale=${locale}&q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        setResults((await r.json()).results);
        setActive(0);
      } catch {}
    }, 160);
    return () => { clearTimeout(id); ctrl.abort(); };
  }, [q, locale]);

  function onKeyDown(e) {
    if (!results?.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter") window.location.href = results[active].href;
  }

  return (
    <>
      <button type="button" className="bt-iconbtn" aria-label={ui.search} onClick={() => setOpen(true)}><Icon /></button>
      {open && mounted ? createPortal(
        <div className="sx" role="dialog" aria-modal="true" aria-label={ui.search} onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="sx__panel">
            <div className="sx__bar">
              <Icon size={22} />
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown} placeholder={ui.searchPlaceholder} aria-label={ui.search} autoComplete="off" />
              <button type="button" className="sx__esc" onClick={() => setOpen(false)} aria-label={ui.close}>Esc</button>
            </div>
            <div className="sx__body" aria-live="polite">
              {results === null ? (
                <>
                  <p className="sx__label">{q.trim().length ? ui.searchHint : "Top"}</p>
                  <ul className="sx__quick">
                    {(SUGGEST[locale] || SUGGEST.en).map(([label, href]) => (
                      <li key={href}><a href={href}>{label}</a></li>
                    ))}
                  </ul>
                </>
              ) : null}
              {results && !results.length ? <p className="sx__empty">{ui.searchEmpty}</p> : null}
              {results?.length ? (
                <ul className="sx__list">
                  {results.map((r, i) => (
                    <li key={r.href}>
                      <a href={r.href} className={i === active ? "is-active" : ""} onMouseEnter={() => setActive(i)}>
                        <span className="sx__kind">{kind[r.kind] || r.kind}</span>
                        <span className="sx__text">
                          <strong>{r.title}</strong>
                          {r.snippet ? <small>{r.snippet}</small> : null}
                        </span>
                        <span className="sx__go" aria-hidden="true">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>,
        document.body
      ) : null}
    </>
  );
}
