"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

// Even page size: 2 full rows of 4 on desktop, 4 rows of 2 on tablet.
const PAGE = 8;
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function fmt(iso, locale) {
  const d = new Date(iso);
  if (!iso || isNaN(d)) return "";
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : locale === "en" ? "en-GB" : "es-ES", { year: "numeric", month: "short", day: "numeric" });
}

function Thumb({ c, sizes, priority }) {
  return c.img ? (
    <Image src={c.img} alt="" width={c.imgW} height={c.imgH} sizes={sizes} priority={priority} />
  ) : (
    <span className="post__ph" aria-hidden="true">{c.title.charAt(0)}</span>
  );
}

// Featured post + category chips + filter + paginated image cards.
export default function BlogList({ cards, locale = "es", labels }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [shown, setShown] = useState(PAGE);

  const categories = useMemo(() => {
    const n = {};
    cards.forEach((c) => c.category && (n[c.category] = (n[c.category] || 0) + 1));
    return Object.entries(n).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k);
  }, [cards]);

  const filtering = q.trim() !== "" || cat !== "";
  const filtered = useMemo(() => {
    const n = norm(q.trim());
    return cards.filter((c) => (!cat || c.category === cat) && (!n || norm(c.title + " " + c.description).includes(n)));
  }, [q, cat, cards]);

  // The featured post is the latest one that is not sponsored; sponsored posts
  // are never featured and only appear after the first page (by date there).
  const featured = !filtering ? filtered.find((c) => !c.sponsored) || null : null;
  const list = useMemo(() => {
    const rest = filtered.filter((c) => c !== featured);
    if (filtering) return rest;
    const own = rest.filter((c) => !c.sponsored);
    const later = [...own.slice(PAGE), ...rest.filter((c) => c.sponsored)].sort((x, y) => String(y.date).localeCompare(String(x.date)));
    return [...own.slice(0, PAGE), ...later];
  }, [filtered, featured, filtering]);

  return (
    <>
      {labels.browse ? <h2 className="blog-latest blog-browse">{labels.browse}</h2> : null}
      <div className="blog-tools">
        <input
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setShown(PAGE); }}
          placeholder={labels.filter}
          aria-label={labels.filter}
        />
        <span className="blog-tools__count">{labels.countTpl.replace("{n}", filtered.length)}</span>
      </div>
      {categories.length ? (
        <div className="chips" role="group" aria-label="Categorías">
          <button type="button" className={"chip" + (cat === "" ? " is-active" : "")} onClick={() => { setCat(""); setShown(PAGE); }}>{labels.all}</button>
          {categories.map((k) => (
            <button key={k} type="button" className={"chip" + (cat === k ? " is-active" : "")} onClick={() => { setCat(k); setShown(PAGE); }}>{k}</button>
          ))}
        </div>
      ) : null}

      {featured ? (
        <a href={featured.href} className="featured">
          <div className="featured__media"><Thumb c={featured} sizes="(max-width: 900px) 100vw, 600px" priority /></div>
          <div className="featured__body">
            {featured.category ? <span className="tag">{featured.category}</span> : null}
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <span className="post__meta">{fmt(featured.date, locale)}</span>
            <span className="card__more">{labels.more}</span>
          </div>
        </a>
      ) : null}

      {list.length && !filtering && labels.latest ? <h2 className="blog-latest">{labels.latest}</h2> : null}
      {list.length ? (
        <div className="post-grid">
          {list.slice(0, shown).map((c) => (
            <a key={c.href} href={c.href} className="post">
              <div className="post__media"><Thumb c={c} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 290px" /></div>
              <div className="post__body">
                <div className="post__top">
                  {c.category ? <span className="tag">{c.category}</span> : <span />}
                  <time dateTime={c.date} className="post__meta">{fmt(c.date, locale)}</time>
                </div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            </a>
          ))}
        </div>
      ) : !featured ? (
        <p className="center">{labels.none}</p>
      ) : null}

      {shown < list.length ? (
        <p className="center" style={{ marginTop: 40 }}>
          <button type="button" className="bt-btn bt-btn--ghost" onClick={() => setShown((s) => s + PAGE)}>{labels.loadMore}</button>
        </p>
      ) : null}
    </>
  );
}
