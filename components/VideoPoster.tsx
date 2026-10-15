"use client";

import { useState } from "react";

/** Shows the video's own thumbnail and only loads YouTube (privacy-enhanced domain) after a click. */
export function VideoPoster({ videoId, title, poster }: { videoId: string; title: string; poster: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
          <img src={poster} alt="" />
          <span className="play" />
        </button>
      )}
    </div>
  );
}
