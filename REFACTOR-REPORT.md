# Professional Portfolio UI/UX Enhancement & Refactoring — Final Report

**Site:** ORBIT — Mohamed Yasser, Personal Portfolio
**Location:** `C:\Users\yasr4\Downloads\Mohamed_Yasser\`
**Approach:** Incremental refactor of the existing codebase. No rebuild, no new frameworks,
no dependency changes. The dark-navy / electric-blue / nebula visual identity is untouched.

---

## 1. Files modified

| File | Before | After | Change |
|---|---|---|---|
| `index.html` | 37,992 B | 45,616 B | Rewritten in place — sections restructured, markup replaced, no file rename |
| `assets/css/style.css` | 31,422 B | 36,457 B | New component rules, standardised tokens, obsolete rules deleted |
| `assets/js/main.js` | 7,788 B | 7,414 B | Nav map, icon-fallback selector, stat-card handler removed |
| `README.md` | 6,888 B | 8,652 B | Updated to the new structure, edit guide and token table |
| `Mohamed_Yasser.zip` | 919,916 B | 921,166 B | Rebuilt from the refactored folder (was a stale pre-refactor copy) |

Unchanged: every file in `assets/img/` (portrait, logo mark, logo full, favicon,
apple-touch-icon, og-cover, stars.svg). The logo, portrait and background concept are
byte-identical.

---

## 2. Sections updated

Section count **09 → 08**. The counter reads `01 / 08`; `data-cnt` now runs 1→8 in document order.

| # | Section | Status |
|---|---|---|
| 01 | Home / hero | **Updated** — GitHub + LinkedIn icon buttons under the CTA row; refined blue key-light on the portrait; rotator locked to one line |
| 02 | About me | **Updated** — removed the repeated closing paragraph, added a `What I Build` subhead so the capability list is introduced properly |
| 03 | Technical skills | **Rebuilt** — 6 logo-pill cards → 5 capability cards |
| 04 | Tech stack | **Rebuilt** — one flat 31-icon grid → 4 glass category cards |
| 05 | Engineering practices | **Updated** — added an icon per card, a lead line, and emphasis on OOP / SOLID / Design Patterns |
| 06 | Projects | **Rebuilt** — 3 generic placeholders → CityPulse, StudentApi, DVLD System |
| 07 | Contact | **Updated** — icon + label social buttons, accessible copy-email feedback |
| 08 | Footer | **Rebuilt** — single row → four areas (Brand / Quick Links / Connect / Copyright) |

### Technical Skills — 5 capability categories
Backend Engineering · Frontend Development · Database Engineering · Software Quality & Engineering ·
Tools & DevOps. Each card is title + one-line description + five `<strong>term</strong> — detail`
capability rows. **No logos are used here at all**, so the section reads as engineering knowledge
rather than a second technology gallery.

### Tech Stack — 4 glass category cards
| Card | Items | Inner grid |
|---|---|---|
| Frontend Development | HTML5, CSS3, JavaScript, TypeScript, React.js, Angular, Bootstrap, Tailwind CSS | 5 cols |
| Backend Development | C#, .NET, ASP.NET Core, Node.js, Express.js, REST APIs, JWT, SignalR | 5 cols |
| Database & Data Access | SQL Server, MongoDB, PostgreSQL, SQLite, EF Core, ADO.NET, T-SQL | 5 cols |
| Tools & Development | Git, GitHub, GitHub Actions, Docker, Postman, VS Code, Visual Studio, PowerShell, Linux, NUnit | 5 cols |

33 tiles total, each with an official logo, a name beneath it, a uniform 28px icon box, a glass
tile background, a restrained blue hover and a 3px lift + scale.

---

## 3. Features removed

| Removed | Reason |
|---|---|
| **GitHub Activity section** (stats, top-langs, streak, 3 badges) | Requested. The upstream `github-readme-stats.vercel.app` was also returning HTTP 503, so the section was degraded as well as redundant |
| Its CSS (`.github__grid`, `.stat-card*`, `.github__badges`) and JS error handler | Dead code after the section was removed |
| The single `project-card__link` "View on GitHub" anchor | All three cards pointed at one generic profile URL — replaced by two explicit, honest actions |
| Dead `.split` grid utility | No markup used it — pre-existing dead code |
| Duplicate About paragraph | About and closing paragraphs said the same thing |

**Nothing else was removed.** Nav, counter, scroll reveal, mobile menu, copy-email, role rotator,
nebula parallax, active-section tracking, focus states, reduced-motion support and every icon
fallback all still work.

---

## 4. UI improvements

**Tech Stack** — 4 glass cards, 2×2 on desktop, each with a category icon, a technology count and a
responsive icon grid (5 cols desktop → 4 small-desktop → 3 tablet → 2 mobile).

**Technical Skills** — 5 capability cards, 2-column desktop, with the fifth spanning the full width
and a split two-column list. Deliberately typographic so it never duplicates the Tech Stack.

**Hero** — added GitHub + LinkedIn icon buttons; the portrait keeps its corner brackets and gains a
softer two-layer blue glow (`::before` only — the photo itself is untouched).

**About** — new `What I Build` subhead; the capability list now reads as an introduced list instead
of a floating one; the closing paragraph was folded in to remove repetition.

**Practices** — each card gained an icon, a lead line, and OOP / SOLID / Design Patterns are
highlighted with a chip **and** a brighter marker, so the emphasis is never colour-only.

**Projects** — category line, title, honest description, stack tags, two actions and a plain-text
note. The preview is a designed gradient + monogram labelled **"Preview placeholder"** with an
`aria-label` saying the screenshot is not yet available — it is not dressed up as a real screenshot.

**Contact** — GitHub / LinkedIn / Email buttons now pair an icon with a text label.

**Footer** — four areas: brand + description, Quick Links, Connect (with icons), Copyright with a
dynamic year.

**Global standardisation** — added tokens for radii (`10/14/20/24px` + `12px` buttons), padding
(`18/24px`), borders, blur levels and two elevation shadows; standardised card padding, icon sizes,
section rhythm and type scale across all sections.

---

## 5. Functionality preserved

- 5-item nav (Home, About, Skills, Projects, Contact) with the active dot indicator
- `01 / 08` section counter driven by scroll position
- Scroll-reveal animations with staggered delays
- Mobile glass menu (open/close, outside-click, Escape, focus return)
- Copy-email with visible `Copied ✓` feedback and an `aria-live` label
- Rotating specialisation line (6 phrases) with a blinking caret, disabled under reduced motion
- Scroll-linked nebula parallax (static background, no loops)
- GitHub profile links retained in **Hero, Contact and Footer**; LinkedIn likewise
- `mailto:` links, JSON-LD `Person` schema, OG meta, favicon, skip link
- `prefers-reduced-motion` support, visible `:focus-visible` rings, semantic landmarks, one `h1`
- Image error fallbacks for every remote icon
- No frameworks, no build step, no new dependencies, no CDN beyond the icon CDNs already in use

---

## 6. Validation results

Automated via headless Chrome over CDP, plus manual verification in the real in-app browser.

| Check | Result |
|---|---|
| Horizontal overflow at 360 / 390 / 414 / 768 / 1024 / 1280 / 1440 / 1920 px | **0 px at every width** |
| Uncaught JS exceptions | **0** |
| Console errors / warnings | **0** (headless and real browser) |
| Failed network requests | **0** |
| Duplicate element IDs | **0** (21 unique IDs) |
| In-page anchor links resolving to an existing ID | **all resolve** |
| Tech stack tiles + declared counts vs. actual | **4 cards / 33 tiles, all counts match** |
| Tech icons loading | **31/31 remote icons load**, 2 inline SVGs |
| Skill cards | 5 cards, 5 capability rows each, **0 logos inside** |
| Projects | 3 real projects, 2 actions each, **all actions disabled — no fabricated URL** |
| Section counter / nav sync for all 8 sections | **all correct** |
| Copy-email | feedback shows `Copied ✓` |
| Mobile menu | opens and closes correctly (real browser) |
| Accessibility | every `<img>` has `alt`, one `h1`, all buttons/links have accessible names, 6 disabled project buttons each carry an explanatory `title`, 4 landmarks present |

**Three real defects were found and fixed during validation:**
1. The copy-email button's inline SVG had no intrinsic size, so it fell back to the 300×150
   replaced-element default and squeezed the label onto two lines. Fixed with an explicit
   `.btn svg { width: 18px; height: 18px; flex: 0 0 auto; }`.
2. The mobile menu's visibility depended on a transition completing. If the transition clock stalls
   (throttled background tab, reduced-power mode) the menu would stay invisible. Fixed to the
   canonical pattern — `visibility` flips instantly on open and only after the fade on close.
3. **Dark band while scrolling down.** The nebula layer (`inset: -12%`) had only ~130px of
   headroom, but the parallax translate grows by 47px per 1000px scrolled (`scrollY × 0.045`).
   Past ~2800px of scroll the layer slid out of the viewport and the bare page background
   (`rgb(7,13,27)`) showed through as a black band, growing to ~184px at the page bottom.
   Fixed by bounding the travel to the available headroom:
   `transform: translate3d(0, clamp(-11.5vh, calc(var(--sy, 0) * 0.045px), 11.5vh), 0)`.
   Measured gap is now **0px at every scroll position** from 0 to the page bottom, with the
   gradient composition left completely unchanged.

**Cache-busting:** `style.css` and `main.js` are now referenced with a `?v=2` query so browsers
never serve a stale local copy of the assets.

Two apparent failures were confirmed to be **harness artifacts, not site bugs**: the headless
transition clock freezing at `currentTime: 0`, and `captureBeyondViewport` returning a stale frame.
Both were verified correct in the real browser.

**Icon sourcing note:** every remote icon URL was HTTP-verified before use. `skillicons.dev`
returns an empty SVG for `signalr`, `tsql`, `sqlserver` and `mssql`, and no CDN carries a
square SQLite mark, so **SignalR and T-SQL use hand-drawn inline SVGs** (the same pattern already
used for SignalR) and **SQLite uses its official wordmark** at a wider size so it stays legible.

---

## 7. Missing information — what is still needed from you

These items could not be sourced and were handled honestly rather than invented:

1. **Project repository URLs.** `https://api.github.com/users/Eng-Mohamed-Yaser` reports
   `public_repos: 0`, and the repos endpoint returns an empty array — **no public repositories
   exist yet.** All six project actions are therefore disabled buttons, and each card says so in
   plain text. Send me the three repo URLs (or publish the repos) and I will wire them up.
2. **Live demo URLs.** Same situation — none exist yet.
3. **Project screenshots.** None were supplied, and fabricating them is not acceptable, so the
   preview area is a labelled placeholder. Drop real screenshots into `assets/img/` and I will
   swap them in.
4. **Project status.** The brief says to include status only when accurate; the actual status of
   each project is unknown, so no status chip was added.
5. **T-SQL and SignalR logos.** If you have brand assets for these, they will replace the inline
   SVGs.
6. **A real email confirmation** — `eng.mo7amed.yaser@gmail.com` is used throughout (hero, contact,
   copy button, footer, JSON-LD). The `mailto:` links and the copy address are all in one place
   (`#contact` → `data-copy` attribute) if it needs changing.

---

## 8. Deployment status

**Not published.** The site was kept local, per your earlier instruction. `Mohamed_Yasser.zip` is a
ready-to-upload archive of the finished build. Say the word and I can publish it to GitHub Pages
or a public URL — it would be publicly visible to anyone with the link, so I will confirm with you
first.
