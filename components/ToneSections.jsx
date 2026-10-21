"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Page rhythm for every page except the homepage: after the hero the sections alternate
// white, ombre, white, ombre... all the way to the footer. Pages are built from several
// templates (wrapper divs, trust strips, the closing CTA band), so the order is applied
// by tagging each top-level section in document order with data-tone; the styles live in
// app/home-refresh.css. The inline copy of this script runs before first paint on a full
// load, and the effect below re-runs it after client-side navigations.
export const TONE_SCRIPT =
  "(function(){function t(){var m=document.querySelector('main');if(!m||m.classList.contains('home'))return;" +
  "var s=[].slice.call(m.querySelectorAll('section')).filter(function(e){return !e.parentElement.closest('section')&&!e.classList.contains('page-hero')});" +
  "var n=0,o=0;s.forEach(function(e){if(e.classList.contains('trust-wrap')){e.setAttribute('data-tone','hero');e.removeAttribute('data-side');return}" +
  "if(n%2===1){e.setAttribute('data-tone','ombre');e.setAttribute('data-side',(o++%2)?'l':'r')}else{e.setAttribute('data-tone','white');e.removeAttribute('data-side')}n++})}" +
  "t();window.__tone=t;})();";

export default function ToneSections() {
  const path = usePathname();
  useEffect(() => {
    if (window.__tone) window.__tone();
    const id = requestAnimationFrame(() => window.__tone && window.__tone());
    return () => cancelAnimationFrame(id);
  }, [path]);
  return null;
}
