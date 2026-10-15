import Script from 'next/script';
import { sanitizeBodyHtml } from '@/lib/sanitize';

function toLocalThemeAssetPath(remoteUrl) {
  try {
    const u = new URL(remoteUrl, 'https://www.betranslated.co.uk');
    if (!u.hostname.includes('betranslated.co.uk')) return null; // third-party (GTM, ahrefs...) skipped
    return '/theme-assets' + u.pathname;
  } catch (e) {
    return null;
  }
}

function slugFromUrl(url) {
  try {
    return new URL(url).pathname.replace(/^\/|\/$/g, '');
  } catch (e) {
    return '';
  }
}

// Generic renderer for any scraped page: the real ported theme/plugin
// stylesheets, the original per-page inline CSS (Divi generates unique
// dynamic CSS per page), the real body markup+classes, and the original
// scripts so Divi's own entrance/scroll animations keep running.
export default function ScrapedPage({ page }) {
  const inlineCss = (page.headInlineStyles || []).map(s => s.css).join('\n');
  const bodyClass = page.bodyClass || '';
  const pageSlug = slugFromUrl(page.url);

  const stylesheets = (page.headStylesheets || [])
    .map(s => toLocalThemeAssetPath(s.href))
    .filter(Boolean);

  const scripts = (page.headScripts || [])
    .map(s => ({ id: s.id, localSrc: toLocalThemeAssetPath(s.src) }))
    .filter(s => s.localSrc);

  return (
    <>
      {stylesheets.map((href, i) => (
        <link key={i} rel="stylesheet" href={href} />
      ))}
      {inlineCss ? <style dangerouslySetInnerHTML={{ __html: inlineCss }} /> : null}
      <div className={bodyClass} dangerouslySetInnerHTML={{ __html: sanitizeBodyHtml(page.bodyHtml, { pageSlug }) }} />
      {scripts.map((s, i) => (
        <Script key={s.id || i} src={s.localSrc} strategy="afterInteractive" />
      ))}
    </>
  );
}
