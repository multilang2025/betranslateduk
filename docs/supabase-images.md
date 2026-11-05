# Supabase image storage

- Project: "multilang2025's Project", ref `nlrpizplminaccqlaved` (shared with betranslated.es, .be, .de, .nl and ValenciaMove)
- Bucket: `betranslated-uk-images`, public read, same pattern as `betranslated-be-images`, `betranslated-de-images` and `valenciamove-images`
- Public URL base: `https://nlrpizplminaccqlaved.supabase.co/storage/v1/object/public/betranslated-uk-images/`

## What is in the bucket

Everything that was in `public/images/` (the old WordPress uploads, blog photos, the About page photo) and `public/img/` (the page illustrations), under the same paths:

| Site path | Bucket object |
|-----------|---------------|
| `/images/wp-content/uploads/2024/10/london-translation-services.jpg` | `images/wp-content/uploads/2024/10/london-translation-services.jpg` |
| `/img/en/audio-video-transcription.webp` | `img/en/audio-video-transcription.webp` |

Because the paths match, the code maps one to the other with a plain prefix. Content files and data files keep their `/images/...` paths. The only exception is three old uploads with a "ç" in the file name (`...fran%C3%A7ais...`): Storage keys stay ASCII, so `objectKey()` in `lib/site.js` turns them into `...fran_ais...`, for the upload script and the site alike.

Not in the bucket: the brand fonts, logos, icons, flags, service images and the legacy theme CSS. They are small, ship with the build and must not depend on a second host.

## Wiring

- `lib/site.js`: `IMAGES_BASE`, `imgUrl()`, `unImg()` and `imgHtml()`. `NEXT_PUBLIC_IMAGES_URL` overrides the base; an empty value serves `/images` and `/img` from `public/` again.
- `lib/content.js` rewrites `/images/...` and `/img/...` in every page and post body, and in `og.image` and `images[]`, when it reads the content (`imgHtml`, `imgUrl`).
- Components that name an image path themselves (`Team`, `TranslatorsGrid`, `ServicesShowcase`, `HomePage`, `ScrapedPage` hero) and `lib/blogImages.js` call `imgUrl()`.
- `lib/sanitize.js` looks image sizes up in `data/image-dims.json` with `unImg()`, because that file is keyed by the `/images/...` path.
- `app/og/[...path]/route.js` fetches the card photo from the bucket (or reads `public/` when the base is empty). If the fetch fails the card falls back to the language-pair motif.
- `next.config.mjs` lets `next/image` load only `betranslated-uk-images/**` and `btvibe-images/**` from the Supabase host.

## Uploading

```bash
node tools/upload-images.mjs --env-file <path to an .env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY>
```

Re-running is safe (every object is upserted). Run it again after adding a file to `public/images` or `public/img`, or add the file to the bucket from the Supabase dashboard under the same path. The service role key is read at run time and never written anywhere.

`tools/image-dims.mjs` (image sizes) reads `public/` when the file is there and the bucket otherwise.
