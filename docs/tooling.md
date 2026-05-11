# Tooling & Build

Development tools, CLI utilities, and deployment pipeline.

## Location

```
tools/
├── new-post.mjs          # CLI to scaffold new blog posts
├── resize-image.mjs      # CLI to batch resize images
└── template.md           # Markdown template for new posts

package.json             # Scripts and dependencies
next.config.js           # Next.js configuration
postcss.config.js        # Tailwind CSS configuration
tsconfig.json            # TypeScript configuration
```

## Entry Points

- `package.json` scripts section (pnpm commands)
- `tools/new-post.mjs` — Manual invocation: `pnpm run newpost <category> <title>`
- `tools/resize-image.mjs` — Manual invocation: `pnpm run image`

## Architecture / Key Components

### New Post Scaffolding (`tools/new-post.mjs`)

**Purpose**: Create a new blog post file with correct frontmatter and folder structure.

**Invocation**:
```bash
pnpm run newpost <category> <title>
# Example: pnpm run newpost t "My Tech Post"
```

**Category Shortcuts** (from `config.json`):
- `t` → Tech
- `c` → Cooking
- `l` → Life
- `p` → Photography
- `f` → Film

**Folder Structure**:
- Categories must exist in `config.json.tools.newPost`
- Creates directory: `app/blog/posts/[Category]/[YY]/`
- Year folder auto-created based on current date

**File Naming**:
- Base filename: `YYMMDD.md` (e.g., `251128.md`)
- If base exists, increments: `YYMMDD-1.md`, `YYMMDD-2.md`, etc.
- Order field incremented accordingly

**Frontmatter Template**:
```markdown
---
title: {title}
publishedAt: {YYYY-MM-DD}
order: {auto-incremented}
hidden: false
---
```

**Key Functions**:
- `getValueFromConfig(key)` — Maps category shortcut (t, c, l, p, f) to full name
- `checkFolderPath(dirPath)` — Creates directory if not exists
- `getTodayDate(fullDate)` — Returns current date as YYMMDD or YYYY-MM-DD
- `getNextOrderNumber()` — Scans existing files, determines next order number
- `createMarkdownFile(title, order)` — Reads template.md, replaces placeholders, writes file

**Logic Flow**:
1. Parse arguments: category shortcut, title
2. Look up full category name in config
3. Get today's date in YYMMDD format
4. Create year folder if not exists
5. Check for existing files: base name, then numbered variants
6. Determine next order number
7. Create template content with placeholders filled
8. Write to file

### Image Resizing (`tools/resize-image.mjs`)

**Purpose**: Batch resize images to standard height (720px) for blog posts.

**Invocation**:
```bash
pnpm run image
```

**Configuration** (from `config.json`):
- `extToLook`: ["jpg", "jpeg", "png"] — file types to process
- `dirToLook`: "./temp/" — input directory
- `resizedHeight`: 720 — target height in pixels

**Behavior**:
- Scans `./temp/` for image files with matching extensions
- Resizes each to 720px height (width auto-scaled to maintain aspect ratio)
- Outputs resized image back to `./temp/` (overwrites or creates new)
- Uses `sharp` library for image processing

**Use Case**:
- Download/export images from phone or camera
- Drop in `./temp/` folder
- Run `pnpm run image` to batch resize
- Move resized images to `public/images/blog/[category]/[year]/[slug]/`

### Configuration Files

**package.json**:
```json
{
  "private": true,
  "homepage": "https://bachsofttrick.github.io/",
  "scripts": {
    "predeploy": "pnpm run build",
    "deploy": "gh-pages -d build --nojekyll",
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "image": "node ./tools/resize-image.mjs",
    "newpost": "node ./tools/new-post.mjs"
  }
}
```

**Scripts**:
- `dev` — Start dev server on :3000
- `build` — Compile Next.js to static output in `build/`
- `start` — Run static server (rarely used)
- `predeploy` — Hook that runs before `deploy` (runs build first)
- `deploy` — Push `build/` folder to `gh-pages` branch via `gh-pages` library
- `image` — Run image resize tool
- `newpost` — Run new post scaffolding tool

**next.config.js**:
```javascript
{
  output: 'export',           // Static export (no Node.js runtime)
  distDir: 'build',           // Output to build/ instead of .next/
  webpack(config) {
    config.resolve.fallback = {
      fs: false               // Disable fs module in client (build-time only)
    };
    return config;
  }
}
```

