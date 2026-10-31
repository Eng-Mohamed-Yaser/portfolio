# ORBIT — Mohamed Yasser · Personal Website

A single-page personal portfolio built to the **ORBIT — A Personal Digital Space** design
specification: a calm, space-inspired dark theme with restrained glass surfaces and a
blue-on-navy accent system. No frameworks, no build step — plain HTML, CSS and vanilla JS.

Content is taken from the GitHub profile README and the project brief.

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
├── index.html                 ← all content lives here
├── assets/
│   ├── css/style.css          ← design tokens + all styling
│   ├── js/main.js             ← nav, menu, reveal, counter, role rotator
│   └── img/
│       ├── portrait.jpg       ← your hero portrait (900×1125, 4:5)
│       ├── portrait.webp      ← lighter alternative
│       ├── logo-mark.png      ← monogram on transparent (nav + footer)
│       ├── logo-full.png      ← full lockup (mark + wordmark + tagline)
│       ├── favicon.png        ← browser tab icon
│       ├── apple-touch-icon.png
│       ├── og-cover.jpg       ← social preview (1200×630)
│       └── stars.svg          ← the star layer of the background
└── README.md
```

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
| Portrait image | Hero → `<img src="assets/img/portrait.jpg">` — replace the file, keep the name |
| Hero profile links | Hero → `.hero__socials` list |
| Skill categories | `#skills` → 5 `.skill-card` blocks (5th is `.skill-card--wide`) |
| Tech stack icons | `#stack` → 4 `.stack-cat` blocks, 33 `.stack-cat__item` tiles |
| Projects | `#projects` → 3 `.project-card` blocks |
| Project links | `#projects` → `.project-action` buttons (see below) |
| Engineering practices | `#practices` → 4 `.practice` blocks |
| Contact links & email | `#contact` → `mailto:` and `data-copy` |
| Footer links | `#site-footer` → `.footer__links` lists |
| Page title / description | `<head>` |

### ⚠️ Project links are placeholders

The three real projects — **CityPulse**, **StudentApi** and **DVLD System** — are
described with their real categories, descriptions and stacks. Their *demo and repository
links* are not published yet, so both actions on each card are disabled buttons and the
card states this in plain text:

```html
<button class="project-action project-action--primary" type="button" disabled title="Live demo not published yet">View Project</button>
<button class="project-action" type="button" disabled title="Repository link not published yet">Source Code</button>
```

To publish a project, replace the button with a real link:

```html
<a class="project-action project-action--primary" href="https://github.com/Eng-Mohamed-Yaser/<repo>" target="_blank" rel="noopener noreferrer">View Project</a>
```

and delete that card's `.project-card__note` line. The same applies to the card preview:
it is a designed placeholder labelled *"Preview placeholder"*, **not** an application
screenshot. Replace the `.project-card__preview` block with a real
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

If any remote icon fails, `main.js` hides the image and keeps the label underneath,
so the grid never shows a broken-image glyph.

---

## Design tokens

All values live at the top of `assets/css/style.css` under `:root`.

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#070D1B` | page background |
| `--bg-secondary` | `#0B1428` | gradient mid-tone |
| `--surface-card` | `#111E36` | cards |
| `--surface-elev` | `#172744` | elevated surfaces |
| `--accent-blue` | `#2563EB` | primary actions, highlights |
| `--accent-soft` | `#A9C8FF` | roles, labels, icons |
| `--accent-ice` | `#DCE8FF` | high-contrast text |
| `--accent-lav` | `#A78BFA` | sparing accent only |
| `--text-primary` | `#F8FAFC` | headings |
| `--text-secondary` | `#A6B2C7` | body |
| `--text-muted` | `#73819A` | meta, labels |

Glass levels are limited to three: `--glass-light` (navbar), `--glass-medium` (cards),
`--glass-subtle` (small tags). Radii, padding, borders, blur and shadows are standardised
through dedicated tokens so every surface matches:

| Token | Value | Use |
|---|---|---|
| `--radius-sm` / `--radius-md` | 10px / 14px | chips, small surfaces |
| `--radius-card` / `--radius-lg` | 20px / 24px | cards, contact panel |
| `--radius-btn` | 12px | buttons and action chips |
| `--pad-card` / `--pad-card-sm` | 24px / 18px | card padding |
| `--border-soft` / `--border-lit` | 7% / 24% white-blue | resting / hover borders |
| `--blur-light` / `--blur-medium` / `--blur-subtle` | 20 / 14 / 8px | glass blur levels |
| `--shadow-card` / `--shadow-elev` | one intensity each | card and raised-surface elevation |

Spacing follows the spec: 1160px container, 72–120px section rhythm, 250–320ms
transitions, 3–4px hover lift.

### Motion & depth tokens

A follow-up enhancement pass added a second token group for gradients, glows and motion. These
sit alongside the originals — nothing above was replaced.

| Token | Value | Use |
|---|---|---|
| `--accent-violet` | `#8174D8` | soft violet accent |
| `--grad-blue` / `--grad-blue-violet` | blue gradients | buttons, borders, headings |
| `--grad-text` / `--grad-border` | blue→ice / blue→violet | gradient text, gradient rings |
| `--glow-blue` / `--glow-violet` | soft shadows | card hover glow |
| `--shadow-lift` / `--shadow-nav` | deep elevation | hovered cards, navbar |
| `--t-micro` / `--t-card` / `--t-reveal` | 180 / 380 / 640ms | motion timing scale |
| `--ease-out` | `cubic-bezier(.22,.72,.24,1)` | entrances and exits |
| `--z-backdrop` / `--z-header` / `--z-progress` / `--z-skip` | −1 / 60 / 120 / 200 | stacking order |

Cards use three local variables — `--ty`, `--rx`, `--ry` — that feed the `transform`, so hover
depth and pointer tilt stay in CSS. The reveal animation deliberately uses the independent
`translate` property rather than `transform`, which keeps `transform` free for the card system.

See `ORBIT-ENHANCEMENT-REPORT.md` for the full motion report and validation results.

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

---

## Accessibility & performance notes

- Semantic landmarks (`header` / `nav` / `main` / `section` / `footer`), one `h1`, skip link.
- Visible `:focus-visible` rings on every interactive element.
- The active nav item is marked by **colour + a dot**, never colour alone.
- Key engineering concepts (OOP, SOLID, Design Patterns) carry a chip **and** a brighter
  marker — never colour alone.
- `prefers-reduced-motion: reduce` disables all animation, stops the role rotator and
  reveals content immediately.
- The role rotator uses `nowrap` plus a reserved line height, so swapping the phrase
  never shifts the layout.
- No background animation loops — the nebula is static, the parallax is scroll-linked only.
- All imagery has descriptive `alt` text; decorative SVG icons are `aria-hidden`.
- Fonts are preconnected; icons are lazy-loaded and the hero image is `fetchpriority="high"`.

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
