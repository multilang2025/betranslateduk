"use client";
import { useEffect, useRef, useState } from "react";

const ICONS = [
  // 1 the team is notified: bell
  <>
    <path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16z" />
    <path d="M10 21a2 2 0 0 0 4 0" />
    <circle className="pm-ac" cx="18" cy="6" r="2.4" />
  </>,
  // 2 we reply: envelope
  <>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M3 8l9 6 9-6" />
    <circle className="pm-ac" cx="12" cy="14" r="1.6" />
  </>,
  // 3 we start the project: flag
  <>
    <path d="M5 21V4" />
    <path d="M5 5h12l-2 4 2 4H5" />
    <path className="pm-ac" d="M5 5h12l-2 4 2 4H5z" />
  </>,
  // 4 delivery: document with check
  <>
    <path d="M6 3h9l4 4v14H6z" />
    <path d="M15 3v4h4" />
    <path d="M9 14l2.2 2.2L15.5 12" />
  </>,
  // 5 follow-up and invoice: receipt
  <>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
    <path d="M9 8h6M9 12h6" />
    <circle className="pm-ac" cx="9" cy="16" r="1.2" />
  </>,
];

export default function ProcessMap({ steps }) {
  const root = useRef(null);
  const [armed, setArmed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(() => steps.map(() => false));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      setShown(steps.map(() => true));
      return undefined;
    }
    setArmed(true);
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = root.current;
      if (!el) return;
      const mid = window.innerHeight * 0.62;
      const list = el.querySelector(".pmap__list").getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, (mid - list.top) / list.height)));
      const nodes = el.querySelectorAll(".pmap__node");
      // Steps follow the scroll both ways: they appear going down and conceal again going back up.
      setShown((prev) => {
        const next = Array.from(nodes, (n) => {
          const r = n.getBoundingClientRect();
          return r.top + r.height / 2 <= mid + 40;
        });
        return next.length === prev.length && next.every((v, i) => v === prev[i]) ? prev : next;
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [steps]);

  return (
    <div className={"pmap" + (armed ? " pmap--armed" : "")} ref={root}>
      <div className="pmap__cue" aria-hidden="true"><span><svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 9l6 6 6-6" /></svg></span></div>
      <ol className="pmap__list">
        <span className="pmap__spine" aria-hidden="true"><span className="pmap__fill" style={{ height: `${progress * 100}%` }} /></span>
        {steps.map(([title, body], i) => (
          <li key={title} className={"pmap__item " + (i % 2 ? "pmap__item--r" : "pmap__item--l") + (shown[i] ? " is-in" : "")}>
            <div className="pmap__card">
              <strong>{title}</strong>
              <span>{body}</span>
            </div>
            <span className="pmap__node" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28">{ICONS[i % ICONS.length]}</svg>
            </span>
          </li>
        ))}
      </ol>
      <div className={"pmap__end" + (progress > 0.96 ? " is-in" : "")} aria-hidden="true">
        <span><svg viewBox="0 0 24 24" width="26" height="26"><path d="M12 4v15M6 13l6 6 6-6" /></svg></span>
      </div>
    </div>
  );
}
