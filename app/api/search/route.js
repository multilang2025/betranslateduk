import { NextResponse } from "next/server";
import { searchIndex } from "@/lib/content";

const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function snippet(text, terms) {
  const n = norm(text);
  const i = terms.map((x) => n.indexOf(x)).filter((x) => x >= 0).sort((a, b) => a - b)[0];
  if (i === undefined) return "";
  const start = Math.max(0, i - 60);
  return (start ? "…" : "") + text.slice(start, start + 170).trim() + "…";
}

export function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = norm((searchParams.get("q") || "").trim());
  if (q.length < 2) return NextResponse.json({ results: [] });
  const terms = q.split(/\s+/).filter(Boolean);

  const results = [];
  for (const item of searchIndex()) {
    const title = norm(item.title), desc = norm(item.description), body = norm(item.text);
    let score = 0;
    for (const term of terms) {
      let s = 0;
      if (title.includes(term)) s = 10;
      else if (desc.includes(term)) s = 4;
      else if (body.includes(term)) s = 1;
      if (!s) { score = 0; break; }
      score += s;
    }
    if (score && title.includes(q)) score += 15;
    if (score) score -= Math.max(0, item.href.split("/").filter(Boolean).length - 2) * 4;
    if (score > 0) {
      results.push({
        title: item.title, href: item.href, kind: item.kind, score,
        snippet: item.description || snippet(item.text, terms),
      });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return NextResponse.json({ results: results.slice(0, 7) });
}
