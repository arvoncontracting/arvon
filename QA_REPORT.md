# ARVON website — QA report

Release of 2026-10-31. Only checks that actually ran are reported.
Environment: Kali Linux, Node 24, Playwright 1.64 (Chromium, Firefox locally; Chromium, Firefox, WebKit in GitHub Actions on Ubuntu), Lighthouse default profiles.

## Round 1 — Content, Arabic and material claims

**Tests:** repository-wide search for grades, origin and supplier terms, every hit inspected. Automated checks on the
built HTML and sources: exact service titles and numbering 01–09, founders, experience order, no note blocks, membrane
qualifiers, no ISO or CE claims, no statistics or ratings. Full manual rewrite pass of `src/content/ar.ts`.

**Found and fixed:**
- Hot asphalt grades, origin and refinery text in the service, plus a refinery reference in the asphalt note. Removed.
- All "تنويه فني" blocks removed. Accuracy kept in the prose: slope is separate from waterproofing, trowel finishing
  follows casting, not every roof system suits underground work.
- Titles corrected: «عزل Underfloor», «عزل الأساسات». Latin runs isolated with a `Bidi` component.
- Phrasing tightened across the site. A rewrite changed the founders heading to the dual form; the owner specified
  «المؤسسون», so it was restored. «السيد صهيب القيسي» and «9 خدمات متخصصة» applied as instructed.

**Retest:** pass.

**Limitations:** the Arabic was reviewed by the implementer, not a native proofreader. European standards were not
mentioned because no product documents were supplied.

## Round 2 — Brand and visual polish

**Tests:** screenshots reviewed by eye: intro in 9 timed frames at 1440 and 390; full scroll at 390 and 1440; hero,
first section and timeline at 320, 768, 1024, 1920. Automated header logo size, position and proportion checks.

**Found and fixed:**
- Stacked English master needs a bar over 100 px tall at the 140 px minimum. Header uses the horizontal English
  arrangement from board lockup 06: 200 px on phones, 240 px on desktop.
- Logo collided with hero text at the end of the intro. Text now arrives as the logo leaves.
- Section wedge clipped the first hero pillar. Direction flipped.
- Hot-asphalt worker cropped in the stage. Focus moved.
- Stray "|" at a line end in the Quality heading. Latin title now stacks.
- Hero logo removed: with the English header logo it duplicated the mark on one screen.

**Retest:** pass.

**Limitations:** the logo remains a trace from the PDF's raster board. Fine on screen; print needs the vector master.
The board draws the symbol at slightly different proportions between lockups; neither was stretched.

## Round 3 — Responsive and motion

**Tests:** whole page stepped down and up at 320, 375, 390, 430, 768, 1024, 1440, 1920 with no-overflow assertions.
Timeline: 5 stages visible at 320, 390, 768, 1440; active stage checked at each stage, both directions, at 390 and 1440.
Reduced motion, no pinning, touch targets, RTL, mobile menu, floating button.

**Found and fixed:**
- Floating WhatsApp sat over line ends while reading on phones. It now appears only on scroll-up.
- The pinned road scene was replaced by a sticky fact column and a vertical timeline, so nothing traps scrolling.
- WebKit, CI only: fixed-delay timeline test read state too early under load. It now waits for the expected stage.
  It would still fail if a stage were really skipped.

**Retest:** all three browsers pass.

**Limitations:** WebKit runs only in CI (the Kali machine lacks its libraries) and is Playwright's build, not Safari.
No physical iPhone or Android test.

## Round 4 — Functionality and assets

**Tests:** all ten images mapped and loaded, with alt text; desktop stage shows each of the five waterproofing photos;
in-page links; exact phone, WhatsApp, email and social links; decoded `mailto:`; quote dialog with no false success;
skip button; intro with the JS bundle blocked; JavaScript-off rendering; console errors.

**Found and fixed:**
- **Real bug, found in three forms:** ScrollTrigger's start-up measuring cancelled an anchor jump in progress, from
  header links, the mobile menu (first seen as a CI failure) and deep links (WebKit). Motion now waits for scrolling
  to settle, and a cancelled jump is resumed. Added a test at five tap timings; 64 repeated runs passed.

**Retest:** pass. External links returned 200 in the previous release and were not changed.

**Limitations:** images 2–10 are not verified as real ARVON sites, so they illustrate services and are never captioned
as projects. Image 6 shows a small "Dynamic" equipment label. Image 9's rolls carry illegible blue marks, with no
readable brand. No message was actually sent through WhatsApp or email.

## Round 5 — Performance, accessibility and production

**Bottlenecks found (baseline):** 426 kB of JS hydrating a static page (TBT 628 ms), intro holding the hero behind JS,
166 kB HTML with logo paths repeated, render-blocking stylesheet, phones fetching the wide hero.

**Changes:**
- React now renders at build time only. Browser entry is 5 kB, plus GSAP 45 kB gzip loaded on first scroll or after
  3.5 s. Justified by the page being static; markup stays in React components.
- CSS intro, about 2 s, over the already painted hero. Needs no bundle.
- One logo sprite; CSS inlined; two critical fonts preloaded, two weights dropped; 660 px portrait hero for phones.
- Mobile scrubbed effects removed; desktop keeps them.

**Live Lighthouse** on https://arvoncontracting.github.io/arvon/, default profiles, median of runs:

| | Runs | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile before | 3 | 68 (65, 68, 77) | 100 | 100 | 100 | 2.3 s | 3.7 s | 628 ms | 0.002 | 5.2 s |
| Mobile after | 5 | **95** (95, 95, 95, 93, 96) | 100 | 100 | 100 | 1.4 s | 2.3 s | 105 ms | 0 | 4.6 s |
| Desktop before | 3 | 97 | 100 | 100 | 100 | 0.4 s | 0.6 s | 7 ms | 0 | 1.8 s |
| Desktop after | 5 | **99** | 100 | 100 | 100 | 0.4 s | 0.5 s | 0 ms | 0.002 | 1.4 s |

INP was not measured: Lighthouse does not report it in this mode, and there is no field data.

**Production checks:** `tsc` pass; build pass; `npm audit` 0 vulnerabilities; axe 0 violations at 1440 and 390;
all 16 assets referenced by the page return 200; HTTPS with HTTP redirect.

**Remaining:** mobile Speed Index stays at 4.6 s because the intro covers the first screen for about two seconds. That
is the price of keeping it. Actions logs warn that some actions target Node 20; not failing today.

**Deployment history:** three runs stopped at the test gate before reaching production (anchor race, then two WebKit
items). Run 41205720906 on commit 48d4859 passed 173 tests with 4 skipped across all three browsers, and deployed.
Against the live URL: 116 passed, 2 skipped in Chromium and Firefox on the release before the founders-heading fix,
then 59 passed in Chromium after it. Lighthouse figures come from the release just before that one-word fix.
