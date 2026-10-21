"use client";

import { useEffect, useRef, useState } from "react";
// Rating and review count (99 Google reviews, 5.0) and the Google Business
// Profile link: one shared constant, also read by the Product JSON-LD.
import { RATING, GBP_URL } from "../lib/business";

const COPY = {
  en: { rating: "Average rating", reviews: "Google reviews", pairs: "languages we translate", since: "Since", quote: "Reply to your quote", hours: "2 h", note: "During UK business hours." },
};

const ease = (t) => 1 - Math.pow(1 - t, 3);

// Counts from `from` to `to` once `run` is true.
function useCount(to, run, { from = 0, ms = 1400, decimals = 0 } = {}) {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!run) { setV(from); return; }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      setV(from + (to - from) * ease(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, to, from, ms]);
  return decimals ? v.toFixed(decimals) : Math.round(v);
}

function Stars({ run }) {
  return (
    <span className="trust__stars" role="img" aria-label="5 / 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" width="18" height="18" style={{ transitionDelay: `${run ? 120 * i + 200 : 0}ms` }} aria-hidden="true">
          <path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8z" />
        </svg>
      ))}
    </span>
  );
}

export default function TrustStrip({ pairs = 7, since = 2002 }) {
  const c = COPY.en;
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    setArmed(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setRun(true); io.disconnect(); }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const live = armed && run;
  const rating = useCount(RATING.value, live, { decimals: 1, ms: 1100 });
  const reviews = useCount(RATING.count, live, { ms: 1500 });
  const langs = useCount(pairs, live, { ms: 1300 });
  const year = useCount(since, live, { from: since - 24, ms: 1500 });
  // Without the animation (reduced motion, no IntersectionObserver) the
  // counters never run, so they show the final figures.
  const showRating = !armed ? RATING.value.toFixed(1) : run ? rating : (0).toFixed(1);

  return (
    <section className="trust-wrap">
      <div className="container container--narrow">
        <div ref={ref} className={"trust" + (armed ? " trust--armed" : "") + (run ? " trust--in" : "")}>
          <div className="trust__item trust__item--rating">
            <div className="trust__num">
              <span>{showRating}</span>
              <Stars run={live} />
            </div>
            <a className="trust__label trust__label--link" href={GBP_URL} target="_blank" rel="noopener noreferrer">
              <strong>{!armed ? RATING.count : run ? reviews : 0}</strong> {c.reviews}
            </a>
          </div>
          <div className="trust__item">
            <div className="trust__num"><span>{!armed ? pairs : run ? langs : 0}+</span></div>
            <div className="trust__label">{c.pairs}</div>
          </div>
          <div className="trust__item">
            <div className="trust__num"><span>{!armed ? since : run ? year : since - 24}</span></div>
            <div className="trust__label">{c.since}</div>
          </div>
          {/* The caveat is a tooltip on hover/focus instead of a footnote line. */}
          <div className="trust__item trust__item--tip" tabIndex={0} aria-describedby="trust-note">
            <div className="trust__num"><span>{c.hours}</span><sup className="trust__ast" aria-hidden="true">*</sup></div>
            <div className="trust__label">{c.quote}</div>
            <span className="trust__tip" id="trust-note" role="tooltip">{c.note}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
