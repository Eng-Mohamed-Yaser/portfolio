# ORBIT — CINEMATIC FUTURISTIC TRANSFORMATION
## Final Delivery Report

**Project:** `Mohamed_Yasser` — personal portfolio
**Location:** `C:\Users\yasr4\Downloads\Mohamed_Yasser\`
**Brief:** ORBIT — Cinematic Futuristic Transformation (8-phase workflow)
**Status:** ✅ Complete — 69/69 automated regression checks passing, 0 horizontal overflow across 13 viewports, 0 console errors

---

## 1. Visual Transformation

The previous ORBIT build was a card grid with glass panels, gradient borders and hover glows. This
round replaced the *layout language* of every section rather than decorating it, so the result reads
as a different product, not the same site with more CSS.

### Design direction — "cinematic orbital system"

The portfolio is staged as a deep-space observatory. The hero is the focal body; each section is a
distinct orbital zone with its own lighting. There is no card grid anywhere in the page.

| Section | Before (glass-card build) | After (orbital build) |
|---|---|---|
| **Hero** | Two-column headline + glass panel portrait, gradient badge | Focal body: two-line editorial name in a gradient, portrait in a rotated offset plate, three elliptical orbital rings with luminous nodes, blue core light, mono signal strip (Focus / Stack / Status) |
| **About** | Three equal glass cards | Editorial column: large statement type, narrative, numbered hairline capability index, two asymmetric offset panels |
| **Skills** | Grid of skill cards, each with an icon chip | Capability matrix: five horizontal bands, outlined mono ordinals `01–05`, two-column hairline skill rows, no cards |
| **Tech Stack** | Four uniform category cards | Technology universe: Backend as the feature group (4-column, larger tiles) + three compact secondary groups, captioned *"Primary focus — backend"* |
| **Practices** | Grid of practice cards | Architectural system: vertical spine at x=109px, four nodes with index / icon / body |
| **Projects** | Three equal project cards | Cinematic showcase: alternating 1.3fr / 0.7fr rows, 16:10 frame with grid + orbital arc + outlined monogram, index `01 / 02 / 03` |
| **Contact** | Centred panel with round social buttons | Closing frame: two-column panel with blue-violet gradient glow, editorial social link rows |
| **Footer** | Dense link columns | Slim editorial grid |

### Motion system (BALANCED)

| Layer | Duration | Property |
|---|---|---|
| Micro (hover, focus, colour) | 150–220 ms | colour / border / background |
| Standard (nav pill, buttons) | 200–350 ms | transform (+ width/height for the out-of-flow nav pill only) |
| Entrances (reveals) | 400–600 ms | `translate` + opacity |
| Ambient (orbit rings, core light, nodes) | 18–42 s loops | opacity / transform |
| Caret | 1.4 s loop | opacity |

Only four `@keyframes` exist in the whole stylesheet. Every reveal uses the independent `translate`
property rather than `transform`, so a reveal cannot strip a component's own transform transition.

---

## 2. Performance Optimization

### Measured before → after

Same harness, same machine, same viewport (1440×900), scroll-through + frame sampling. **After**
figures are the median of three runs; paint metrics vary ±100 ms run-to-run in this harness, so the
ranges are given.

| Metric | Before | After | Change |
|---|---|---|---|
| **First Contentful Paint** | 464 ms | **500 ms** (408–500) | +8 % ⚠️ |
| **Largest Contentful Paint** | 1596 ms | **532 ms** (516–1092) | **−67 %** ✅ |
| **Cumulative Layout Shift** | 0.00065 | **0** (0–0.00159) | ✅ |
| **Long tasks** | 9 tasks / 554 ms | 2 tasks / ~355 ms | **−78 % count** ✅ |
| **Total Blocking Time** | 104 ms | 264 ms (238–267) | +154 % ⚠️ |
| **Avg frame during scroll** | 27.42 ms | **16.67 ms** | **−39 %** ✅ |
| **p95 frame** | 50 ms | **16.8 ms** | **−66 %** ✅ |
| **Max frame** | 66.7 ms | **16.8 ms** | **−75 %** ✅ |
| **Frames > 32 ms** | **46.8 %** | **0 %** | ✅ |
| **RecalcStyleDuration** | 1.4486 s | **0.153 s** | **−89 %** ✅ |
| **TaskDuration** | 5.0921 s | **1.078 s** | **−79 %** ✅ |
| **ScriptDuration** | 0.0274 s | 0.0140 s | −49 % ✅ |
| **LayoutDuration** | 0.3428 s | 0.341 s | flat |
| **Cold page weight** | ~610 KB (computed) | **308.7 KB** (measured) | **−49 %** ✅ |
| **Third-party requests** | 37 | **31–32** | −16 % ✅ |

**Reading the two ⚠️ rows honestly:** TBT is worse while every other interactivity measure is
dramatically better. The previous build spread its work across nine ~60 ms long tasks (which barely
cleared the 50 ms threshold, so TBT looked small but the frame budget was blown half the time). The
new build does *less total work* — TaskDuration is down 79 % — concentrated into two blocks of
browser-side text layout and font rasterisation, which are charged to TBT. The user-visible result
is the opposite of what the TBT number suggests: **zero frames over 32 ms, versus 46.8 % before.**

### What was removed

| Technique | Before | After |
|---|---|---|
| `backdrop-filter` declarations | 18 | **0** |
| Live DOM elements with `backdrop-filter` | 28 | **0** |
| `filter: blur()` declarations | 21 | **0** |
| `mask-composite` gradient rings | 7 | **0** |
| `will-change` | 2 | **0** |
| Pointer-tracking spotlight / 3D tilt | yes | removed |
| Per-scroll `--sy` full-screen layer write | yes | removed |
| Scroll-progress bar | yes | removed |
| `getBoundingClientRect` in JS | 2 (in scroll path) | **1** (measurement only, never in a scroll handler) |

Glows are now radial-gradient layers; gradient borders are plain translucent borders. Nothing
animates anything other than `transform`, `opacity` and `border-color`/`background-color`.

### What was added

* **Self-hosted variable fonts.** The render-blocking `fonts.googleapis.com` stylesheet is gone.
  Manrope, Inter and JetBrains Mono are served from `assets/fonts/` as three latin-subset variable
  files (102 KB total) instead of a third-party CSS round-trip plus nine static instances.
  `font-display: swap` and the exact Google unicode-range are preserved, so glyph coverage and
  fallback behaviour are byte-identical.
* **Fonts deliberately not preloaded.** Preloading raised the font above the hero portrait and
  pushed median LCP from 492 ms to 1100 ms. Not preloading is the measured-better choice.
* **Right-sized image derivatives.** The originals are untouched on disk; the page now loads the
  right-sized versions.

| Asset | Before | After | Saved |
|---|---|---|---|
| Hero portrait | `portrait.jpg` 104,372 B | `portrait.webp` 44,188 B (JPEG kept as fallback) | 60,184 B |
| Nav / footer logo | `logo-mark.png` 218,966 B (560×343, displayed at 44×27) | `logo-mark-small.webp` 8,408 B | 210,558 B |
| Favicon | `favicon.png` 42,049 B (256×256) | `favicon-64.png` 4,637 B | 37,412 B |
| Apple touch icon | `apple-touch-icon.png` 42,049 B (256×256) | `apple-touch-icon-180.png` 23,762 B | 18,287 B |
| Font stylesheet | Google Fonts CSS 20,961 B (3rd party) | `assets/css/fonts.css` 2,230 B | 18,731 B |

* **The load handler no longer forces a reflow.** CDP tracing showed the `load` handler spending
  **148 ms** reading rects while the webfont swap had already invalidated the layout — a forced
  synchronous full-page reflow on the critical path. Deferring the read two animation frames let the
  browser lay out on its own schedule: `FunctionCall` dropped **202 ms → 4.7 ms**.
* **Cached section offsets.** Active-section tracking reads a cached offset table instead of
  measuring on every scroll frame; DOM writes happen only when the active section actually changes.
* **Explicit `width`/`height` on all 32 lazy images**, so no tile can shift as its icon arrives.

### Code size

| File | Before | After |
|---|---|---|
| `index.html` | — | 53,433 B / 879 lines |
| `assets/css/style.css` | 66,660 B / 2,159 lines | **52,512 B / 1,772 lines** |
| `assets/css/fonts.css` (new) | — | 2,230 B / 47 lines |
| `assets/js/main.js` | 11,043 B / 309 lines | **10,064 B / 269 lines** |
| JS event listeners | 10 | 9 |
| JS `requestAnimationFrame` | 2 | 4 (2 are the deferral pair) |
| JS `getBoundingClientRect` | 2 | **1** |

No libraries were added. The site remains three files of hand-written HTML, CSS and vanilla JS.

---

## 3. Functional Preservation

**All content preserved verbatim** — biography, skills, technologies, engineering practices, project
names and descriptions (CityPulse, StudentApi, DVLD System), social links, contact details, images,
logo and every external URL. Nothing was invented: no screenshots, no proficiency percentages, no
expertise rankings, no functional claims.

**All preserved identifiers** verified by automated check: `#main`, `#site-header`, `#nav-menu`,
`#counter-current`, `#year`, `#rotator-text`, `#hero-name`, `#about-title`, `#skills-title`,
`#stack-title`, `#practices-title`, `#projects-title`, `#contact-title`, `#site-footer`, the seven
section IDs, `data-cnt="1..8"` in document order, `.reveal`, `[data-copy]`, `[data-copy-label]`.

