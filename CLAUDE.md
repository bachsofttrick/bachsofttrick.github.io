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
- Blog filtering: category/year/month dropdowns or full-text search via FlexSearch (client-side, indexes title + content)

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
├── blog/
│   ├── posts/                 # Blog post markdown by category/year
│   │   ├── Cooking/25/
│   │   ├── Tech/23/, /24/, /25/, /26/
│   │   ├── Life/
│   │   ├── Photography/
│   │   └── Film/
│   ├── [category]/[slug]/page.tsx   # Dynamic route for individual posts
│   ├── page.tsx               # Blog index with filters
│   └── utils.ts               # Core markdown parsing & post indexing logic
├── components/
│   ├── nav.tsx                # Navbar with music player (client component)
│   ├── footer.tsx             # Footer with contact links
│   ├── posts.tsx              # BlogPosts component: filters, pagination, listings (client)
│   ├── mdx.tsx                # MDX renderer: custom Link, YoutubeEmbed, Gallery, Carousel, Code highlighting
│   ├── ImageCarousel.tsx      # Image carousel with lightbox: slide navigation, dot pagination (client)
│   └── extra.tsx              # Quote component
├── styles/
│   ├── global.css             # Tailwind imports + typography, code, anchor link styles
│   ├── mdx.css                # MDX prose styles
│   ├── animations.css         # Fade-in and slide animations for carousel
│   └── carousel.css           # Carousel and lightbox component styles
├── about/
│   ├── resume.md              # Resume markdown (WORK EXPERIENCE, SKILLS, OTHER WORK)
│   └── page.tsx               # About page (home page alias)
├── projects/
│   ├── projects.md            # Projects showcase (AI, Go, Node.js, Python sections)
│   └── page.tsx               # Projects page rendering projects.md
├── page.tsx                   # Home page
├── layout.tsx                 # Root layout
├── sitemap.ts                 # Sitemap generator
├── robots.ts                  # robots.txt generator
├── not-found.tsx              # 404 page
└── rss.xml/route.ts           # RSS feed (if implemented)

public/
├── images/
│   ├── about/
│   ├── blog/[category]/[year]/[slug]/  # Blog post images co-located by post slug
│   ├── projects/              # Project showcase images
│   └── music/                 # Audio files
└── google*.html, BingSiteAuth.xml  # SEO verification files

tools/
├── new-post.mjs               # CLI to scaffold new blog posts (creates folder/year structure)
├── resize-image.mjs           # CLI to batch resize images (720px height)
└── template.md                # Markdown template for new posts

