"use client";

import Image from "next/image";
import { useState } from "react";

// Home page blog teaser: two sets of three posts. The button slides the
// visible set out sideways and the other set in (from the right going
// forward, from the left going back). Reduced motion: an instant swap.
export default function FeaturedPosts({ sets, labels }) {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState("next");
  const go = (to) => { setDir(to > page ? "next" : "prev"); setPage(to); };
  const hasMore = sets.length > 1 && sets[1].length > 0;

  return (
    <div className="fposts">
      <div className="fposts__viewport" aria-live="polite">
        <ul key={page} className={`fposts__set fposts__set--${dir}`}>
          {sets[page].map((c) => (
            <li key={c.href}>
              <a href={c.href} className="post">
                <div className="post__media">
                  {c.img ? <Image src={c.img} alt="" width={c.imgW} height={c.imgH} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px" /> : <span className="post__ph" aria-hidden="true">{c.title.charAt(0)}</span>}
                </div>
                <div className="post__body">
                  <div className="post__top">{c.category ? <span className="tag">{c.category}</span> : <span />}</div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="fposts__nav">
        {hasMore ? (
          page === 0 ? (
            <button type="button" className="bt-btn bt-btn--secondary fposts__btn" onClick={() => go(1)}>{labels.more} <span aria-hidden="true">→</span></button>
          ) : (
            <button type="button" className="bt-btn bt-btn--secondary fposts__btn" onClick={() => go(0)}><span aria-hidden="true">←</span> {labels.back}</button>
          )
        ) : null}
        {hasMore ? (
          <span className="fposts__dots" aria-hidden="true"><i className={page === 0 ? "is-on" : ""} /><i className={page === 1 ? "is-on" : ""} /></span>
        ) : null}
        <a href={labels.allHref} className="card__more fposts__all">{labels.all}</a>
      </div>
    </div>
  );
}
