"use client";
import { useEffect, useRef, useState } from "react";

export default function HeroHighlight({ children }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <span ref={ref} className={"underline-accent" + (inView ? " is-in" : "")}>{children}</span>;
}
