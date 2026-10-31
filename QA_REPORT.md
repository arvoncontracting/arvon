# ARVON website — QA report

Tested on a local production build, 2026-10-31, Linux (Kali), Node 24, Playwright 1.64.
Only checks that actually ran are reported. Deployment status is in Round 5.

## Round 1 — Brand integrity

**Tests:** read all 14 PDF pages and viewed the rendered pages and embedded images. Automated: palette tokens are
exact, logo renders at 140px or wider at 320px viewport, rendered ratio matches source. Manual comparison of the
traced logo against the board at 8x.

**Problems found and fixed:**
- No vector logo exists; only a raster board. Traced by colour separation, no redraw.
- First Arabic trace dropped dots in «للمقاولات الإنشائية». Retraced from the larger typography panel; dots preserved.
- Board lockups draw the symbol at a different proportion from the master (1.65 vs 1.83). Standalone symbol traced
  separately rather than stretching the master.
- Photo 4 has black letterbox bars. Cropped in the web copy; original untouched.

**Retest:** pass. Exact colours, approved variants, `dark-bg` follows the orange-plus-white office sign on the board.

**Remaining limitations:** logo is a trace from a raster source, fine on screen, not for print (the PDF itself says
so). Vector master needed. Neutrals outside the palette: paper `#F6F4EF` (from the board's background),
`#54585B` (Stone darkened for small text), `#D4D6D7` (secondary text on dark).

## Round 2 — Visual and cinematic

**Tests:** real screenshots captured and reviewed by eye: intro in 9 timed frames at 1440 and 390; full scroll at
320, 390, 768, 1024, 1440, 1920. Automated reverse-scroll test.

**Problems found and fixed:**
- Asphalt title covered the roller's cab. Title narrowed and resized.
- Orange scene line crossed body text on phones, and pillar text on desktop. Hidden on narrow, shortened on wide.
- Hero headline ran past the dark gradient at 1024. Column narrowed, gradient extended.
- Dead space after the asphalt and concrete scenes. Padding reduced.
- Service index titles wrapped needlessly: a flex rule was hitting the number span. Selector fixed.
- Warranty pattern showed a visible seam. Replaced with continuous diagonals.
- Floating WhatsApp overlapped the third hero pillar on phones. Now hidden on the hero and contact sections.
- Stray fragment in the intro before the wordmark reveal. Fixed.

**Retest:** pass. Pinning is limited to one scene (asphalt, desktop only); phones have no pinning. Reverse scroll
restores every section.

**Remaining limitations:** frame-rate was judged from stills and headless runs, not on a physical phone. Photos
top out at about 1600px, so they soften slightly on 1920px and larger screens; nothing was upscaled.

## Round 3 — Responsive and cross-browser

**Tests:** Playwright at 320, 375, 390, 430, 768, 1024, 1440, 1920, stepping the whole page down and up and asserting
no horizontal overflow at each stop. Touch targets, RTL, mobile menu, floating button, reduced motion.

**Problems found and fixed:**
- Overflow at 320–430: the email address forced grid tracks wider than the viewport in contact and footer. Tracks
  now `minmax(0, 1fr)`, contact rows stack on phones.
- Overflow at 320: tilted warranty sheet. Section clipped horizontally.
- Footer and back-to-top links under 44px. Raised.

**Retest:** Chromium and Firefox pass at all widths.

**Remaining limitations:** **WebKit did not run locally**: the browser is installed but needs Ubuntu libraries
missing on Kali (`libicu74`, `libjpeg-turbo8`). The GitHub Actions workflow runs the full suite in WebKit on Ubuntu
before every deploy; that result is pending the first push. No real iOS or Android device was tested.

## Round 4 — Functional and content

**Tests (automated):** every in-page link resolves, header navigation arrives; exact phone, WhatsApp, email, Facebook,
Instagram links; decoded `mailto:` subject and body; quote dialog with required fields, service preselection, real
WhatsApp popup URL and no fake success; intro timing, skip, no replay, deep-link bypass; mobile menu focus and Escape;
skip link and focus outline; all seven photos load in the right sections, with alt text; nine service titles;
founders; experience order; technical wording; warranty labelling with no digits; search for placeholders, ISO/CE,
superlatives, invented statistics, testimonials, ratings. JavaScript-off rendering via prerendered HTML.
External links fetched: wa.me, Facebook, Instagram all returned HTTP 200.

**Problems found and fixed:** two test-side errors (wrong row selector, tilt measured as distortion), corrected.
No content defects were found.

**Retest:** pass.

**Remaining limitations:** the supplied membrane photo shows no manufacturer marking. Photo 6 shows a small
"Dynamic" equipment label on the trowel guard; kept, since the brief says to preserve the scene. Whether photos 2–7
are real ARVON site photographs is unverified, so they illustrate services and are never captioned as completed
projects. Arabic copy should get a final read by the owner. Mail and WhatsApp hand-off was verified by URL; no
message was actually sent.

## Round 5 — Production and deployment

**Local results:**
- `tsc --noEmit`: pass.
- `npm run build`: pass, prerendered. `dist` 5.6 MB. JS 146 kB gzip, CSS 7 kB gzip.
- Playwright: **74 passed, 2 skipped** (axe sweep runs once, in Chromium) across Chromium and Firefox.
- `npm audit`: 0 vulnerabilities.
- axe (WCAG A/AA, best-practice): 0 violations at 1440 and 390, after fixing the items below.
- Lighthouse on a local gzip server, before the last minor CSS tweaks:

| | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile | 79 | 100 | 100 | 100 | 4.7 s | 0.002 | 100 ms |
| Desktop | 97 | 100 | 100 | 100 | 0.9 s | 0 | 0 ms |

**Problems found and fixed:** charcoal on brand orange is 4.39:1, under AA for normal text, so primary buttons
became 19px bold and section tabs became an orange marker beside text. WhatsApp button placed in a landmark.

**Remaining limitations:** mobile LCP is held back mainly by the 3-second intro covering the hero, a deliberate
trade-off for first visits; returning visitors in the same session skip it.

**Deployment: NOT DONE.** The authenticated account `aljohry7` has read-only access to
`arvoncontracting/arvon` (`push: false`). Nothing was pushed, and the live checks have not been run.