config.json                     # Centralized config: contact info, blog settings, tool options
package.json                    # Scripts: dev, build, deploy (gh-pages), image resize, new post
tsconfig.json                   # Strict mode disabled, baseUrl ".", @/* alias
next.config.js                  # output: 'export' for static build, webpack fallback for fs
postcss.config.js              # Tailwind CSS plugin
app/declarations.d.ts          # TypeScript declarations: CSS module type declaration
```

## Key Dependencies & Versions

- **Framework**: `next@^14.2.8` (App Router, static export)
- **UI Rendering**: `react@18.2.0`, `react-dom@18.2.0`
- **Content**: `next-mdx-remote@^4.4.1` (render markdown+JSX server-side)
- **Styling**: `tailwindcss@4.0.0-alpha.13`, `@tailwindcss/postcss@4.0.0-alpha.13`, `postcss@^8.4.35`
- **Code Highlighting**: `sugar-high@^0.6.0` (lightweight syntax highlighter)
- **Fonts**: `geist@1.2.2` (Geist Sans & Geist Mono)
- **Image Processing**: `sharp@^0.34.5` (CLI tool for resizing)
- **Search**: `flexsearch@^0.8.212` (full-text search indexing title + content for blog posts)
- **UI Components**: `@mui/material@^6.0.2`, `@emotion/react@^11.13.3`, `@emotion/styled@^11.13.0` (used for Pagination, Select dropdowns, and TextField in blog)
- **Deployment**: `gh-pages@^6.3.0` (GitHub Pages deployment)
- **Analytics**: `@next/third-parties@^16.0.0` (Google Analytics)
- **Build**: TypeScript `5.3.3`

## Conventions

**Pages & Components**:
- Pages use `export default function Page()`, server components by default
- Reusable components use named exports: `export function Navbar()`
- Client components marked with `"use client"` at top (nav.tsx, posts.tsx)

**Metadata**:
- Each page exports `metadata` object with title, description, openGraph (SEO)
- Blog posts auto-generate metadata in `generateMetadata` from frontmatter + content slice
- Base URL defined in `app/sitemap.ts` and imported across pages

**Markdown Frontmatter**:
```yaml
---
title: Post Title
publishedAt: YYYY-MM-DD
order: 1
hidden: false
---
```

**Imports**:
- Mix of `app/...` and `@/app/...` (baseUrl is `.` so both work)
- Config loaded with `import config from '@/config.json' with { type: 'json' }`

**Styling**:
- Tailwind utility classes throughout (no component library except MUI for Pagination)
- Prose typography in global.css for markdown rendering
- No CSS modules; all styling is inline classNames or global styles
- Styles organized by scope: global.css (root), mdx.css (content rendering), animations.css (reusable animation keyframes), carousel.css (ImageCarousel component)
- CSS imported directly in component files (e.g., ImageCarousel imports animations.css and carousel.css)

**Data Flow for Blog Posts**:
1. Markdown files at `app/blog/posts/[category]/[year]/[slug].md`
2. `app/blog/utils.ts` recursively reads all posts, parses frontmatter
3. Pages call `getSortedBlogPosts()`, `getBlogPosts()`, etc., pass post array to `<BlogPosts />`
4. `<BlogPosts />` builds FlexSearch index over title + content (computed once via `useMemo`)
5. User enters search query or selects category/year/month filters
6. If search is active: FlexSearch overrides filters, returns matching posts; filters hide
7. If search is empty: normal filter cascade (category → year → month) applies
8. Component renders filtered posts with pagination (if enabled); displays post count
9. Dynamic route uses `generateStaticParams` to pre-render all combinations at build time

**Content Organization**:
- Blog posts co-located: markdown + images share the slug path
- Projects/resume are single markdown files, not per-category
- Public images mirror post structure: `public/images/blog/[category]/[year]/[slug]/`

## Build & Deployment

**Development**:
```bash
pnpm install
pnpm run dev        # Runs on http://localhost:3000
```

**Build**:
```bash
pnpm run build      # Outputs to `build/` (static HTML)
```

**Deployment**:
```bash
pnpm run predeploy  # Runs build before deploy
pnpm run deploy     # Pushes build/ to gh-pages branch (GitHub Pages)
```

**Tools**:
```bash
pnpm run newpost <category> <title>  # Scaffolds new post with YYMMDD.md in [category]/[year]/
pnpm run image                       # Resizes images in ./temp/ to 720px height, outputs to ./temp/
```

## Gotchas & Non-Obvious Logic

**Route Structure**:
- Home page (`app/page.tsx`) loads **all recent blog posts** via `getSortedBlogPosts()` and reuses `BlogPosts` component with `itemPerPage={3}`.
- Blog index page (`app/blog/page.tsx`) loads all posts with **full filtering and pagination**.
- No nested routes for categories — all categories are flat under `/blog/[category]/[slug]`.

**Config-Driven Values**:
- `config.json` drives contact info (displayed in footer), highlighted posts list (home page), personal summary, and tool behaviors.
- Changes to `config.json` require a rebuild (Next.js loads it at build time via import).

**SEO & Static Generation**:
- All routes pre-rendered as static HTML at build time.
- `robots.txt` and `sitemap.xml` auto-generated from blog posts.
- OpenGraph metadata set globally in root layout and overridden per-page/post.
- Google Analytics attached via `@next/third-parties`.

## Module Detail Docs

- [Blog Content & Rendering](docs/blog.md) — Post indexing, markdown parsing, MDX rendering, gallery components
- [Components & UI](docs/components.md) — Navbar, Footer, BlogPosts filtering/pagination, MDX renderer
- [Tooling & Build](docs/tooling.md) — New post scaffolding, image resizing, deployment pipeline
