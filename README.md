# ARVON CONTRACTING | أرفون للمقاولات الإنشائية

Official website: Arabic, RTL, static, prerendered. Creative direction: *ARVON — Engineered Motion*.

Stack: React, TypeScript, Vite, custom CSS, GSAP with ScrollTrigger. Lenis is not used: native scroll with
ScrollTrigger was smooth in testing and leaves scrolling and accessibility untouched.

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
- `src/hooks/useScrollScene.ts` scoped GSAP scenes with cleanup, breakpoints and reduced-motion handling.
- `src/styles/` tokens, base, components, and one stylesheet per scene group.
- `public/images/` generated photographs. `public/brand/` generated icons.

## Updating content

**Text:** edit `src/content/ar.ts`. Services, navigation, experience and quality copy all live there.

**A photograph:** replace the numbered file in `../Image`, keeping its number, run `npm run images`, and commit
`public/images`. If its dimensions change, update `src/data/images.ts`, including `focus`, which sets the crop
for wide and narrow screens. Originals are never modified.

**A photograph for a service with none (foundation, thermal, underfloor):** add it to `optimize-images.mjs` and
`images.ts`, then add `image: { id, alt }` to that service. The typographic plate is replaced automatically.

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

The brand package supplied only a PDF with a raster board, so `src/components/logoArtwork.ts` is a
colour-separated trace of that approved artwork (`scripts/trace-logo.mjs`, `scripts/emit-logo-module.mjs`, which
need `potrace` installed separately). It is suitable for screen use. The guidelines require original vector
artwork for print and signage: when the vector master is available, replace the paths in that file.

The Arabic lockup uses the standalone symbol, because the board's lockups draw the symbol at a different
proportion (about 1.65:1) from the master logo (about 1.83:1). Neither is stretched to match the other.

## Accessibility note on colour

Charcoal on ARVON Orange is 4.39:1, and white on orange is 3.6:1. Orange therefore carries only large bold text
(primary buttons at 19px bold) or graphic marks. Brand colours are unchanged. See `QA_REPORT.md`.
