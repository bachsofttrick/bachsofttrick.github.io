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
│   ├── mdx.tsx                # MDX renderer: custom Link, YoutubeEmbed, Gallery, Code highlighting
│   ├── extra.tsx              # Quote component
│   └── mdx.css                # MDX prose styles
├── styles/
│   └── global.css             # Tailwind imports + typography, code, anchor link styles
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
```

## Key Files & Purposes

**Content Infrastructure**:
- `app/blog/utils.ts` — Parses frontmatter from markdown, recursively reads posts by category/year, filters hidden posts, sorts by date & order
- `app/components/mdx.tsx` — Wraps `next-mdx-remote` with custom components (Gallery, YoutubeEmbed, DoubleYtEmbed, Code highlighting via sugar-high)
- `config.json` — Centralized: contactInfo (email, phone, GitHub, LinkedIn), app settings (highlighted posts, personal summary), tool configs (image resize height, new post category shortcuts, max description length)

**Routing & Pages**:
- `app/page.tsx` — Home: loads config and recent blog posts, displays portrait and personal summary
- `app/blog/[category]/[slug]/page.tsx` — Post detail with `generateStaticParams` for all combinations, `generateMetadata` for SEO
- `app/projects/page.tsx` — Renders MDX from `projects.md` with Gallery and YoutubeEmbed components
- `app/about/page.tsx` — Resume page (alias to home currently; resume.md contains WORK EXPERIENCE, SKILLS)

**Components**:
- `app/components/nav.tsx` — Client component with music player toggle (plays `Giornos Theme` audio)
- `app/components/posts.tsx` — Client component with category/year/month dropdowns, pagination (MUI), post summaries
- `app/components/footer.tsx` — Contact info, social links, year copyright

**Styling**:
- `app/styles/global.css` — Tailwind import, code block styling (sugar-high colors), prose typography, anchor link styles for headings

## Key Dependencies & Versions

- **Framework**: `next@^14.2.8` (App Router, static export)
- **UI Rendering**: `react@18.2.0`, `react-dom@18.2.0`
- **Content**: `next-mdx-remote@^4.4.1` (render markdown+JSX server-side)
- **Styling**: `tailwindcss@4.0.0-alpha.13`, `@tailwindcss/postcss@4.0.0-alpha.13`, `postcss@^8.4.35`
- **Code Highlighting**: `sugar-high@^0.6.0` (lightweight syntax highlighter)
- **Fonts**: `geist@1.2.2` (Geist Sans & Geist Mono)
- **Image Processing**: `sharp@^0.34.5` (CLI tool for resizing)
- **UI Components**: `@mui/material@^6.0.2`, `@emotion/react@^11.13.3`, `@emotion/styled@^11.13.0` (used for Pagination in blog)
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

**Data Flow for Blog Posts**:
1. Markdown files at `app/blog/posts/[category]/[year]/[slug].md`
2. `app/blog/utils.ts` recursively reads all posts, parses frontmatter
3. Pages call `getSortedBlogPosts()`, `getBlogPosts()`, etc.
4. Component render loops over posts, builds links to `/blog/[category]/[slug]`
5. Dynamic route uses `generateStaticParams` to pre-render all combinations at build time

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

**Build-Time vs Runtime**:
- `generateStaticParams` runs at build time and pre-renders all blog posts as static HTML. Add new posts and rebuild.
- `hidden: true` metadata only hides posts in production; dev mode shows them.
- Blog filtering and pagination are **client-side only** (React state) — no server-side filtering.

**Route Structure**:
- Home page (`app/page.tsx`) loads **all recent blog posts** via `getSortedBlogPosts()` and reuses `BlogPosts` component with `itemPerPage={3}`.
- Blog index page (`app/blog/page.tsx`) loads all posts with **full filtering and pagination**.
- No nested routes for categories — all categories are flat under `/blog/[category]/[slug]`.

**Music Player**:
- The navbar has a built-in music player (toggle ▷/||) that plays a hardcoded audio file (`/music/Giornos Theme, but only the best part.m4a`).
- Client component with `useRef` and `useState` to manage playback state.

**Image Handling**:
- `sharp` CLI is used for batch resizing; not integrated into the build process.
- Gallery component uses `grid-cols-1 md:grid-cols-X` classes dynamically based on `gridColumns` prop.
- Deprecated `Image` component checks `alt.includes('gallery')` to auto-split comma-separated image sources.

**Post Order & Sorting**:
- Posts sorted by `publishedAt` date descending.
- If two posts share the same date, `order` field breaks ties (higher order comes first).
- Year and month dropdowns dynamically generate based on filtered posts.

**Config-Driven Values**:
- `config.json` drives contact info (displayed in footer), highlighted posts list (home page), personal summary, and tool behaviors.
- Changes to `config.json` require a rebuild (Next.js loads it at build time via import).

**SEO & Static Generation**:
- All routes pre-rendered as static HTML at build time.
- `robots.txt` and `sitemap.xml` auto-generated from blog posts.
- OpenGraph metadata set globally in root layout and overridden per-page/post.
- Google Analytics attached via `@next/third-parties`.

**TypeScript**:
- `strict: false` in tsconfig, but `strictNullChecks: true`.
- No strict null checking globally, but selective null handling in utilities.

**Deployment Edge Case**:
- `gh-pages` library expects `build/` folder and pushes it to `gh-pages` branch.
- Homepage in package.json is `https://bachsofttrick.github.io/`, so app deploys as a root site (not a subpath).

## Module Detail Docs

- [Blog Content & Rendering](docs/blog.md) — Post indexing, markdown parsing, MDX rendering, gallery components
- [Components & UI](docs/components.md) — Navbar, Footer, BlogPosts filtering/pagination, MDX renderer
- [Tooling & Build](docs/tooling.md) — New post scaffolding, image resizing, deployment pipeline
