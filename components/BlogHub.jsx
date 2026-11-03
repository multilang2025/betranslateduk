import BlogCard from "./BlogCard";

const SHOWN = 3; // posts visible per topic before the "Show more" dropdown

const more = (n) => `${n} more article${n === 1 ? "" : "s"}`;

// Topic chips, most popular row, latest row, then one dropdown section per topic.
// The dropdowns are native <details>, so they work without JavaScript.
export default function BlogHub({ hub }) {
  const { popular, latest, sections } = hub;
  return (
    <>
      <nav className="bhub-nav" aria-label="Blog topics">
        <div className="container">
          <p className="bhub-nav__label">Jump to a topic</p>
          <ul>
            <li><a href="#most-read">Most read</a></li>
            <li><a href="#latest">Latest</a></li>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  {s.name} <span>{s.posts.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section className="section bhub-sec" id="most-read" aria-labelledby="most-read-title">
        <div className="container">
          <div className="section-head">
            <h2 id="most-read-title">Most read articles</h2>
            <p>The posts our readers come back to most, ranked by visits over the last 12 months.</p>
          </div>
          <div className="bgrid">
            {popular.map((c, i) => (
              <BlogCard key={c.slug} card={c} badge={i === 0 ? "Most read" : `No. ${i + 1}`} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bhub-sec bhub-sec--alt" id="latest" aria-labelledby="latest-title">
        <div className="container">
          <div className="section-head">
            <h2 id="latest-title">Latest articles</h2>
            <p>New from the BeTranslated team, newest first.</p>
          </div>
          <div className="bgrid">
            {latest.map((c) => (
              <BlogCard key={c.slug} card={c} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bhub-sec" aria-labelledby="topics-title">
        <div className="container">
          <div className="section-head">
            <h2 id="topics-title">Browse the blog by topic</h2>
            <p>Pick a topic to see its articles. Each one shows the first few, with the rest a click away.</p>
          </div>
          {sections.map((s) => (
            <div className="btopic" id={s.id} key={s.id}>
              <div className="btopic__head">
                <h3>{s.name}</h3>
                <p>{s.blurb}</p>
              </div>
              <div className="bgrid">
                {s.posts.slice(0, SHOWN).map((c) => (
                  <BlogCard key={c.slug} card={c} />
                ))}
              </div>
              {s.posts.length > SHOWN ? (
                <details className="btopic__more">
                  <summary>
                    <span className="btopic__more-open">Show {more(s.posts.length - SHOWN)} in {s.name}</span>
                    <span className="btopic__more-close">Show fewer articles</span>
                  </summary>
                  <div className="bgrid">
                    {s.posts.slice(SHOWN).map((c) => (
                      <BlogCard key={c.slug} card={c} />
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
