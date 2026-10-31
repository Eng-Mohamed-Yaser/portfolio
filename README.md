# ORBIT — Mohamed Yasser · Personal Website

A single-page personal portfolio built to the **ORBIT — Cinematic Futuristic Transformation**
specification: a deep-space observatory where the hero is the focal body and each section is a
distinct orbital zone. No frameworks, no build step — plain HTML, CSS and vanilla JS.

Content is taken from the GitHub profile README and the project brief.

> **Full transformation + performance report:** [`ORBIT-CINEMATIC-REPORT.md`](ORBIT-CINEMATIC-REPORT.md)
> Previous rounds: [`ORBIT-ENHANCEMENT-REPORT.md`](ORBIT-ENHANCEMENT-REPORT.md) · [`REFACTOR-REPORT.md`](REFACTOR-REPORT.md)

---

## Run it locally

```bash
# any static server works
python -m http.server 8000
# then open http://127.0.0.1:8000
```

Opening `index.html` directly from disk also works (the only difference is that browsers
block some `fetch`-based features on `file://`, which this site does not use).

---

## Project structure

```
Mohamed_Yasser/
├── index.html                   ← all content lives here (879 lines)
├── assets/
│   ├── css/
│   │   ├── style.css            ← design tokens + all styling (1,772 lines)
│   │   └── fonts.css            ← @font-face for the self-hosted variable fonts
│   ├── fonts/
│   │   ├── manrope-latin-var.woff2        ← display face  (weights 500–800)
│   │   ├── inter-latin-var.woff2          ← body face    (weights 400–600)
│   │   └── jetbrains-mono-latin-var.woff2 ← data face    (weights 400–500)
│   ├── js/main.js               ← nav, menu, reveal, counter, role rotator
│   └── img/
│       ├── portrait.jpg         ← your hero portrait (900×1125, 4:5)
│       ├── portrait.webp        ← what the page actually loads (44 KB vs 104 KB)
│       ├── logo-mark.png        ← monogram on transparent (nav + footer) — source artwork
│       ├── logo-mark-small.webp ← what the page actually loads (132×81)
│       ├── logo-mark-small.png  ← PNG fallback for the logo
│       ├── logo-full.png        ← full lockup (mark + wordmark + tagline)
│       ├── favicon.png          ← browser tab icon — source artwork
│       ├── favicon-64.png       ← what the page actually loads
│       ├── apple-touch-icon.png ← source artwork
│       ├── apple-touch-icon-180.png
│       ├── og-cover.jpg         ← social preview (1200×630)
│       ├── stars.svg            ← star layer of the background
│       └── constellation.svg    ← constellation layer of the background
└── README.md
```

### Fonts are self-hosted

The three families are the same ones the site always used — **Manrope** (display), **Inter**
(body) and **JetBrains Mono** (data) — but they are served from `assets/fonts/` instead of a
render-blocking third-party stylesheet. All three are *variable* fonts, so one latin file covers
every weight in use (nine static instances became three files, 102 KB total).

`font-display: swap` is set, and the `unicode-range` is byte-identical to the subset Google served,
so glyph coverage and fallback behaviour are unchanged.

They are deliberately **not** preloaded: preloading raised the font above the hero portrait and
pushed median LCP from 492 ms to 1100 ms. No preloading is the measured-better choice.

### Image derivatives

`logo-mark-small.*`, `favicon-64.png` and `apple-touch-icon-180.png` are static derivatives of the
originals. The originals are kept untouched as sources and fallbacks. **If you replace the source
artwork, regenerate the derivatives** — each reference in `index.html` carries an `✏️ EDIT` note.

---

## Your live details (already filled in)

| What | Value |
|---|---|
| GitHub | https://github.com/Eng-Mohamed-Yaser |
| LinkedIn | https://www.linkedin.com/in/mohamed-yasser-1160b7308 |
| Email | eng.mo7amed.yaser@gmail.com |
| Role | Software Engineer · .NET and Node.js · Full-Stack Development |
| Tagline | Building reliable software through thoughtful engineering, clean code, and continuous learning. |

They appear in the hero, the contact panel, the footer, the page title, the meta
description and the JSON-LD `Person` schema.

---

## Editing content

Every editable value in `index.html` is marked with an `✏️ EDIT` comment.
Search for `EDIT` in the file to jump between them.

