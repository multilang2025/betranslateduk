"use client";

import { useState } from "react";

// Click-to-play YouTube embed: a local poster and play button until clicked, so the page makes no
// YouTube request (and sets no cookies) unless the visitor presses play. Uses youtube-nocookie.com.
export default function VideoEmbed({ id, title, poster, label = "Play video" }) {
  const [on, setOn] = useState(false);
  return (
    <div className="vid">
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" className="vid__poster" onClick={() => setOn(true)} aria-label={`${label}: ${title}`}>
          <img src={poster} alt="" width="1280" height="720" loading="lazy" decoding="async" />
          <span className="vid__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
