import fs from "node:fs";
import path from "node:path";
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { IMAGES_BASE, imgUrl } from "../../../lib/site";
import { ogAllPages, ogCard, OG_WIDTH as W, OG_HEIGHT as H } from "../../../lib/og";

// Share images, one per page: /og/<page path>.jpg
// (home: /og/home.jpg), 1200x630 JPEG.
//
// Why a route prerendered at build time, not committed files or a live
// renderer: every page in generateStaticParams is rendered once during
// `next build` and served afterwards as a static file (no rendering, no
// network at request time, nothing to keep in sync by hand). Titles change
// often on this site; a committed public/og/ folder would go stale the
// moment someone edits a title and forgets to rerun a script, and ~400
// JPEGs (~25 MB) would sit in git history at every regeneration. A build
// step keeps the images in lockstep with the copy. The metadata appends
// ?v=<hash of the card content> (lib/og.js), so the long immutable cache
// below is safe: new copy means a new URL that crawlers fetch again.
//
// satori (next/og) renders the card to PNG; sharp (already installed with
// Next for image optimisation) turns it into a ~60-120 KB JPEG and reads
// the WebP/JPEG hero photos satori cannot decode. (No runtime/dynamic exports:
// they are not allowed with cacheComponents; generateStaticParams alone
// prerenders every card.)

export function generateStaticParams() {
  return ogAllPages().map((parts) => ({
    path: parts.length ? [...parts.slice(0, -1), parts[parts.length - 1] + ".jpg"] : ["home.jpg"],
  }));
}

const ASSETS = path.join(process.cwd(), "lib", "og-assets");
let fonts = null;
function loadFonts() {
  if (!fonts) {
    const read = (f) => fs.readFileSync(path.join(ASSETS, f));
    fonts = [
      { name: "Fraunces", data: read("Fraunces-Bold.ttf"), weight: 700, style: "normal" },
      { name: "Poppins", data: read("Poppins-Regular.ttf"), weight: 400, style: "normal" },
      { name: "Poppins", data: read("Poppins-SemiBold.ttf"), weight: 600, style: "normal" },
    ];
  }
  return fonts;
}
let logo = null;
const logoUri = () => (logo ||= "data:image/png;base64," + fs.readFileSync(path.join(ASSETS, "logo-on-dark.png")).toString("base64"));

// Local hero photo (public/...) -> JPEG data URI sized for the right half.
async function photoUri(src) {
  if (!src || !src.startsWith("/")) return null;
  try {
    let input;
    if (IMAGES_BASE) {
      const res = await fetch(imgUrl(src));
      if (!res.ok) return null;
      input = Buffer.from(await res.arrayBuffer());
    } else {
      const file = path.join(process.cwd(), "public", src);
      if (!fs.existsSync(file)) return null;
      input = file;
    }
    const buf = await sharp(input).resize(PHOTO_W, H, { fit: "cover", position: "centre" }).jpeg({ quality: 88 }).toBuffer();
    return "data:image/jpeg;base64," + buf.toString("base64");
  } catch {
    return null; // the card falls back to the language-pair motif
  }
}

// Brand palette (app/design-system.css).
const NAVY = "#061A44"; // --bt-navy-deep
const TEAL = "#7EBEC5"; // --bt-teal
const TEAL_600 = "#5FA9B1"; // --bt-accent
const INK = "#2F3143"; // --bt-navy
const PHOTO_W = 720;

function headlineSize(text, wide) {
  const n = text.length;
  if (n <= 30) return wide ? 72 : 68;
  if (n <= 48) return wide ? 64 : 60;
  if (n <= 70) return 54;
  return 48;
}

const docLines = (widths, first) =>
  widths.map((w, i) => (
    <div key={i} style={{ display: "flex", width: w, height: 10, borderRadius: 5, marginTop: 14, backgroundColor: i === 0 && first ? first : "#E2E5EA" }} />
  ));

