# Selvakumar Manoharan — Portfolio

A personal portfolio for an AI/ML Engineer and Data Scientist. Dark-only
"digital observatory" visual language: layered deep space, cyan as the signal
colour, restrained violet, editorial typography.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4 and Motion.
Every route is statically prerendered.

---

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

---

## The one rule: content lives in `src/content/`, never in JSX

To update the site you almost never touch a component. Everything a recruiter
reads comes from a typed data module:

| File | What it holds |
| --- | --- |
| `src/content/site.ts` | Name, email, LinkedIn, resume path, navigation |
| `src/content/identity.ts` | Hero copy, Mission Control panels, About narrative, contact copy |
| `src/content/projects.ts` | The four case studies, in the order they appear on `/work` |
| `src/content/experience.ts` | Roles, education, certifications |
| `src/content/skills.ts` | Skill groups |
| `src/content/research.ts` | Research Lab notes |
| `src/content/seo.ts` | Titles, descriptions, keywords, per-page metadata |
| `src/content/types.ts` | The shapes all of the above must satisfy |

`npx tsc --noEmit` will tell you if an edit breaks a shape.

### Adding a case study

Append an object to `projects` in `src/content/projects.ts` matching the
`Project` type. The route `/work/<slug>`, the Work index card, the sitemap
entry and the prev/next links all follow automatically — no new files.

### Replacing the portrait

Overwrite `public/selva-headshot.jpg`. A square-ish crop framed on the face works best;
the image is displayed in a circle on Home and an arch on About. If you swap it
while a dev server is running, change the filename too (and the `src` default in
`components/visual/Portrait.tsx`) — browsers cache `/_next/image` responses
aggressively and will otherwise keep serving the previous photo. If the file is
missing the layout stays intact and falls back to a monogram.

### Replacing the resume

Overwrite `public/Selvakumar_Manoharan_Resume.pdf`, then update
`site.resumeUpdated` in `src/content/site.ts`.

---

## Design system

All design tokens live in the `@theme` block at the top of
`src/app/globals.css` — colours, the fluid type scale, easing curves and the
layout rhythm. **Never hard-code a colour or a font size in a component.** Use
the tokens (`text-ink-2`, `bg-surface/90`, `border-line`,
`text-[length:var(--text-fluid-lg)]`) and the `.mono-label` / `.mono-meta`
utilities. Monospace is for labels, dates, tags and small metrics only — never
body copy.

Shared building blocks:

- `components/shell/` — `Nav`, `Footer`, `PageHeader`
- `components/ui/` — `CTA`, `ArrowGlyph`, `SectionLabel`, `Tag`,
  `OwnershipBadge`, `Reveal` / `RevealGroup` / `RevealItem`
- `components/visual/` — `StarField`, `Constellation`, `Portrait`,
  `PipelineFlow`, `ArchitectureDiagram`, `Backdrop`
- `components/sections/` — `Hero`, `MissionControl`, `ProjectRow`, `ClosingCTA`

---

## Motion and accessibility

`prefers-reduced-motion` is honoured throughout: `globals.css` neutralises every
animation and transition, the star field renders a single static frame instead
of starting its loop, the constellation stops tracking the pointer, and the
hero's "Explore My Work" handoff navigates immediately rather than playing its
transition.

Scroll reveals start at `opacity: 0` and are animated in by JavaScript, so a
`<noscript>` rule in `src/app/layout.tsx` forces anything marked `[data-reveal]`
visible — the content is readable even with scripting off.

The star field is a single canvas rather than DOM nodes. It halves its density
on small screens, suspends on `visibilitychange`, and stops entirely via an
`IntersectionObserver` once scrolled past.

---

## Confidentiality

Work done at Xylium Global Services and CloudHalo Technology Services is
company-owned. Every such case study carries an ownership badge and a
confidentiality note, and describes architecture only at a conceptual level —
no source, internal endpoints, threshold values, feature specifications or
business rules.

Keep it that way when adding content, and keep every factual claim traceable to
the resume.

---

## Deploying

Push to GitHub and import the repository into Vercel — the defaults are
correct, no configuration needed. After attaching a custom domain, set `url` in
`src/content/site.ts` to the final origin so canonical URLs, the sitemap and the
Open Graph image resolve correctly.
