// Sentence case for display titles (cards, lists, search, breadcrumbs): the
// meta title stays in Title Case for the <title> tag, but everything shown on
// the page is in sentence case. Mirrors scripts/btvibe-uk/style/sentence-case.js
// without the corpus statistics: names and places come from PROPER.
const PROPER = new Set(("english french german spanish korean dutch italian portuguese british belgian european welsh scottish irish brit brits " +
  "england britain belgium france germany spain italy netherlands scotland wales ireland ulster europe asia africa america american canada canadian asian middle eastern slavic arabic chinese japanese russian polish turkish indian african latin western northern " +
  "london manchester birmingham liverpool leeds sheffield bristol newcastle nottingham leicester coventry southampton portsmouth plymouth brighton bournemouth cambridge oxford york bath norwich sunderland edinburgh glasgow cardiff swansea belfast aberdeen bangor londonderry derry southend " +
  "betranslated google zoom facebook instagram linkedin youtube pinterest brexit christmas beckham bellingham " +
  "nhs hmrc gov covid whatsapp skype microsoft apple amazon netflix").split(" "));
const SMALL = new Set("a an the and or but of in on at to for with by from as vs is are be your you how what why do does can into than that this it its if so nor per via".split(" "));
const WORD = /[A-Za-z][A-Za-z'’-]*|[:.!?|]/g;
const base = (w) => w.replace(/[’']s$/, "");

export function sentenceCase(text) {
  const toks = [];
  let pending = "start", m;
  WORD.lastIndex = 0;
  const src = String(text || "");
  while ((m = WORD.exec(src))) {
    if (/^[:.!?|]$/.test(m[0])) { pending = m[0] === ":" ? "colon" : "stop"; continue; }
    toks.push({ start: m.index, end: m.index + m[0].length, w: m[0], lead: pending });
    pending = "";
  }
  const numeralLead = /^\s*\d+\s+[A-Za-z]/.test(src);
  const out = toks.map((t) => t.w);
  let segStart = 0;
  for (let i = 0; i <= toks.length; i++) {
    if (i < toks.length && (i === segStart || toks[i].lead !== "stop")) continue;
    const seg = toks.slice(segStart, i);
    const elig = seg.filter((t, j) => j > 0 && !SMALL.has(base(t.w).toLowerCase()) && base(t.w).length >= 3 && base(t.w) !== base(t.w).toUpperCase() && !/[a-z][A-Z]/.test(t.w));
    const caps = elig.filter((t) => t.w[0] === t.w[0].toUpperCase());
    const isTitle = (elig.length >= 2 || (elig.length === 1 && seg.length >= 3)) && caps.length >= 0.7 * elig.length;
    if (isTitle) {
      seg.forEach((t, j) => {
        const b = base(t.w), tail = t.w.slice(b.length), k = b.toLowerCase(), idx = segStart + j;
        if (b === "A" && (j > 0 || t.lead === "colon")) { out[idx] = "a"; return; }
        if (b[0] !== b[0].toUpperCase() || b === b.toUpperCase() || /[a-z][A-Z]/.test(b)) return;
        if (j === 0 && t.lead !== "colon" && !(segStart === 0 && numeralLead)) return;
        if (PROPER.has(k)) return;
        out[idx] = (b.includes("-") ? b.split("-").map((x, n) => (n > 0 && PROPER.has(x.toLowerCase()) ? x : x.toLowerCase())).join("-") : k) + tail;
      });
    }
    segStart = i;
  }
  let res = "", pos = 0;
  toks.forEach((t, i) => { res += src.slice(pos, t.start) + out[i]; pos = t.end; });
  return (res + src.slice(pos)).replace(/\bIT crowd\b/g, "IT Crowd");
}
