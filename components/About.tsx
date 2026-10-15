import { about } from "@/content/home";
import { RichText } from "./RichText";
import { VideoPoster } from "./VideoPoster";

export function About() {
  return (
    <section className="about" aria-labelledby="about-title">
      <div className="container-bt cols">
        <div>
          <p className="eyebrow-text">{about.eyebrow}</p>
          <h3 id="about-title">{about.heading}</h3>
          {about.paragraphs.map((p, i) => (
            <p key={i}>
              <RichText text={p} />
            </p>
          ))}
        </div>
        <div>
          <p className="founded">
            {about.foundedLabel} <strong>{about.foundedYear}</strong>
          </p>
          <VideoPoster videoId={about.videoId} title={about.videoTitle} poster={about.videoPoster} />
        </div>
      </div>
    </section>
  );
}
