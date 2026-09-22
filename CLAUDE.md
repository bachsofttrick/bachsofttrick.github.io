# Brian Phan's Portfolio & Blog Site

A Next.js App Router portfolio site built with TypeScript, Tailwind CSS, and MDX. Content (blog posts, projects, resume) is co-located with routes as markdown files. Static site deployed to GitHub Pages.

## Purpose

Showcase Brian Phan's work, projects, and technical writing. The site serves as both a portfolio landing page and a blog platform with filtering/pagination capabilities. Built with a minimalist, content-first philosophy where markdown files drive the majority of the site.

## Architecture Overview

**Next.js App Router** with static export (`output: 'export'`). All routes are server components by default; `"use client"` marks interactive sections.

**Content Model**:
- Blog posts live in `app/blog/posts/[category]/[year]/[slug].md`
- Projects & resume live in `app/about/` and `app/projects/` as markdown files
- Config is externalized in `config.json` at the root

**Build flow**: `next build` → compiled to `build/` (static) → deployed via `gh-pages` to GitHub Pages.

**Key Runtime Behaviors**:
- Blog posts with `hidden: true` metadata are shown only in dev mode
- All routes pre-rendered at build time using `generateStaticParams`
- SEO metadata auto-generated from markdown frontmatter
- Search/filtering is client-side using React state and MUI components

## Key Entry Points

- `app/layout.tsx` — Root layout, sets metadata, loads fonts (Geist), attaches Navbar & Footer
- `app/page.tsx` — Home page: portrait, personal summary, link to projects/GitHub, recent blog list
- `app/blog/page.tsx` — Blog index with category/year/month filters and pagination
- `app/blog/[category]/[slug]/page.tsx` — Individual blog post with dynamic metadata
- `app/projects/page.tsx` — Projects showcase page (renders `app/projects/projects.md`)
- `app/sitemap.ts` — Auto-generated XML sitemap for SEO
- `app/robots.ts` — Auto-generated robots.txt

## Directory Structure

```
app/
├── blog/        # posts/[category]/[year]/[slug].md, index, dynamic route, utils.ts
├── components/  # nav.tsx, footer.tsx, posts.tsx, mdx.tsx, ImageCarousel.tsx, extra.tsx
├── styles/      # global.css, mdx.css, animations.css, carousel.css
├── about/       # resume.md + page.tsx
├── projects/    # projects.md + page.tsx
└── layout.tsx, page.tsx, sitemap.ts, robots.ts, not-found.tsx, rss.xml/route.ts

public/images/   # about/, blog/[category]/[year]/[slug]/, projects/, music/
tools/           # new-post.mjs, resize-image.mjs, gallery-gen.mjs, template.md
config.json      # contact info, blog settings, tool options
```

Per-file responsibilities and category folders live in the module docs below.

## Conventions

**Pages & Components**:
- Pages use `export default function Page()`, server components by default
- Reusable components use named exports: `export function Navbar()`
- Client components marked with `"use client"` at top (nav.tsx, posts.tsx, ImageCarousel.tsx)

**Metadata & Imports**:
- Each page exports `metadata` (title, description, openGraph); blog posts auto-generate in `generateMetadata`
- Base URL defined in `app/sitemap.ts`, imported across pages
- Mix of `app/...` and `@/app/...` (baseUrl `.`); config via `import config from '@/config.json' with { type: 'json' }`

**Styling**:
- Tailwind utility classes throughout (MUI only for Pagination)
- No CSS modules; inline classNames or global styles
- CSS imported directly in component files; styles organized by scope (global, mdx, animations, carousel)

Frontmatter, post data flow, and content organization are documented in blog.md.

## Build & Deployment

```bash
pnpm install
pnpm run dev        # http://localhost:3000
pnpm run build      # Static output to build/
pnpm run predeploy && pnpm run deploy   # Build, then push build/ to gh-pages
pnpm run newpost <category> <title>     # Scaffold a post (see tooling.md)
pnpm run image                          # Resize ./temp/ images to 720px height
node tools/gallery-gen.mjs <category> <date> [-c] [-g]
```

Pipeline, config files, and dependency versions: see tooling.md.

## Gotchas & Non-Obvious Logic

- Home page (`app/page.tsx`) reuses `BlogPosts` with `itemPerPage={3}`; blog index enables full filtering/pagination.
- Categories are flat: `/blog/[category]/[slug]`, no nested routes.
- `config.json` drives contact info, highlighted posts, summary, and tool behavior; changes require a rebuild.
- All routes pre-rendered as static HTML; `robots.txt`/`sitemap.xml` auto-generated from blog posts.
- `hidden: true` posts appear only in dev mode (`checkPostIfHidden`).

## Module Detail Docs

- [Blog Content & Rendering](docs/agent-docs/blog.md) — Post indexing, markdown parsing, MDX rendering, gallery components
- [Components & UI](docs/agent-docs/components.md) — Navbar, Footer, BlogPosts filtering/pagination, MDX renderer
- [Tooling & Build](docs/agent-docs/tooling.md) — New post scaffolding, image resizing, deployment pipeline