// Two documents (source -> translation) with language chips: the same motif
// as the page heroes (components/PairHeroArt.jsx), static.
function DocsMotif({ art }) {
  return (
    <div style={{ position: "absolute", right: 64, top: 120, width: 380, height: 400, display: "flex" }}>
      <div style={{ position: "absolute", left: 10, top: 92, width: 196, height: 248, display: "flex", flexDirection: "column", padding: "22px 22px", backgroundColor: "#ffffff", borderRadius: 20, boxShadow: "0 18px 40px rgba(0,0,0,0.35)" }}>
        <div style={{ display: "flex", alignSelf: "flex-start", padding: "4px 12px", borderRadius: 8, backgroundColor: "#EFF7F8", color: INK, fontSize: 18, fontWeight: 600 }}>{art.src}</div>
        {docLines([150, 124, 140, 96, 70])}
      </div>
      <div style={{ position: "absolute", left: 172, top: 58, width: 196, height: 248, display: "flex", flexDirection: "column", padding: "22px 22px", backgroundColor: "#ffffff", borderRadius: 20, boxShadow: "0 18px 40px rgba(0,0,0,0.35)" }}>
        <div style={{ display: "flex", alignSelf: "flex-start", padding: "4px 12px", borderRadius: 8, backgroundColor: INK, color: "#ffffff", fontSize: 18, fontWeight: 600 }}>{art.tgt}</div>
        {docLines([144, 130, 150, 90, 64], TEAL_600)}
        <div style={{ position: "absolute", right: 18, bottom: 18, width: 40, height: 40, borderRadius: 20, backgroundColor: "#1F8A5B", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 22 22"><path d="M4 11 l5 5 l9 -10" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
      {art.from ? (
        <div style={{ position: "absolute", left: 0, top: 30, display: "flex", padding: "8px 20px", borderRadius: 999, backgroundColor: "#ffffff", color: INK, fontSize: 22, fontWeight: 600, boxShadow: "0 10px 24px rgba(0,0,0,0.3)" }}>{art.from}</div>
      ) : null}
      {art.to ? (
        <div style={{ position: "absolute", right: 0, top: 322, display: "flex", padding: "8px 20px", borderRadius: 999, backgroundColor: TEAL_600, color: "#ffffff", fontSize: 22, fontWeight: 600, boxShadow: "0 10px 24px rgba(0,0,0,0.3)" }}>{art.to}</div>
      ) : null}
    </div>
  );
}

// Interpreting pages: two speech bubbles instead of documents.
function SpeechMotif({ art }) {
  const bubble = (code, word, dark, style) => (
    <div style={{ position: "absolute", width: 250, display: "flex", flexDirection: "column", padding: "22px 24px", borderRadius: 26, backgroundColor: dark ? TEAL_600 : "#ffffff", boxShadow: "0 18px 40px rgba(0,0,0,0.35)", ...style }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", padding: "4px 12px", borderRadius: 8, backgroundColor: dark ? "#ffffff" : "#EFF7F8", color: INK, fontSize: 18, fontWeight: 600 }}>{code}</div>
        {word ? <div style={{ display: "flex", marginLeft: 14, fontSize: 26, fontWeight: 600, color: dark ? "#ffffff" : INK }}>{word}</div> : null}
      </div>
      {docLines([190, 150], null).map((l, i) => <div key={i} style={{ display: "flex", opacity: dark ? 0.55 : 1 }}>{l}</div>)}
    </div>
  );
  return (
    <div style={{ position: "absolute", right: 64, top: 150, width: 380, height: 340, display: "flex" }}>
      {bubble(art.src, art.from, false, { left: 0, top: 0 })}
      {bubble(art.tgt, art.to, true, { right: 0, top: 150 })}
    </div>
  );
}

export async function GET(_request, { params }) {
  const { path: segs } = await params;
  const parts = [...segs];
  parts[parts.length - 1] = parts[parts.length - 1].replace(/\.jpg$/, "");
  const card = ogCard(parts[0] === "home" && parts.length === 1 ? [] : parts);
  const photo = await photoUri(card.image);
  const textW = photo ? 600 : 660;
  const size = headlineSize(card.headline, false);

  const png = new ImageResponse(
    (
      <div style={{ width: W, height: H, display: "flex", position: "relative", backgroundColor: NAVY, fontFamily: "Poppins", color: "#ffffff" }}>
        {photo ? <img src={photo} alt="" width={PHOTO_W} height={H} style={{ position: "absolute", right: 0, top: 0, width: PHOTO_W, height: H }} /> : null}
        {photo ? <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", backgroundImage: `linear-gradient(90deg, ${NAVY} 0%, ${NAVY} 40%, rgba(6,26,68,0.82) 52%, rgba(6,26,68,0.25) 75%, rgba(6,26,68,0.05) 100%)` }} /> : null}
        {photo ? null : <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", backgroundImage: "radial-gradient(circle at 82% 45%, rgba(95,169,177,0.38) 0%, rgba(6,26,68,0) 52%)" }} />}
        {photo ? null : card.interpreting ? <SpeechMotif art={card.art} /> : <DocsMotif art={card.art} />}
        <div style={{ position: "absolute", left: 72, top: 60, bottom: 56, width: textW, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <img src={logoUri()} alt="" width={224} height={42} style={{ width: 224, height: 42 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 600, letterSpacing: 2.6, textTransform: "uppercase", color: TEAL }}>{card.kicker}</div>
            <div style={{ display: "flex", width: 64, height: 4, borderRadius: 2, backgroundColor: TEAL, marginTop: 14, marginBottom: 26 }} />
            <div style={{ display: "block", fontFamily: "Fraunces", fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: -0.8, color: "#ffffff", lineClamp: 3 }}>{card.headline}</div>
            {card.sub ? (
              <div style={{ display: "block", marginTop: 22, fontSize: 27, lineHeight: 1.38, color: "rgba(255,255,255,0.86)", lineClamp: 2 }}>{card.sub}</div>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22 }}>
            <div style={{ display: "flex", fontWeight: 600, color: TEAL }}>betranslated.co.uk</div>
            <div style={{ display: "flex", width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.45)", marginLeft: 16, marginRight: 16 }} />
            <div style={{ display: "flex", color: "rgba(255,255,255,0.82)" }}>{card.proof}</div>
          </div>
        </div>
      </div>
    ),
    { width: W, height: H, fonts: loadFonts() }
  );
  const jpg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" }).toBuffer();
  return new Response(jpg, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(jpg.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