**Key Setting**: `output: 'export'` makes Next.js compile to static HTML (suitable for GitHub Pages). No server runtime.

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "es2015",
    "strict": false,
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  }
}
```

**TypeScript Settings**:
- Global strict mode OFF (`strict: false`)
- But null checks ON (`strictNullChecks: true`)
- `baseUrl: "."` allows `@/` alias imports

**postcss.config.js**:
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**Tailwind Integration**: Uses Tailwind CSS v4 alpha with new `@tailwindcss/postcss` plugin.

## Data Flow

**Development Workflow**:
1. `pnpm install` — Install dependencies
2. `pnpm run dev` — Start dev server with hot reload
3. Edit markdown files, components, styles
4. Changes visible immediately in browser

**New Post Creation**:
1. `pnpm run newpost t "My Title"` — Scaffolds file at correct path
2. Edit `app/blog/posts/Tech/25/YYMMDD.md`
3. Add images to `public/images/blog/Tech/25/YYMMDD/`
4. Commit and push

**Image Preparation**:
1. Export/download images from phone, camera, screenshot tools
2. Drop in `./temp/` folder
3. `pnpm run image` — Batch resize to 720px height
4. Move from `./temp/` to `public/images/blog/[category]/[year]/[slug]/`
5. Reference in markdown: `![alt](/images/blog/.../image.jpg)`

**Build & Deployment**:
1. `pnpm run predeploy` → `pnpm run build` (if run directly, else automatic)
2. Next.js reads all markdown files, pre-renders routes via `generateStaticParams`
3. Output: `build/` folder with static HTML, CSS, JS
4. `pnpm run deploy` → `gh-pages -d build` pushes to GitHub Pages branch
5. GitHub Pages serves from `https://bachsofttrick.github.io/`

## Dependencies

**Core**:
- `next@^14.2.8` — React framework with App Router
- `react@18.2.0`, `react-dom@18.2.0` — UI library
- `typescript@5.3.3` — Type checking

**Build & Styling**:
- `tailwindcss@4.0.0-alpha.13` — Utility CSS framework
- `@tailwindcss/postcss@4.0.0-alpha.13` — Tailwind CSS v4 plugin for PostCSS
- `postcss@^8.4.35` — CSS transformer

**Content**:
- `next-mdx-remote@^4.4.1` — Server-side MDX rendering
- `sugar-high@^0.6.0` — Syntax highlighting for code blocks

**UI & Fonts**:
- `geist@1.2.2` — Geist Sans and Geist Mono fonts
- `@mui/material@^6.0.2` — Material-UI components (Pagination, Select, etc.)
- `@emotion/react@^11.13.3`, `@emotion/styled@^11.13.0` — MUI styling deps

**Image Processing**:
- `sharp@^0.34.5` — Image resizing library (CLI tool)

**Deployment**:
- `gh-pages@^6.3.0` — Publish `build/` to GitHub Pages branch

**Analytics**:
- `@next/third-parties@^16.0.0` — Google Analytics integration

## Patterns & Conventions

**CLI Tool Style**:
- Both tools are `.mjs` (ES modules)
- Structured with named functions (not classes)
- File system operations at runtime (tools, not Next.js build)
- Error handling: simple console.error + process.exit(1)

**Template Approach**:
- New post tool reads `tools/template.md`, replaces placeholders
- Enables quick post scaffolding without hardcoding template in JS

**Config-Driven**:
- Category shortcuts, image resize height, max description length all in `config.json`
- Changes to config require rebuild (Next.js imports at build time)
- Tools read config dynamically at runtime

**Deployment Pipeline**:
- `predeploy` hook ensures build runs before deploy
- `--nojekyll` flag tells GitHub Pages to serve files as-is (no Jekyll processing)
- All build artifacts in `build/` folder (gitignored in source)

## Gotchas & Non-Obvious Logic

**Build-Time Only File Access**:
- `app/blog/utils.ts` uses `fs` module to read markdown at build time
- Next.js automatically strips `fs` usage from client bundle
- `next.config.js` has fallback for fs: false (webpack safety)
- At runtime (GitHub Pages), no file system available; all content pre-rendered as HTML

**Order Numbering**:
- `getNextOrderNumber()` scans files for `YYMMDD-N.md` pattern
- Base file `YYMMDD.md` is NOT renamed to `YYMMDD-1.md` (that line is commented out)
- So if multiple posts exist, order starts at 2, not 1 (if base file exists)
- Logic may seem backwards; intentional design (preserves base file naming)

**Category Shortcut Mapping**:
- Tool reads config to map single-letter shortcuts to category names
- If shortcut not in config, tool exits with error
- No validation of category name (assumes valid folder names in config)

**Image Path Convention**:
- Resize tool reads from `./temp/` but doesn't auto-organize by category/date
- Manual step required: move resized images to correct `public/images/blog/` subfolder
- Prevents accidental overwrites but adds friction

**Tailwind CSS v4 Alpha**:
- Project uses alpha version of Tailwind CSS v4 (may have breaking changes)
- Uses new `@tailwindcss/postcss` plugin instead of traditional config file
- No `tailwind.config.js` in project (config may be in postcss plugin or global CSS)

**GitHub Pages Subpath vs Root**:
- `package.json` homepage: `https://bachsofttrick.github.io/` (root)
- Not deployed to subdirectory like `bachsofttrick.github.io/portfolio/`
- Important for Next.js basePath setting (not configured, so defaults to /)

## Open Questions

- Why template.md is separate file instead of hardcoded string in new-post.mjs
- Whether image resize tool should auto-organize output by date or category
- Whether Tailwind v4 alpha stability is acceptable for production site
- Why category folders aren't auto-created if missing (requires manual mkdir)
- Whether new post tool should validate title uniqueness or slug conflicts
