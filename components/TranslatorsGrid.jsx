"use client";

import { useMemo, useState } from "react";
import { imgUrl } from "@/lib/site";

// Target languages offered as filters, in display order: [flag, label].
const INTO = [["gb", "English"], ["fr", "French"], ["es", "Spanish"], ["de", "German"], ["nl", "Dutch"]];
const FLAG_NAME = { gb: "English", fr: "French", es: "Spanish", de: "German", nl: "Dutch", it: "Italian" };

const Flag = ({ cc, size = 18 }) => (
  <img className="trx__flag" src={`/flags/${cc}.svg`} alt="" width={size} height={Math.round(size * 0.75)} loading="lazy" decoding="async" />
);

// Profile cards for the translators, filterable by the language they translate into.
export default function TranslatorsGrid({ people }) {
  const [lang, setLang] = useState("all");
  const [open, setOpen] = useState(null);
  const counts = useMemo(() => Object.fromEntries(INTO.map(([cc]) => [cc, people.filter((p) => p.into?.includes(cc)).length])), [people]);
  const shown = lang === "all" ? people : people.filter((p) => p.into?.includes(lang));
  return (
    <div className="trx">
      <div className="trx__filters" role="group" aria-label="Filter translators by the language they translate into">
        <button type="button" className="trx__chip" aria-pressed={lang === "all"} onClick={() => setLang("all")}>
          All translators <span>{people.length}</span>
        </button>
        {INTO.filter(([cc]) => counts[cc]).map(([cc, label]) => (
          <button key={cc} type="button" className="trx__chip" aria-pressed={lang === cc} onClick={() => setLang(cc)}>
            <Flag cc={cc} />
            Into {label} <span>{counts[cc]}</span>
          </button>
        ))}
      </div>
      <ul className="trx__grid" aria-live="polite">
        {shown.map((p, i) => {
          const key = `${p.name}-${i}`;
          const isOpen = open === key;
          return (
            <li key={key} className="trx__card">
              <div className="trx__head">
                <img src={imgUrl(p.photo)} alt={p.name} width="72" height="72" loading="lazy" />
                <div>
                  <h3>{p.name}</h3>
                  {p.from?.length || p.into?.length ? (
                    <p className="trx__route" aria-label={`Translates ${p.from.map((c) => FLAG_NAME[c]).join(" and ")} into ${p.into.map((c) => FLAG_NAME[c]).join(" and ")}`}>
                      {p.from.map((c) => <Flag key={c} cc={c} size={20} />)}
                      {p.from.length && p.into.length ? <span aria-hidden="true">→</span> : null}
                      {p.into.map((c) => <Flag key={c} cc={c} size={20} />)}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="trx__role">{p.role}</p>
              {p.bioHtml ? (
                <>
                  <p className={`trx__bio${isOpen ? " is-open" : ""}`} dangerouslySetInnerHTML={{ __html: p.bioHtml }} />
                  <button type="button" className="trx__more" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : key)}>
                    {isOpen ? "Show less" : "Read profile"}
                  </button>
                </>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
