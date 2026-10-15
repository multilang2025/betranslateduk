import {
  Accessibility, Building2, Clock, Cpu, FileText, FolderKanban, Globe, GraduationCap, Handshake, HardHat, Headphones,
  HeartPulse, Landmark, Languages, Leaf, Mail, Map, MapPin, Megaphone, Mic, PackageCheck, Phone, Plane, Radio, Scale,
  ShieldCheck, UserCheck, Users, Video, Wallet, Zap, type LucideIcon,
} from "lucide-react";
import type { Block, PageIcon } from "@/content/pages";
import { RichText } from "./RichText";

const ICONS: Record<PageIcon, LucideIcon> = {
  Globe, Landmark, Cpu, HardHat, Megaphone, Plane, Scale, Zap, Clock, ShieldCheck, Users, Building2, Languages, Map,
  FolderKanban, UserCheck, PackageCheck, Wallet, Radio, Video, Phone, Mic, HeartPulse, GraduationCap, Headphones,
  MapPin, Mail, FileText, Leaf, Handshake, Accessibility,
};

/** Renders the blocks of an inner page. Sections alternate background; cards share the homepage Services styling. */
export function PageBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <section className={`section pblock${i % 2 === 1 ? " alt" : ""}`} key={b.heading} aria-labelledby={`pb-${i}`}>
          <div className="container-bt">
            <p className="eyebrow-text">{b.eyebrow}</p>
            <h2 id={`pb-${i}`}>{b.heading}</h2>

            {b.type === "prose" && (
              <div className="prose">
                {b.paragraphs.map((p) => (
                  <p key={p}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            )}

            {b.type === "cards" && (
              <>
                {b.intro && (
                  <p className="pintro">
                    <RichText text={b.intro} />
                  </p>
                )}
                <div className={`pgrid c${b.columns ?? 3}`}>
                  {b.items.map((item) => {
                    const Icon = ICONS[item.icon];
                    return (
                      <article className="pcard" key={item.title}>
                        <span className="ic" aria-hidden="true">
                          <Icon size={22} strokeWidth={1.75} />
                        </span>
                        <h3>{item.href ? <a href={item.href}>{item.title}</a> : item.title}</h3>
                        <p>
                          <RichText text={item.text} />
                        </p>
                        {item.bullets && (
                          <ul>
                            {item.bullets.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                        )}
                      </article>
                    );
                  })}
                </div>
              </>
            )}

            {b.type === "chips" && (
              <>
                {b.intro && <p className="pintro">{b.intro}</p>}
                <ul className="chips">
                  {b.items.map((c) => (
                    <li key={c.label}>
                      <a href={c.href}>
                        <Languages size={16} strokeWidth={1.75} aria-hidden="true" /> {c.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
