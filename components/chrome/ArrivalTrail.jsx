"use client";

import { useEffect } from "react";

// On arrival (once per session), the pointer leaves a short trail of letters
// from the scripts we translate: Latin accents, Cyrillic, Greek, Arabic,
// Hebrew, CJK, Hangul. It runs for a few seconds after the first mouse move,
// then the canvas is removed. Desktop pointers only; off with reduced motion.
const GLYPHS = ["á", "ñ", "ç", "é", "ß", "ø", "ü", "ğ", "ł", "ж", "я", "λ", "Ω", "ع", "ش", "א", "ש", "中", "文", "あ", "語", "한"];
const COLORS = ["#5FA9B1", "#2F3143", "#5FA9B1", "#F67618"];
const COLORS_DARK = ["#5FA9B1", "#E6EAF0", "#5FA9B1", "#F67618"];
const RUN_MS = 7000;
const LIFE_MS = 1100;
const STEP_PX = 26;
const KEY = "bt-trail";

export default function ArrivalTrail() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {}
    const palette = (document.documentElement.getAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches) ? COLORS_DARK : COLORS;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "arrival-trail";
    canvas.setAttribute("aria-hidden", "true");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const font = getComputedStyle(document.body).fontFamily;
    const parts = [];
    let started = 0;
    let lastX = null;
    let lastY = null;
    let raf = 0;
    let i = 0;
    let done = false;

    function frame(now) {
      raf = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let k = parts.length - 1; k >= 0; k--) {
        const p = parts[k];
        const t = (now - p.born) / LIFE_MS;
        if (t >= 1) { parts.splice(k, 1); continue; }
        ctx.globalAlpha = (1 - t) * 0.9;
        ctx.fillStyle = p.color;
        ctx.font = `600 ${p.size * (1 - t * 0.35)}px ${font}`;
        ctx.fillText(p.ch, p.x + p.dx * t, p.y + p.dy * t);
      }
      ctx.globalAlpha = 1;
      if (parts.length) raf = requestAnimationFrame(frame);
      else if (done) cleanup();
    }

    function onMove(e) {
      const now = performance.now();
      if (!started) {
        started = now;
        try { sessionStorage.setItem(KEY, "1"); } catch {}
        size();
        document.body.appendChild(canvas);
      }
      if (now - started > RUN_MS) {
        done = true;
        window.removeEventListener("pointermove", onMove);
        if (!raf) raf = requestAnimationFrame(frame);
        return;
      }
      if (lastX !== null && Math.hypot(e.clientX - lastX, e.clientY - lastY) < STEP_PX) return;
      lastX = e.clientX;
      lastY = e.clientY;
      parts.push({
        ch: GLYPHS[i % GLYPHS.length],
        color: palette[i % palette.length],
        x: e.clientX + 10,
        y: e.clientY + 22,
        dx: (Math.random() - 0.5) * 18,
        dy: 14 + Math.random() * 12,
        size: 14 + Math.random() * 6,
        born: now,
      });
      i++;
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function cleanup() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", size);
      if (raf) cancelAnimationFrame(raf);
      canvas.remove();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", size, { passive: true });
    return cleanup;
  }, []);

  return null;
}
