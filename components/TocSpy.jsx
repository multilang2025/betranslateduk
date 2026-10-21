"use client";

import { useEffect } from "react";

// Highlights the table-of-contents link of the section being read.
export default function TocSpy() {
  useEffect(() => {
    const links = [...document.querySelectorAll(".post-toc a[href^='#']")];
    if (!links.length || !("IntersectionObserver" in window)) return;
    const byId = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const heads = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
    let current = null;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) current = e.target.id;
        if (!current) return;
        links.forEach((a) => a.classList.toggle("is-active", a === byId.get(current)));
      },
      { rootMargin: "-90px 0px -70% 0px" }
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, []);
  return null;
}