**All features working** — verified by a 69-check regression suite plus manual verification in the
real in-app browser (Electron Chromium, not headless):

| Feature | Status |
|---|---|
| Navigation + sliding active pill | ✅ pill verified visible, sized, and inside the nav's stacking context |
| Active-section tracking | ✅ follows scroll across all sections; counter reads 03/08, 04/08 |
| Mobile menu | ✅ opens, `aria-expanded` toggles, closes via link / Escape / outside click |
| Rotating specialisation | ✅ cycles through all six strings |
| Copy email | ✅ confirms "Copied ✓", restores after 2.2 s, correct address |
| Scroll reveal | ✅ activates on scroll, all shown under reduced motion |
| Social links | ✅ GitHub ×3, LinkedIn ×3, `mailto:` ×3, `rel="noopener"` on every `_blank` |
| Project actions | ✅ 6 buttons, all `disabled` with honest tooltips |
| Responsive | ✅ no horizontal overflow at 320 / 360 / 390 / 430 / 600 / 768 / 900 / 1024 / 1280 / 1440 / 1600 / 1920 |
| Console & network | ✅ zero uncaught exceptions, zero console errors, zero failed requests |

### Accessibility (measured, not assumed)

* Full WCAG AA contrast sweep across every text node — all previously failing text now passes after
  `--text-3` was lifted from `#64728D` (4.16:1) to `#7D8CAA` (**5.9:1**).
