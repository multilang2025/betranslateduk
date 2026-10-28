import Script from "next/script";

// Legacy tracking carried over from the WordPress site (checked 2026-10-17):
// Google Tag Manager (the container has no tags today), the GA4 property
// "www.betranslated.es - GA4" (Mike, 2026-10-17; the Site Kit property
// G-BC6W6J0K1Z was dropped), Microsoft Clarity (linked to Bing Webmaster
// Tools) and Ahrefs Web Analytics.
// - Only on the production host, so preview and local traffic stay out.
// - Ahrefs Web Analytics sets no cookies and loads right away.
// - GTM, GA4 and Clarity set cookies, so they load only after the visitor
//   accepts in the cookie banner (components/chrome/CookieConsent.jsx). Google
//   Consent Mode v2 defaults stay "denied" until then.
// - Contact events for GA4 (mark them as key events there): one delegated
//   listener sends email_click, phone_click and whatsapp_click for every
//   mailto:, tel: and wa.me link; the quote form sends generate_lead and
//   quote_mailto through window.btTrack. Nothing is sent before consent:
//   btTrack is a no-op until the tags have loaded.
// - NOT mounted on the UK site yet: GTM, GA4, Clarity, Ahrefs and HOSTS below are
//   still the betranslated.es ones. Set the UK ids and hosts before mounting it.
const GTM = "GTM-K83LCLS";
const GA4 = ["G-BMCV42QBEE"];
const CLARITY = "fwucx0beoi";
const AHREFS_KEY = "mWNCxyRqF+r7l5O858pycg";
const HOSTS = ["betranslated.es", "www.betranslated.es"];
export const CONSENT_KEY = "bt-consent";

const BOOT = `(function(){
var d=document,prod=${JSON.stringify(HOSTS)}.indexOf(location.hostname)>=0,loaded=false;
function add(src,attrs){var s=d.createElement("script");s.async=true;s.src=src;for(var k in attrs||{})s.setAttribute(k,attrs[k]);d.head.appendChild(s);}
window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:"denied"});
window.btLoadTracking=function(){
  gtag("consent","update",{analytics_storage:"granted"});
  if(!prod||loaded)return;loaded=true;
  dataLayer.push({"gtm.start":new Date().getTime(),event:"gtm.js"});add("https://www.googletagmanager.com/gtm.js?id=${GTM}");
  gtag("js",new Date());${GA4.map((id) => `gtag("config","${id}");`).join("")}add("https://www.googletagmanager.com/gtag/js?id=${GA4[0]}");
  window.btTrack=function(n,p){gtag("event",n,p||{});};
  (function(c,l,a,r,i){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};add("https://www.clarity.ms/tag/"+i+"?ref=bwt");})(window,d,"clarity","script","${CLARITY}");
};
window.btTrack=window.btTrack||function(){};
d.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(!a)return;var h=a.getAttribute("href")||"",n=/^mailto:[^?]/i.test(h)?"email_click":/^tel:/i.test(h)?"phone_click":(h.indexOf("https://wa.me/")===0||h.indexOf("https://api.whatsapp.com/")===0)?"whatsapp_click":"";if(n)window.btTrack(n,{link_url:h.split("?")[0],link_area:(a.closest("footer,header,nav,aside,main")||{}).localName||""});},true);
if(prod)add("https://analytics.ahrefs.com/analytics.js",{"data-key":"${AHREFS_KEY}"});
try{var c=JSON.parse(localStorage.getItem("${CONSENT_KEY}")||"null");if(c&&c.v==="granted")window.btLoadTracking();}catch(e){}
})();`;

export default function Tracking() {
  return <Script id="bt-tracking" strategy="afterInteractive">{BOOT}</Script>;
}
