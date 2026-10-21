"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Real Google reviews (Agencia de traducción BeTranslated SL -- place id
// ChIJ0Sk8jvRIYA0R9J6Ne-7b8cw), transcribed verbatim from screenshots of the
// live Google Business Profile (2026-10-14). Reviews are genuinely
// multilingual on Google itself, so the same set is shown in every locale
// rather than re-translated per locale. Two additional 5-star reviews seen
// in the same screenshots (Elias; Andrea Comesana Ruibal) were left out
// because Google's own UI truncates them with "... More" and the full text
// wasn't available -- add them once the complete text is provided, rather
// than guessing the rest.
const REVIEWS = [
  {
    name: "Mariany Ch. C.",
    meta: { es: "8 reseñas en Google", en: "8 reviews on Google", fr: "8 avis sur Google" },
    text: "Son muy amables. Tienen un servicio rápido y muy bueno, traducciones con gran detalle. Recomiendo BeTranslated 100%. Gracias",
  },
  {
    name: "Ines Pietrzak",
    meta: { es: "6 reseñas en Google", en: "6 reviews on Google", fr: "6 avis sur Google" },
    text: "Amazing service! Very professional and quick. Greta communication via WhatsApp and email. I needed my documents very last minute and BeTranslated bent over back to help me with it, delivering hard copy too! Thank you - will use them definitely again in future.",
  },
  {
    name: "David Leciñana Cárcoba",
    meta: { es: "5 reseñas en Google", en: "5 reviews on Google", fr: "5 avis sur Google" },
    text: "Empresa proactiva y dispuesta a ayudar. La recomiendo para cuestiones de traducción y posicionamiento de sitios web en varios idiomas. En mi caso fue con el plugin WPML.",
  },
  {
    name: "Cesar Calberto",
    meta: { es: "3 reseñas en Google", en: "3 reviews on Google", fr: "3 avis sur Google" },
    text: "Annalisa me brindó un excelente servicio, con una comunicación transparente, y la entrega oportuna de mis documentos. / Annalisa provided an excellent service, with transparent communication, and timely delivery of my documents.",
  },
];

// Uniform card length: cut at a word boundary so every slide reads as about
// the same size, full text always available via the tooltip on the ellipsis.
const CUTOFF = 150;
function truncate(text) {
  if (text.length <= CUTOFF) return text;
  const cut = text.slice(0, CUTOFF);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
}

const LABEL = {
  es: { prev: "Reseña anterior", next: "Reseña siguiente", go: "Ir a la reseña", rating: "5 de 5 estrellas", full: "Leer reseña completa" },
  en: { prev: "Previous review", next: "Next review", go: "Go to review", rating: "5 out of 5 stars", full: "Read full review" },
  fr: { prev: "Avis précédent", next: "Avis suivant", go: "Aller à l'avis", rating: "5 étoiles sur 5", full: "Lire l'avis complet" },
};

function ReviewText({ text, label }) {
  const [open, setOpen] = useState(false);
  const short = truncate(text);
  if (short === text) return <blockquote>&ldquo;{text}&rdquo;</blockquote>;
  return (
    <blockquote>
      &ldquo;{short}
      <span className="reviews__more">
        <button
          type="button"
          className="reviews__ellipsis"
          aria-expanded={open}
          aria-label={label}
          onClick={() => setOpen((o) => !o)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          …
        </button>
        <span className="reviews__tooltip" role="tooltip" hidden={!open}>{text}</span>
      </span>
      &rdquo;
    </blockquote>
  );
}

export default function ReviewsCarousel({ locale = "es" }) {
  const items = REVIEWS;
  const l = LABEL[locale] || LABEL.es;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [snap, setSnap] = useState(false);
  const [pv, setPv] = useState(1);
  const reduce = useRef(false);

  const count = items.length;
  const slides = [...items, ...items.slice(0, pv)];
  const jump = useCallback((to, then) => {
    setSnap(true);
    setI(to);
    requestAnimationFrame(() => requestAnimationFrame(() => { setSnap(false); if (then !== undefined) setI(then); }));
  }, []);
  const go = useCallback((n) => setI(n), []);
  const prev = useCallback(() => (i === 0 ? jump(count, count - 1) : setI(i - 1)), [i, count, jump]);
  const next = useCallback(() => setI((x) => Math.min(x + 1, count)), [count]);
  const onEnd = useCallback(() => { if (i === count) jump(0); }, [i, count, jump]);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1000px)");
    const mid = window.matchMedia("(min-width: 640px)");
    const calc = () => setPv(wide.matches ? 3 : mid.matches ? 2 : 1);
    calc();
    wide.addEventListener("change", calc);
    mid.addEventListener("change", calc);
    return () => { wide.removeEventListener("change", calc); mid.removeEventListener("change", calc); };
  }, []);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => Math.min(x + 1, count)), 8000);
    return () => clearInterval(id);
  }, [paused, count]);

  return (
    <div
      className="reviews"
      role="region"
      aria-roledescription="carousel"
      aria-label="Google"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => !reduce.current && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => !reduce.current && setPaused(false)}
    >
      <div className="reviews__head">
        <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#fff" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
          <path fill="#fff" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#fff" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.300-7.900l-6.500 5C9.500 39.600 16.200 44 24 44z" />
          <path fill="#fff" d="M43.600 20.100H42V20H24v8h11.300c-.8 2.200-2.200 4.100-4.100 5.600l6.200 5.200C37 39.200 44 34 44 24c0-1.300-.1-2.600-.4-3.900z" />
        </svg>
        <strong>{locale === "en" ? "5.0" : "5,0"}</strong>
        <span className="reviews__stars" role="img" aria-label={l.rating}>★★★★★</span>
      </div>

      <div className="reviews__viewport">
        <ul className="reviews__track" onTransitionEnd={onEnd} style={{ transform: `translateX(-${(i * 100) / pv}%)`, transition: snap ? "none" : undefined, "--pv": pv }}>
          {slides.map(({ name, meta, text }, n) => (
            <li key={name + n} className="reviews__slide" aria-hidden={n < i || n >= i + pv || n >= count} aria-roledescription="slide" aria-label={`${(n % count) + 1} / ${count}`}>
              <figure>
                <ReviewText text={text} label={l.full} />
                <figcaption>
                  <span className="reviews__avatar" aria-hidden="true">{name.charAt(0)}</span>
                  <span><strong>{name}</strong><small>{meta[locale] || meta.es}</small></span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="reviews__controls">
        <button type="button" onClick={prev} aria-label={l.prev}>‹</button>
        <div className="reviews__dots">
          {items.map((_, n) => (
            <button key={n} type="button" className={n === i % count ? "is-active" : ""} aria-label={`${l.go} ${n + 1}`} aria-current={n === i % count} onClick={() => go(n)} />
          ))}
        </div>
        <button type="button" onClick={next} aria-label={l.next}>›</button>
      </div>
    </div>
  );
}