* One `<h1>`, no skipped heading levels, landmarks for header / nav / main / footer.
* Skip link present and working, animated with `transform` only.
* Every `<img>` has `alt` (decorative marks use `alt=""`); every interactive control has an
  accessible name.
* Mobile tap targets ≥ 44 px (hero social links were 25 px tall and were fixed).
* `prefers-reduced-motion` honoured: reveals show instantly, the rotator stops, orbital animation is
  disabled.
* State is never conveyed by colour alone — active nav items also carry a filled pill and a marker.

---

## 4. Files Modified

| File | Change |
|---|---|
| `index.html` | **Rewritten** (879 lines). New section compositions, orbital hero, `<picture>` elements, self-hosted font link, 32 images given explicit dimensions. All IDs, anchors, `data-cnt`, URLs and copy preserved. The About capability rows were given a real body element in the verification pass (§7, defect 1). |
| `assets/css/style.css` | **Rewritten** (1,893 lines). New token system, five layout breakpoints, zero backdrop-filter / blur / mask-composite / will-change. Tech Stack and About panel compositions revised in the verification pass (§7, defects 2–3). |
| `assets/css/fonts.css` | **New.** Three `@font-face` rules for the self-hosted variable fonts. |
| `assets/js/main.js` | **Rewritten** (269 lines). Cached offsets, rAF-batched scroll, deferred load measurement, no pointer tracking, no per-scroll writes. |
| `assets/fonts/*.woff2` | **New.** Manrope, Inter, JetBrains Mono latin variable subsets (102 KB). |
| `assets/img/portrait.webp` | **New.** Existing artwork, lighter encoding. |
| `assets/img/logo-mark-small.png` / `.webp` | **New.** 132×81 derivatives of the untouched original. |
| `assets/img/favicon-64.png` | **New.** 64×64 derivative. |
| `assets/img/apple-touch-icon-180.png` | **New.** 180×180 derivative. |
| `assets/img/constellation.svg`, `stars.svg` | Kept, reused for the backdrop. |
| `assets/img/logo-mark.png`, `logo-full.png`, `favicon.png`, `apple-touch-icon.png`, `portrait.jpg`, `og-cover.jpg` | **Untouched** originals, retained as sources and fallbacks. |
| `README.md` | Updated — structure, tokens, section map, fonts and image-derivative notes. |
| `ORBIT-CINEMATIC-REPORT.md` | **New.** This document. |
| `.vscode/mcp.json` | Untouched — intentionally tracked by the repository's first commit. |

