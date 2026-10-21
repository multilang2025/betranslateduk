"use client";

import { useEffect } from "react";

const REVEAL =
  ".sec__in > h2, .sec__in > p, .mini, .guide__country, .guide__variant, .guide__other, .guide__note, .faq__item, .section-head, .pairs li, .clients-band, .about-team > *, .tiles > li, .card--service, .ip-card, .ip-sectors > li, .ip-zone, .ip-kit > li, .ip-case, .finder, .lang-features .feature, .fmt-file, .bi-stat, .bi-quote, .bi-steps, .bi-compare, .bi-video, .vm-banner";
const GLOW = ".mini, .guide__country, .guide__variant, .faq__item, .tile, .card--service";

// Progressive enhancement for content pages: fades blocks up as they scroll
// into view (staggered among siblings) and feeds the pointer position to the
// border glow. Everything stays visible without JS or with reduced motion.
export default function PageFx() {
  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [];

    if (!reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target;
            io.unobserve(el);
            el.classList.add("fx-in");
            const wait = parseFloat(el.style.transitionDelay || "0") * 1000 + 900;
            // Hand the element back to its own hover transitions afterwards.
            setTimeout(() => {
              el.classList.remove("fx-armed", "fx-in");
              el.style.transitionDelay = "";
            }, wait);
          }
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
      );
      root.querySelectorAll(REVEAL).forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // already on screen
        const sibs = el.parentElement ? [...el.parentElement.children].filter((c) => c.matches(REVEAL)) : [];
        const i = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = `${Math.min(i, 6) * 0.07}s`;
        el.classList.add("fx-armed");
        io.observe(el);
      });
      cleanups.push(() => io.disconnect());

      // Timeline steps slide in from their own side, one at a time.
      const tl = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("tl-in");
            tl.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.25 }
      );
      root.querySelectorAll(".timeline__item").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
        el.classList.add("tl-armed");
        tl.observe(el);
      });
      cleanups.push(() => tl.disconnect());
    }

    const onMove = (ev) => {
      const el = ev.target.closest && ev.target.closest(GLOW);
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${ev.clientX - r.left}px`);
      el.style.setProperty("--my", `${ev.clientY - r.top}px`);
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    cleanups.push(() => root.removeEventListener("pointermove", onMove));

    // Click-to-load videos (lib/blogInserts.js): swap the poster for the player.
    const onPlay = (ev) => {
      const btn = ev.target.closest(".bi-video__play");
      if (!btn) return;
      const f = document.createElement("iframe");
      f.src = btn.dataset.embed;
      f.title = btn.dataset.title || "Video";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      btn.replaceWith(f);
    };
    root.addEventListener("click", onPlay);
    cleanups.push(() => root.removeEventListener("click", onPlay));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
