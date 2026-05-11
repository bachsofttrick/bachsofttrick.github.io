# Blog Content & Rendering

Content management and MDX rendering pipeline for blog posts, projects, and resume.

## Location

```
app/blog/
├── posts/                    # Blog post markdown files
│   ├── [category]/
│   │   ├── [year]/
│   │   │   └── [slug].md    # Individual posts
│   ├── [category]/[slug]/page.tsx
│   ├── page.tsx              # Blog index with filters
│   └── utils.ts              # Post parsing and indexing
app/components/
├── mdx.tsx                   # MDX renderer with custom components
└── mdx.css                   # Prose typography styles
```

## Entry Points

- `app/blog/utils.ts` — All post parsing and indexing logic
- `app/components/mdx.tsx` — MDX rendering and custom component registry
- `app/blog/[category]/[slug]/page.tsx` — Dynamic route handler

## Architecture / Key Components

### Post Parsing (`app/blog/utils.ts`)

**Core Types**:
- `Metadata` — title, publishedAt (YYYY-MM-DD), hidden (boolean), order (number)
- `MDXData` — metadata, slug, category, content (raw markdown string)

**Key Functions**:
- `parseFrontmatter(fileContent)` — Extracts YAML frontmatter (`---...---`) and content
- `getMDXFiles(dir)` — Lists `.md` and `.mdx` files in a directory
- `readMDXFiles(dir, category)` — Reads all markdown files in dir, returns array of MDXData
- `getMDXData(dir, enableCate)` — Recursively reads markdown: if `enableCate=true`, traverses category/year subdirs; if false, reads flat directory
- `getBlogPosts()` — All blog posts (called at build time for `generateStaticParams`)
- `getSortedBlogPosts()` — Filters hidden posts (dev mode exception), sorts by publishedAt descending, then by order descending
- `getAboutPosts()` — Reads `app/about/` (resume.md); single-level, not categorized
- `getProjectPosts()` — Reads `app/projects/` (projects.md); single-level
- `checkPostIfHidden(post)` — Returns `true` if post is not hidden OR running in dev mode
- `formatDate(date, includeRelative)` — Converts ISO date to "Jan 01, 2023" or with relative "Jan 01, 2023 (2mo ago)"
- `getYear(date)`, `getMonth(date)` — Extractors for filtering
- `getUniqueValues(arr)` — Returns deduplicated array

**Frontmatter Parsing Logic**:
- Regex: `/---\s*([\s\S]*?)\s*---/`
- Each line is `key: value`, values are trimmed of quotes
- Special handling: `hidden` becomes boolean, `order` becomes number

### MDX Rendering (`app/components/mdx.tsx`)

**Custom Components**:
- `CustomLink` — Handles internal links (Next.js `Link`), external links (`target="_blank"`), and YouTube embeds
- `YoutubeEmbed` — `<iframe>` for a single video (takes `videoId` or full `link`)
- `DoubleYtEmbed` — Two YoutubeEmbeds side-by-side via CSS grid
- `Gallery` — Renders multiple images with optional `gridColumns` (uses Tailwind `grid-cols-X` classes)
- `Image` — Wrapper around image rendering; deprecated gallery auto-detect
- `Code` — Syntax highlighting via `sugar-high` library
- `Table` — Renders markdown tables
- `createHeading(level, type)` — Dynamically creates h1-h6 with anchor links (`#slug`)
- `Quote` — Renders italicized quote with optional author attribution
- `slugify(str)` — Converts heading text to URL-safe slug (lowercase, replace spaces/special chars)

**MDXRemote Integration**:
- `CustomMDX` component wraps `next-mdx-remote` (RSC-enabled, renders on server)
- Props: `source` (markdown string), `type` (optional, e.g. "resume"), `components` (override defaults)
- Type "resume" changes h4 styling to centered

**Component Registry**:
```javascript
let components = {
  h1, h2, h3, h4, h5, h6: createHeading(),
  img: Image,
  a: CustomLink,
  code: Code,
  Table, YoutubeEmbed, DoubleYtEmbed, Gallery, Quote,
}
```

### Post Indexing & Pre-rendering

**Build Time** (`generateStaticParams`):
- `app/blog/[category]/[slug]/page.tsx` calls `getBlogPosts().map(post => ({ category: post.category, slug: post.slug }))`
- Next.js pre-renders all combinations as static HTML

**Metadata Generation**:
- `generateMetadata({ params })` finds matching post by category & slug
- Extracts title, publishedAt, description (first 200 chars of content)
- Sets OpenGraph metadata: title, description, type: 'article', publishedTime, section (category), url

## Data Flow