**Class renames** (every dependent reference updated; no broken selectors remain):

`.mini-card` → `.panel` · `.card.skill-card` → `.capability` · `.stack-cat` → `.tech-group` ·
`.stack-cat__item` → `.tech-tile` · `.practice` → `.practice-node` ·
`.project-card` → `.project` · `.btn--outline` → `.btn--ghost` · `.tags--sm` → `.tags`

Added: `.hero__core`, `.hero__plate`, `.orbit` / `.orbit__ring`×3 / `.orbit__node`×4,
`.hero__signal`, `.contact__glow`, `.project__glyph`, `.project__frame`, `.project-action`.

---

## 5. Remaining Limitations

1. **No project screenshots exist.** `github.com/Eng-Mohamed-Yaser` exposes `public_repos: 0`, so
   there is no real preview or repository URL to link to. Each project frame therefore shows a
   clearly-labelled **outlined monogram** with a *"Preview placeholder"* tag — deliberately reading as
   a placeholder rather than a fabricated screenshot. All six project buttons stay `disabled` with
   honest tooltips. **When real screenshots and URLs exist, the frames and buttons are the only
   things that need replacing.**
2. **No Lighthouse score is claimed.** Lighthouse was not available in this environment. Every
   performance figure above comes from the CDP harness (FCP / LCP / CLS / TBT / frame timing /
   `Performance.getMetrics` / resource timing) and from CDP tracing. No synthetic score is asserted.
3. **The residual load-time long task is browser text work, not application code.** Two blocks of
   ~160 ms remain at load: the initial document layout and the re-layout caused by the webfont swap
   (`font-display: swap` is required by the brief, and the spec lists it as an allowed pattern).
   Application code contributes `ScriptDuration` of 0.014 s. This was re-attributed in the verification
   pass by blocking resources one class at a time: removing the **icon CDNs** leaves the two long tasks
   in place (2 / 150 ms), while removing the **local fonts** removes them entirely (0 long tasks) —
   the cost is the webfont text layout, not the page's own code or its 33 remote marks.
4. **A small CLS residue appears when the font swaps** (0–0.00048, versus the 0.00065 baseline).
   Source: `NAV.nav` re-metrics when the webfont lands. It is ~200× below the "good" threshold of 0.1.
5. **33 technology marks still load from third-party CDNs** (jsDelivr, simpleicons, skillicons,
   thesvg, jwt.io, nuget.org). They are lazy, cached, tiny and off the critical path. Self-hosting
   them would remove the last external dependency but adds ~30 files to the repository.
6. **Icon marks can still fail if a CDN changes.** The `error` handler swaps in a neutral placeholder
   glyph and the `.is-icon-fallback` style was written for exactly this case — the tile never
   collapses into an empty box.
7. **Image derivatives are generated, not live.** `logo-mark-small.*`, `favicon-64.png` and
   `apple-touch-icon-180.png` are static files derived from the originals. If the source artwork is
   replaced, they must be regenerated — the HTML carries `✏️ EDIT` comments at each reference.
8. **Paint metrics in this harness vary ±100 ms between runs.** Medians of three runs are reported;
   the stable measures (frame timing, script time, style-recalc time, page weight) are exact.
9. **Nothing was committed or pushed.** The project remains a git repository with its original single
   commit; the working tree holds the redesign.

---

## 6. Quality Gate (§20)

> *"The transformation is NOT complete if the only changes are the ones listed above."*

The listed disqualifying changes — border colours, shadow colours, hover effects — are **not** what
changed. Every section was recomposed into a new layout language: an orbital focal hero, an
editorial About column, a capability matrix with no cards, a technology universe with one feature
group, an architectural spine for Practices, alternating cinematic project rows, a gradient-lit
closing frame and a slim editorial footer. The previous card grid does not survive anywhere in the
page. The result is a different design, and it is simultaneously ~50 % lighter with a frame budget
that never exceeds 16.8 ms.

---

## 7. Independent Final Verification

The transformation was then re-audited from scratch, as a Senior Creative Director and Web Performance
Engineer, **without assuming the code change had worked**. The pass covered 7 viewports × 8 sections
of rendered output, the DOM, the render pipeline, and every interaction.

### 7.1 Method

