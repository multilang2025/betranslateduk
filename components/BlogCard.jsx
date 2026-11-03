import Image from "next/image";

const fmt = (iso) => {
  const d = new Date(iso);
  return !iso || isNaN(d) ? "" : d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
};

// One blog card: image, a meta row (topic left, date right, both inside the card padding), title and excerpt.
export default function BlogCard({ card, badge, priority = false }) {
  return (
    <a href={card.href} className="bcard">
      <div className="bcard__media">
        {card.img ? (
          <Image src={card.img} alt="" width={400} height={250} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 290px" priority={priority} />
        ) : (
          <span className="bcard__ph" aria-hidden="true">{card.title.charAt(0)}</span>
        )}
        {badge ? <span className="bcard__badge">{badge}</span> : null}
      </div>
      <div className="bcard__body">
        <div className="bcard__meta">
          {card.topic ? <span className="bcard__tag">{card.topic}</span> : <span />}
          {card.date ? <time dateTime={card.date}>{fmt(card.date)}</time> : null}
        </div>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
      </div>
    </a>
  );
}
