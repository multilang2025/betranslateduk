"use client";

import { useMemo, useState } from "react";

const LANGS = ["French", "English", "Spanish", "German", "Dutch", "Italian"];

// Languages a translator works with, read from the role line (bio as a fallback).
function languagesOf(p) {
  const from = (t) => LANGS.filter((l) => new RegExp(String.raw`\b${l}\b`, "i").test(t));
  const fromRole = from(p.role);
  return fromRole.length ? fromRole : from(p.bio);
}

// Profile cards for the freelance translators, filterable by language.
export default function TranslatorsGrid({ people }) {
  const [lang, setLang] = useState("All");
  const items = useMemo(() => people.map((p) => ({ ...p, langs: languagesOf(p) })), [people]);
  const chips = useMemo(
    () => ["All", ...LANGS.filter((l) => items.some((p) => p.langs.includes(l)))],
    [items],
  );
  const shown = lang === "All" ? items : items.filter((p) => p.langs.includes(lang));
  return (
    <div className="trx">
      <div className="trx__filters" role="group" aria-label="Filter translators by language">
        {chips.map((c) => (
          <button key={c} type="button" className="trx__chip" aria-pressed={lang === c} onClick={() => setLang(c)}>
            {c}
            <span>{c === "All" ? items.length : items.filter((p) => p.langs.includes(c)).length}</span>
          </button>
        ))}
      </div>
      <ul className="trx__grid">
        {shown.map((p, i) => (
          <li key={`${p.name}-${i}`} className="trx__card">
            <img src={p.photo} alt={p.name} width="88" height="88" loading="lazy" />
            <h3>{p.name}</h3>
            <p className="trx__role">{p.role}</p>
            {p.bioHtml ? <p className="trx__bio" dangerouslySetInnerHTML={{ __html: p.bioHtml }} /> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
