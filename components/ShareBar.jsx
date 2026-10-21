"use client";

import { useState } from "react";
import { BRAND, STROKE } from "./chrome/socialIcons";

const SITE = "https://www.betranslated.co.uk";
const L = { title: "Share this article", copy: "Copy link", copied: "Link copied", more: "More options", email: "Send by email", on: "Share on" };

export default function ShareBar({ path, title, compact = false }) {
  const [copied, setCopied] = useState(false);
  const url = SITE + path;
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const nets = [
    ["whatsapp", "WhatsApp", `https://wa.me/?text=${t}%20${u}`],
    ["linkedin", "LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ["facebook", "Facebook", `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ["x", "X", `https://x.com/intent/post?text=${t}&url=${u}`],
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt(L.copy, url);
    }
  }

  function native() {
    if (navigator.share) navigator.share({ title, url }).catch(() => {});
    else copy();
  }

  const icon = (d, filled = true) => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...(filled ? { fill: "currentColor" } : { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" })}>
      <path d={d} />
    </svg>
  );

  return (
    <div className={"share" + (compact ? " share--compact" : "")}>
      {compact ? null : <span className="share__title">{L.title}</span>}
      <ul className="share__list">
        {nets.map(([k, name, href]) => (
          <li key={k}>
            <a className={`share__btn share__btn--${k}`} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${L.on} ${name}`} title={name}>
              {icon(BRAND[k])}
            </a>
          </li>
        ))}
        <li><a className="share__btn" href={`mailto:?subject=${t}&body=${u}`} aria-label={L.email} title={L.email}>{icon(STROKE.email, false)}</a></li>
        <li>
          <button type="button" className={"share__btn" + (copied ? " is-done" : "")} onClick={copy} aria-label={copied ? L.copied : L.copy} title={L.copy}>
            {icon(copied ? STROKE.check : STROKE.link, false)}
          </button>
        </li>
        <li className="share__native">
          <button type="button" className="share__btn" onClick={native} aria-label={L.more} title={L.more}>{icon(STROKE.share, false)}</button>
        </li>
      </ul>
      <span className="share__status" role="status" aria-live="polite">{copied ? L.copied : ""}</span>
    </div>
  );
}
