# ARVON CONTRACTING | أرفون للمقاولات الإنشائية

Official website: Arabic, RTL, static, prerendered. Creative direction: *ARVON — Engineered Motion*.

Stack: React, TypeScript, Vite, custom CSS, GSAP with ScrollTrigger. Lenis is not used: native scroll with
ScrollTrigger was smooth in testing and leaves scrolling and accessibility untouched.

## How the page is delivered

The page is static, so React runs once at build time (`src/entry-server.tsx`, `scripts/prerender.mjs`) and no React
code reaches the browser. This replaced full hydration, which cost 426 kB of JavaScript and most of the mobile
blocking time.

- `index.html`: CSS intro, with a small inline script for skip and end. It needs no bundle.
- `src/main.ts` and `src/client/`: about 5 kB. Header, mobile menu, quote dialog, floating button.
- `src/motion/`: GSAP scenes, loaded on first scroll or after 3.5 s, and started once scrolling settles, because
  ScrollTrigger's measuring would otherwise abort an anchor jump in progress.
- Everything is readable before, and without, these scripts. Motion only ever adds to the default state.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Typecheck, build, prerender to `dist/` |
| `npm run preview` | Serve the production build at `localhost:4173/arvon/` |
| `npm test` | Playwright suite (Chromium, Firefox, WebKit) against the preview |
| `npm run images` | Regenerate responsive photographs from `../Image` |
| `node scripts/brand-assets.mjs` | Regenerate favicons, social image and logo PNG |

Pushing to `main` runs `.github/workflows/deploy.yml`: tests in all three browsers, then deploy to GitHub Pages.

## Structure

- `src/content/` all copy. `ar.ts` is the only locale; `types.ts` defines the shape a future `en.ts` would follow.
- `src/data/` contact details, social links, image metadata.
- `src/sections/` one component per page section. `src/components/` shared parts.
- `build/` logo artwork and the Vite plugin that injects the page's single logo sprite.
- `src/styles/` tokens, base, components, and one stylesheet per scene group.
- `public/images/` generated photographs. `public/brand/` generated icons.

## Updating content

**Text:** edit `src/content/ar.ts`. Services, navigation, experience and quality copy all live there.

**A photograph:** replace the numbered file in `../Image`, keeping its number, run `npm run images`, and commit
`public/images`. If its dimensions change, update `src/data/images.ts`, including `focus`, which sets the crop
for wide and narrow screens. Originals are never modified.

**Experience details:** add `year`, `scope` or `image` to a record in `experience.records`. Empty fields do not render.

**LinkedIn:** add one line to `socialLinks` in `src/data/contact.ts`:

```ts
{ id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/...' },
```

The contact section and footer pick it up, and the icon already exists. Also add the URL to `sameAs` in the
structured data in `index.html`, and remove the "no LinkedIn" assertion in `tests/functional.spec.ts`.

**English later:** add `src/content/en.ts` satisfying `SiteContent`, then a locale route and `dir` switch. No
language switch is shown until that exists.

## Logo

The brand package supplied only a PDF with a raster board, so `build/logoArtwork.ts` is a colour-separated trace of
that approved artwork (`scripts/trace-logo.mjs`, `scripts/emit-logo-module.mjs`, which need `potrace` installed
separately). It is suitable for screen use. The guidelines require original vector artwork for print and signage:
when the vector master is available, replace the paths in that file.

The navigation bar uses the horizontal English arrangement from board lockup 06, positioned by `src/data/logoGeometry.ts`.
The stacked master would need a bar over 100 px tall to stay above the 140 px minimum width.

## Accessibility note on colour

Charcoal on ARVON Orange is 4.39:1, and white on orange is 3.6:1. Orange therefore carries only large bold text
(primary buttons at 19px bold) or graphic marks. Brand colours are unchanged. See `QA_REPORT.md`.