1. **Build Time**:
   - `getBlogPosts()` recursively reads all markdown files from `app/blog/posts/`
   - File system traversal: category → year → slug.md
   - Each file parsed: frontmatter extracted, content preserved as raw markdown string
   - `generateStaticParams` returns array of `{ category, slug }`
   - Next.js pre-renders HTML for each combination

2. **Runtime**:
   - User navigates to `/blog/[category]/[slug]`
   - Page component calls `getBlogPosts().find(post => post.slug === params.slug && post.category === params.category)`
   - Passes `post.content` (raw markdown) to `CustomMDX` component
   - `next-mdx-remote` renders markdown to React components, injects custom component overrides
   - Custom components (Link, YoutubeEmbed, Code, etc.) execute on server

3. **Client-Side Filtering** (blog index):
   - `getSortedBlogPosts()` returns all visible posts
   - `BlogPosts` component manages state: category, year, month filters, pagination
   - React filters array in-place, updates render on state change

## Dependencies

**Internal**:
- Config loaded from `@/config.json` (for maxDescLength)
- Type system: markdown frontmatter types

**External**:
- `next-mdx-remote/rsc` — Server component MDX renderer
- `sugar-high@^0.6.0` — Syntax highlighting for code blocks
- Node.js `fs`, `path` modules (file system access at build time only)

## Consumers

- **Home page** (`app/page.tsx`) — Calls `getSortedBlogPosts()`, renders recent posts with `BlogPosts` component
- **Blog index** (`app/blog/page.tsx`) — Same, with pagination and filtering
- **Blog post detail** (`app/blog/[category]/[slug]/page.tsx`) — Fetches single post, renders with `CustomMDX`
- **Sitemap generator** (`app/sitemap.ts`) — Iterates all blog posts to build URLs

## Patterns & Conventions

**Post Naming**:
- Date-based slug: `YYMMDD.md` or `YYMMDD-N.md` (for multiple posts same day)
- Example: `251128.md`, `251128-1.md`, `251128-2.md`

**Post Structure**:
```markdown
---
title: My Post Title
publishedAt: 2025-11-28
order: 1
hidden: false
---

# Heading

Content with images, links, embeds...
```

**Hidden Posts**:
- Set `hidden: true` to exclude from public site
- Dev mode (`NODE_ENV === 'development'`) shows all posts
- Production filters via `checkPostIfHidden()`

**Image Colocation**:
- Images stored at `public/images/blog/[category]/[year]/[slug]/`
- Markdown references: `![alt](/images/blog/Tech/25/251128/screenshot.png)`

**Gallery Shorthand**:
- JSX in markdown: `<Gallery imgs={['/img1.png', '/img2.png']} gridColumns={2} />`
- Deprecated: `![gallery](/img1.png,/img2.png)` — Image component auto-detects and splits

**Anchor Links**:
- Headings auto-generate slugs and anchor links (e.g., `## My Section` → `<h2 id="my-section">`)
- Visible on hover in prose context

## Gotchas & Non-Obvious Logic

**Hidden Post Checking**:
- `checkPostIfHidden` returns `!post.metadata.hidden || NODE_ENV === 'development'`
- Logic: show if not hidden, OR always show in dev
- Inverse at first read; worth double-checking before refactoring

**Order Field**:
- If two posts have same `publishedAt` date, `order` breaks ties
- Higher `order` sorts first (descending sort in `getSortedBlogPosts`)
- Common use case: multiple posts published same day

**Category String Normalization**:
- Category stored as-is in directory (e.g., "Tech", "Cooking")
- URL uses same string: `/blog/Tech/251128`
- No slug conversion for categories (unlike post slugs)

**MDX Content Availability**:
- `next-mdx-remote` is RSC, runs server-side at render time
- Custom components can be async if needed (currently all synchronous)
- Content rendered on server; no hydration mismatch

**Description Truncation**:
- Blog list summaries truncate at `config.blog.maxDescLength` (default 200)
- Raw markdown content sliced; no smart sentence boundary detection
- May cut off mid-word or in code blocks

**Image Alt Text**:
- Gallery component checked via `alt.includes('gallery')`
- Comma-separated image list: `![gallery](/img1,/img2)` → split and rendered
- Deprecated but still supported; prefer JSX `<Gallery>` component

**File System at Build Time**:
- All `fs` operations happen at build time (Next.js build process)
- Runtime cannot access file system (static export to GitHub Pages)
- Post modifications require rebuild

## Open Questions

- Whether markdown comment syntax (HTML comments) is processed by MDX or passed through as-is
- Whether code block syntax highlighting is deterministic across builds
- Whether very large markdown files or deeply nested galleries impact build performance