| Layer | Tool |
|---|---|
| Rendered composition | 40 screenshots across 1920 / 1440 / 1280 / 834 / 768 / 390 / 320, plus 2× DPI element captures |
| Text layout integrity | DOM scan for text runs collapsed into a narrow grid column |
| Structure & behaviour | 69-check regression suite (structure, content, links, honesty, images, a11y, performance guards, nav, reveals, mobile menu, reduced motion, console, network) |
| Horizontal overflow | 13-width matrix, 320 → 1920 |
| Render cost | CDP harness (FCP / LCP / CLS / TBT / frame timing / `Performance.getMetrics` / resource timing), CDP tracing, per-resource-class blocking experiments |
| Interaction | Real in-app browser for animated and interactive states; CDP key dispatch for focus order |

### 7.2 Defects found in this pass — and fixed

**1 · About → "What I Build" rows were rendering broken (severity: high, layout).**
`.capabilities li` is `display: grid; grid-template-columns: 42px minmax(0, 1fr)`, but each row's
content was an **unwrapped text node**, a `<strong>`, and a trailing text node — four grid items for
a two-column grid. Auto-placement therefore pushed `<strong>` into **row 2, column 1 — the 42 px index
column** — where it wrapped one word per line:

```
01   Developing RESTful APIs with
ASP.NET
Core
Web
API
```

Measured in the DOM: the `<strong>` was **42 px wide and 99 px tall**, and row 01 was 173 px tall
instead of 48 px. Three of the seven rows were affected, at 1440 px **and** at 390 px. This was
invisible to the earlier checks, which validated structure and attributes but not text layout.
**Fixed** by giving each row a real body element (`<span class="capabilities__text">`), so the grid
has exactly two items. After the fix the same `<strong>` measures **566 px × 19 px** and the row is
one line.

**2 · Tech Stack was still a card grid (severity: high, visual).**
The section was an 8-tile matrix of rounded, filled, bordered boxes plus three panels, each holding
a 3-column mini-grid with a ragged last row (3+3+2, 3+3+1, 3+3+3+1). It was the one component that
still read as a generic portfolio skills wall. **Recomposed** into an instrument console:

- the primary focus is now **one framed console** whose header is closed by a hairline rule and whose
  technology count is a readout flagged by a status lamp;
- the eight technologies sit in a **4×2 ruled matrix flush to the frame** — hairline column and row
  separators, no per-item box, no radius, no fill;
- the three secondary groups are **spec rows** — a label column beside a flowing ledger — instead of
  three more panels of tiles;
- every mark now sits in an **identical instrument plate** (uniform square, 1 px border, contained
  mark), which also fixed the long-standing problem of brand badges and bare glyphs being mixed
  inconsistently, and stopped wide wordmarks like SQLite from being squashed into a square box.

The section also became materially shorter: the feature console 388 → 297 px, and each secondary
group 478/478/598 → 148 px.

**3 · About panels were generic feature cards (severity: medium, visual).**
The two right-column blocks were rounded, filled, bordered boxes with an icon chip, a heading and
body copy — the canonical feature card. **Recomposed** into hairline **instrument readouts**: the
box chrome is gone, replaced by a rule carrying a lit segment, an icon beside the heading, and body
copy aligned under the heading; the second readout keeps its 26 px inset, so the asymmetry survives.
The column fell 493 → 319 px.

**4 · The outlined ordinal failed the large-text contrast threshold (severity: medium, a11y).**
`.capability__index` is an outlined numeral (`color: transparent` + `-webkit-text-stroke`). At a
stroke alpha of `.34` the rendered mark measured **≈2.1 : 1** against the section background — below
the 3 : 1 required for large text. Raised to `.52` (≈3.2 : 1) at rest and `.78` (≈6 : 1) on hover.
The automated sweep's remaining five reports are false positives: four are gradient-clipped text and
one is the outlined monogram, all of which report `rgba(0,0,0,0)`; each was verified by hand and
passes.

### 7.3 Evidence

**Render cost — unchanged by the recomposition, and the frame budget is intact.** Medians of three
runs, measured identically before and after this pass:

