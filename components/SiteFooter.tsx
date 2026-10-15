import {
  Banknote, BadgeCheck, Building2, ChevronDown, Clock, Cpu, Facebook, FileText, Globe, Headphones, HeartPulse, Info,
  Instagram, Landmark, Languages, Layers, Linkedin, Mail, MapPin, Megaphone, MessageCircle, Mic, Newspaper, Palette,
  PenLine, Phone, Plane, Scale, ScanSearch, Search, Share2, Twitter, UserCheck, Users, Video, Wrench, Youtube, Zap,
  type LucideIcon,
} from "lucide-react";
import {
  footerBrand, footerContact, footerGroups, footerLegal, footerSites, footerSocial,
  type FooterGroup, type FooterIcon,
} from "@/content/footer";

const LINK_ICONS: Record<FooterIcon, LucideIcon> = {
  Scale, HeartPulse, Wrench, Landmark, Megaphone, FileText, Globe, BadgeCheck, Plane, Cpu, Layers, Languages,
  Headphones, Mic, Users, Video, Search, Share2, Mail, Palette, ScanSearch, Info, Banknote, Clock, MapPin,
  UserCheck, Building2, Newspaper, MessageCircle, PenLine, Zap,
};

const SOCIAL_ICONS = { Facebook, Twitter, Linkedin, Instagram, Youtube } as const;

function LinkGroup({ group }: { group: FooterGroup }) {
  const shown = group.links.slice(0, group.visible);
  const rest = group.links.slice(group.visible);
  const renderLink = (l: FooterGroup["links"][number]) => {
    const Icon = LINK_ICONS[l.icon];
    return (
      <li key={l.label}>
        <a href={l.href}>
          <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>{l.label}</span>
        </a>
      </li>
    );
  };
  return (
    <div className="foot-group">
      <h3>{group.title}</h3>
      <ul>{shown.map(renderLink)}</ul>
      {rest.length > 0 && (
        <details className="more">
          <summary>
            <ChevronDown size={15} aria-hidden="true" /> {rest.length} more
          </summary>
          <ul>{rest.map(renderLink)}</ul>
        </details>
      )}
    </div>
  );
}

/** Footer modelled on betranslated.com: brand and socials left, link groups right, contact, sister sites and a legal bar. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-bt">
        <div className="foot-top">
          <div className="foot-brand">
            <img src="/images/brand/logo.png" alt="BeTranslated" width={180} height={28} />
            <p>{footerBrand.description}</p>
            <ul className="social" aria-label="Follow BeTranslated">
              {footerSocial.map((s) => {
                const Icon = SOCIAL_ICONS[s.icon];
                return (
                  <li key={s.label}>
                    <a href={s.href} aria-label={s.label} rel="noopener">
                      <Icon size={17} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="foot-groups">
            {footerGroups.map((g) => (
              <LinkGroup key={g.title} group={g} />
            ))}
            <div className="foot-group contact">
              <h3>{footerContact.title}</h3>
              <ul>
                <li>
                  <a href={footerContact.mapsHref} rel="noopener">
                    <MapPin size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>
                      {footerContact.addressLines.map((line) => (
                        <span key={line} className="line">
                          {line}
                        </span>
                      ))}
                    </span>
                  </a>
                </li>
                <li>
                  <a href={footerContact.phoneHref}>
                    <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>{footerContact.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={footerContact.emailHref}>
                    <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
                    <span>{footerContact.email}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="foot-sites">
          <h3>{footerSites.title}</h3>
          <ul>
            {footerSites.links.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="foot-bottom">
          <p>
            &copy; {new Date().getFullYear()} {footerLegal.company}. All rights reserved.
          </p>
          <ul>
            {footerLegal.links.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <p className="copy-note">Working copy of betranslated.co.uk. Not the live site.</p>
      </div>
    </footer>
  );
}