| What | Where |
|---|---|
| Portrait image | Hero → `<picture>` in `.hero__figure` — replace `portrait.jpg` / `portrait.webp`, keep the names |
| Hero profile links | Hero → `.hero__socials` list |
| Hero signal strip | Hero → `.hero__signal` (`Focus` / `Stack` / `Status`) |
| Skill categories | `#skills` → 5 `.capability` blocks |
| Tech stack groups | `#stack` → 4 `.tech-group` blocks (`.tech-group--feature` console + 3 `.tech-group--compact` spec rows) |
| Tech stack items | `#stack` → 33 `.tech-tile` items |
| Projects | `#projects` → 3 `.project` blocks |
| Project preview frame | `#projects` → `.project__frame` (currently a monogram placeholder) |
| Project links | `#projects` → `.project-action` buttons (see below) |
| Engineering practices | `#practices` → 4 `.practice-node` blocks |
| Contact links & email | `#contact` → `mailto:` and `data-copy` |
| Footer links | `#site-footer` → `.footer__links` lists |
| Page title / description | `<head>` |

### ⚠️ Project links are placeholders

The three real projects — **CityPulse**, **StudentApi** and **DVLD System** — are
described with their real categories, descriptions and stacks. Their *demo and repository
links* are not published yet, so both actions on each project are disabled buttons and the
project states this in plain text:

```html
<button class="project-action project-action--primary" type="button" disabled title="Live demo not published yet">View Project</button>
<button class="project-action" type="button" disabled title="Repository link not published yet">Source Code</button>
```

To publish a project, replace the button with a real link:

```html
<a class="project-action project-action--primary" href="https://github.com/Eng-Mohamed-Yaser/<repo>" target="_blank" rel="noopener noreferrer">View Project</a>
```

and delete that project's `.project__note` line. The same applies to the preview frame:
it is a designed placeholder — an **outlined monogram** tagged *"Preview placeholder"* —
**not** an application screenshot. Replace the `.project__frame` block with a real
`<img src="assets/img/…" alt="…">` once you have one.

---

## Tech icons

Icons come from free public CDNs, referenced directly in the markup:

