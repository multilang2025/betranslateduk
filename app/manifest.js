// Web app manifest: name, colours and the 512 px icon (app/icon.png), as on betranslated.es.
export default function manifest() {
  return {
    name: "BeTranslated UK",
    short_name: "BeTranslated",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