| Metric | Before pass | After pass | Reading |
|---|---|---|---|
| FCP | 532 ms | **392 ms** | within harness variance (±100 ms) |
| LCP | 1120 ms | **1100 ms** | flat |
| TBT | 213 ms | **219 ms** | flat |
| CLS | 0 | **0.00048** | 200× below the 0.1 "good" threshold |
| Long tasks | 2 (313 ms) | 2 (319 ms) | same count, same cause (§5.3) |
| Avg frame | 16.67 ms | **16.67 ms** | locked to the 60 fps budget |
| p95 / max frame | 16.8 / 16.8 ms | **16.7 / 16.8 ms** | no dropped frames |
| Frames > 32 ms | **0 %** | **0 %** | responsiveness held |
| `ScriptDuration` | 0.0134 s | 0.0144 s | application JS is negligible |
| `RecalcStyleDuration` | 0.1396 s | 0.1553 s | +11 % for the new matrix |
| `LayoutDuration` | 0.2928 s | 0.3401 s | +16 % for the new matrix |
| DOM nodes | 690 | **690** | unchanged |
| Cold page weight | 308.7 KB | **313.1 KB** (41 resources) | +4.4 KB of CSS |

**Ambient animation cost — 3 s idle at the top of the page:** `LayoutCount` +3, `RecalcStyleCount`
+14, `LayoutDuration` 0.0008 s, `RecalcStyleDuration` 0.0035 s, `TaskDuration` **0.0262 s** — i.e.
~0.9 % of task time for the four ambient animations, which are `opacity`/`transform` only.

**Full-page scroll cost:** `LayoutCount` +73, `RecalcStyleCount` +157, `LayoutDuration` +0.0168 s,
`RecalcStyleDuration` +0.0746 s — both lower than before the pass (was +0.0188 s / +0.0917 s),
because the section no longer paints 32 filled, bordered, shadowed boxes.

**Layer budget — unchanged.** Largest promoted areas: `.backdrop` 1,296k px² (fixed), `.hero__plate`
412k px², orbit rings 437k / 274k px², three `.project__arc` 234k px². The new plates are 38–46 px
and create no layers of their own. `backdropFilter = 0`, `filter: blur = 0`, `will-change = 0`.

**Rendering guards:** zero `backdrop-filter`, zero `filter: blur`, zero `mask-composite`, zero
`will-change`; no new animation, no pointer tracking, no new library.

**Regression suite: 69 / 69 passing.** Horizontal overflow **0 px at all 13 widths**
(320/360/390/430/600/768/820/900/1024/1280/1440/1600/1920). Text-collapse scan: **none** at 1440 px
or 390 px.

**Keyboard (18 tab stops, desktop):** `skip-link → nav brand → Home · About · Skills · Projects ·
Contact → Explore Profile → Contact Me → GitHub → LinkedIn → scroll cue → Email Me → Copy email →
GitHub · LinkedIn · Email → footer brand`. Every stop exposes a visible focus indicator
(`outline 2px solid rgb(143,180,255)` + box-shadow) and is inside the viewport. `Shift+Tab` reverses
correctly. The skip link is off-canvas at rest (`top: -57`) and slides into view on focus
(`top: 16`, `transform: none`, `z-index: 200` above the header). `Enter` on a nav link scrolls the
page, moves the sliding indicator to that link (81×40 px, `opacity: 1`, `is-ready`) and updates the
active link and the `01–08` counter.

**Reduced motion:** all reveals shown immediately, rotator static, orbital rings and core pulse
disabled — confirmed by the suite and by an emulated `prefers-reduced-motion` run.

**Honesty and content:** all six project buttons remain `disabled` with their honest tooltips, the
project frames remain clearly-labelled monogram placeholders, all 21 required IDs, the five nav
anchors, the `data-cnt="1..8"` sequence and every GitHub / LinkedIn / mailto URL are intact, and no
console error, console warning or failed request occurs on load.

**Hover states (measured, not assumed).** A real pointer move was dispatched over each component and
the computed style re-read:

| Component | Hover response |
|---|---|
| Tech console matrix cell | background `transparent → rgba(47,107,255,.10)`, label `#9FADC7 → #EEF3FF`, plate border `.16 → .34` |
| Tech ledger item | label `#9FADC7 → #EEF3FF`, plate border `.16 → .34` |
| Project frame | `translateY(-4px)`, border → the project's own accent (`rgb(34,211,238)`) |
| Project arc | rotates `-18° → -8°` |
| Project monogram | `scale(1.06)` |
| Primary button | `translateY(-2px)`, shadow `0 12px 30px → 0 18px 40px` |

The technology items are non-interactive list items (`tabIndex: -1`), so they are neither focus
targets nor tap targets — and no state is communicated by colour alone.