| Source | Used for |
|---|---|
| [Simple Icons](https://simpleicons.org) | TypeScript, React, Tailwind, .NET, OpenAPI, Express, PostgreSQL, Git, GitHub, GitHub Actions, Docker, Postman, Linux |
| [Devicon](https://devicon.dev) | HTML5, CSS3, JavaScript, Angular, Bootstrap, Node.js, MongoDB, SQL Server, ADO.NET, C#, Visual Studio, PowerShell |
| [skillicons.dev](https://skillicons.dev) | ASP.NET Core, VS Code |
| [thesvg](https://github.com/glincker/thesvg) | EF Core, SQLite |
| jwt.io / NuGet | JWT, NUnit |

**SignalR** and **T-SQL** have no icon on those CDNs (skillicons returns an empty SVG for
both), so they are hand-drawn inline SVGs in the markup — search `SignalR` / `T-SQL` in
`index.html`. Every other tile is an official technology logo.

All 32 icons are `loading="lazy"` and carry explicit `width` / `height`, so no item shifts when
its mark arrives. Every mark is framed in the same instrument plate, so a square brand badge and a
bare glyph read as one system; a few wordmarks carry a wider plate (`.tech-tile__icon--wordmark`)
and one that is a wordmark inside a square canvas carries `.tech-tile__icon--fill`. If any remote
icon fails, `main.js` hides the image and drops a neutral placeholder glyph in its place, so the
console never shows a broken-image glyph.

---

## Design tokens

All values live at the top of `assets/css/style.css` under `:root`.

| Token | Value | Use |
|---|---|---|
| `--bg-void` | `#04070F` | page background |
| `--bg-deep` / `--bg-navy` | `#070C18` / `#0A1120` | gradient mid-tones |
| `--surface-1` / `-2` / `-3` | `#0E1628` → `#1B2A47` | panel surfaces |
| `--blue-core` / `--blue` / `--blue-soft` | `#2F6BFF` → `#8FB4FF` | primary actions, highlights, labels |
| `--violet` / `--violet-soft` | `#7C5CFF` / `#A78BFA` | secondary accent |
| `--ice` | `#E9F1FF` | high-contrast text |
| `--text-1` / `--text-2` / `--text-3` | `#EEF3FF` / `#9FADC7` / `#7D8CAA` | headings / body / meta |
| `--line` / `--line-soft` / `--line-lit` | white-blue at 12 % / 7 % / 30 % | resting / faint / hover borders |
| `--radius-s` … `--radius-xl` | 8 / 14 / 22 / 30 px | chips → large frames |
| `--container` / `--gutter` | 1240 px / `clamp(20px, 4vw, 40px)` | layout |

`--text-3` is deliberately `#7D8CAA` rather than something dimmer — it is the *lowest* text colour
in the system and it still clears WCAG AA (5.9:1) on the page background.

### Motion & depth tokens

| Token | Value | Use |
|---|---|---|
| `--t-micro` | 170 ms | hover, focus, colour changes |
| `--t-base` | 260 ms | nav pill, buttons |
| `--t-reveal` | 540 ms | section entrances |
| `--ease` / `--ease-out` | `cubic-bezier(.22,.68,.24,1)` / `(.16,.84,.28,1)` | transitions / entrances |
| `--z-backdrop` / `--z-header` / `--z-counter` / `--z-skip` | −1 / 60 / 50 / 200 | stacking order |

Only **four** `@keyframes` exist in the stylesheet (`core-pulse`, `orbit-spin`, `node-pulse`,
`caret`). Animation is restricted to `transform` and `opacity`; the one exception is the
out-of-flow nav pill, which also animates its own `width`/`height` so it can resize to the
active label.

The reveal animation uses the independent `translate` property rather than `transform`, so a
reveal can never strip a component's own transform transition.

### Rendering budget (deliberate constraints)

| Technique | Count | Why |
|---|---|---|
| `backdrop-filter` | **0** | re-samples its backdrop on every scroll frame |
| `filter: blur()` | **0** | large blurred regions are re-rasterised |
| `mask-composite` | **0** | extra composited layers per gradient ring |
| `will-change` | **0** | no permanently promoted layers |
| Pointer tracking in JS | **none** | no continuous mouse listeners |

Glows are radial-gradient layers; gradient borders are plain translucent borders.

---

## Section map

| # | Section | Anchor | Nav |
|---|---|---|---|
| 01 | Home / hero | `#home` | Home |
| 02 | About me | `#about` | About |
| 03 | Technical skills | `#skills` | Skills |
| 04 | Tech stack | `#stack` | Skills |
| 05 | Engineering practices | `#practices` | Skills |
| 06 | Projects | `#projects` | Projects |
| 07 | Contact | `#contact` | Contact |
| 08 | Footer | `#site-footer` | Contact |

The `01 / 08` counter in the lower-left and the active nav item are both driven by
scroll position (`main.js`). The `NAV_FOR` map in `main.js` routes `#skills`, `#stack` and
`#practices` to the **Skills** nav item, and `#site-footer` to **Contact**.

`main.js` caches the section offsets once and re-measures only on resize and after load, so the
scroll handler never forces a layout read. The load-time re-measure is deferred two animation
frames on purpose — reading rects inside the `load` handler forces a synchronous full-page
reflow (~140 ms) because the webfont swap has already invalidated the layout.

---

## Accessibility & performance notes

- Semantic landmarks (`header` / `nav` / `main` / `section` / `footer`), one `h1`, skip link.
- Visible `:focus-visible` rings on every interactive element.
- The active nav item is marked by **colour + a filled sliding pill**, never colour alone.
- Key engineering concepts (OOP, SOLID, Design Patterns) carry a chip **and** a brighter
  marker — never colour alone.
- Every text colour clears WCAG AA; `--text-3` (the dimmest) still measures 5.9:1.
- Mobile tap targets are ≥ 44 px.
- `prefers-reduced-motion: reduce` disables all animation, stops the role rotator and
  reveals content immediately.
- The role rotator uses `nowrap` plus a reserved line height, so swapping the phrase
  never shifts the layout.
- All imagery has descriptive `alt` text; decorative SVG icons are `aria-hidden`.
- Icons are lazy-loaded, the hero portrait is `fetchpriority="high"`, and every image declares
  explicit `width` / `height` so nothing shifts on load.
- No horizontal overflow between 320 px and 1920 px.
- Zero console errors, zero failed network requests.

---

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Personal website"
git branch -M main
git remote add origin https://github.com/Eng-Mohamed-Yaser/<repo>.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source → Deploy from a branch → `main` / `root`**.
The site is served from `https://<user>.github.io/<repo>/`.
