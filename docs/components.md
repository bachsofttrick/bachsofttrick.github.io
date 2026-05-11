# Components & UI

Reusable components for navigation, footer, blog post display, and markdown rendering.

## Location

```
app/components/
├── nav.tsx              # Navbar with music player
├── footer.tsx           # Footer with contact links
├── posts.tsx            # Blog post list with filtering & pagination
├── mdx.tsx              # MDX renderer (covered in blog.md)
├── extra.tsx            # Quote component
└── ImageCarousel.tsx    # Interactive image carousel with lightbox

app/styles/
├── mdx.css              # Prose typography & code block styles (moved from app/components/)
├── animations.css       # Reusable keyframe animations (slideInLeft, slideInRight, fadeIn)
└── carousel.css         # Carousel and lightbox CSS classes
```

## Entry Points

- `app/components/nav.tsx` — Imported in root layout, rendered once per page
- `app/components/footer.tsx` — Imported in root layout, rendered once per page
- `app/components/posts.tsx` — Imported in home & blog pages, passed blog post array
- `app/components/mdx.tsx` — Imported in blog post detail & projects pages
- `app/components/ImageCarousel.tsx` — Registered as `Carousel` MDX component; used directly in blog posts

## Architecture / Key Components

### Navbar (`app/components/nav.tsx`)

**Purpose**: Site navigation and music player.

**Key Elements**:
- Navigation links: `{'/': 'home', '/about': 'about', '/projects': 'projects', '/blog': 'blog'}`
- Music player toggle: displays ▷ (play) or || (pause) based on `isPlaying` state
- Audio file: `/music/Giornos Theme, but only the best part.m4a` (hardcoded)

**Client Component** (`"use client"`):
- Uses `useState` for `isPlaying`
- Uses `useRef` for audio element
- Attaches `ended` event listener to reset playback state

**Toggle Logic**:
```typescript
const togglePlay = () => {
  if (isPlaying) {
    audioRef.current?.pause();
    setIsPlaying(false);
  } else {
    audioRef.current?.play();
    setIsPlaying(true);
  }
};
```

**Styling**:
- `-ml-[8px]` negative margin on nav container
- `lg:sticky lg:top-20` sticky positioning on desktop
- `hover:text-neutral-800` on links and music button
- `flex flex-row` layout with spacing

### Footer (`app/components/footer.tsx`)

**Purpose**: Display contact information and social links.

**Key Elements**:
- Contact info (address, phone) from `config.json`
- Social links: GitHub, LinkedIn, email, resume (DOCX), RSS feed
- Arrow icon (SVG) with optional hide toggle
- Year copyright (dynamic `new Date().getFullYear()`)

**FooterPart Helper**:
- Conditional rendering: if no `href`, renders static text; if `href`, renders `<a>` tag
- Arrow icon shown unless `noArrow=true`
- Styling: `ml-2` offset for arrow, `hover:text-neutral-800` on hover

**Config Dependency**:
- Loads `contactInfo` from `config.json`: address, phone, github, linkedin, email, resume URL

**Layout**:
- Two `<ul>` sections: contact info (static), social links (clickable)
- Responsive: flex column on mobile, row on desktop with spacing

### BlogPosts Component (`app/components/posts.tsx`)

**Purpose**: Display blog post list with optional full-text search, filtering, pagination, and summaries.

**Client Component** (`"use client"`):
- Uses MUI components: `Pagination`, `PaginationItem`, `Select`, `MenuItem`, `FormControl`, `InputLabel`, `TextField`
- Uses FlexSearch: `Document` index over post title + content
- State management: `page`, `category`, `year`, `month`, `searchQuery`
- Filtering logic: cascade (category → year → month) OR full-text search (overrides all filters)

**Props**:
```typescript
{
  allBlogs: MDXData[],
  itemPerPage?: number (default 4),
  addSummary?: boolean (default false),
  pagination?: boolean (default false),
  highlightedPosts?: string[] (default [])
}
```

**Search Implementation**:
- `searchIndex` built via `useMemo` from all blogs (computed once, memoized on `allBlogs` change)
- FlexSearch `Document` indexes `['title', 'content']` for each post
- `searchQuery` state tracks user input from MUI `TextField`
- When `searchQuery` is not empty: search both title and content indices, merge results, override filter logic
- When `searchQuery` is empty: category/year/month filters apply normally
- `useEffect` resets page to 1 when `searchQuery` changes (prevents out-of-range pagination)
- Filters (category/year/month selects) are hidden when search is active

**Filtering Logic** (when no search is active):
1. If `highlightedPosts` provided, filter to only those slugs
2. Filter by selected category (if not 'All')
3. Build year list from filtered posts, populate dropdown
4. If year selected, filter by year and build month dropdown
5. If month selected, filter by month
6. Calculate total pages based on final filtered count

**Search Logic** (when `searchQuery.trim() !== ''`):
1. Query FlexSearch title index: returns array of post IDs
2. Query FlexSearch content index: returns array of post IDs
3. Merge results via `new Set([...titleIds, ...contentIds])` (deduplicates)
4. Map IDs back to post objects, filter out any undefined entries
5. Use merged results as `returnBlogs`, ignoring all category/year/month filters

**Filtering Functions**:
- `SplitWordFromDuplicateCount` — Extracts word from "Word (count)" format
- `SplitNumberFromDuplicateCount` — Extracts number
- `AddSpaceToCategory` — Replace hyphens with spaces for display

**Pagination**:
- MUI `Pagination` component with custom styling
- Page state resets when `searchQuery` changes; also resets on filter change
- Slice rendered posts: `posts.slice(page * itemPerPage - itemPerPage, page * itemPerPage)`

**Post Rendering**:
- Maps over filtered or search-result posts, renders `<Link href={/blog/${category}/${slug}}>`
- Displays: category (with spaces), publish date, title, optional summary (first 200 chars)
- Summary length from `config.blog.maxDescLength`

**Conditional Rendering**:
- Search input (`TextField`) always shown if `pagination={true}`
- Category/year/month dropdowns only shown if `pagination={true}` AND `searchQuery.trim() === ''`
- Month dropdown only shown if year is selected (and no search is active)
- Summary only shown if `addSummary={true}`
- Pagination controls only shown if `pagination={true}`
- Post count display at bottom

### ImageCarousel (`app/components/ImageCarousel.tsx`)

**Purpose**: Interactive image carousel with a fullscreen lightbox.

**Client Component** (`"use client"`):
- Uses `useState` for `idx` (current image index), `dir` (slide direction), and `lightboxOpen`
- Uses `useEffect` to attach keyboard listeners when lightbox is open (cleaned up on close)
- Uses `createPortal` to render the lightbox at `document.body` (avoids z-index/overflow clipping)

**Props**:
```typescript
{ imgs: string[] }
```

**Navigation**:
- Prev/next buttons update `dir` ("left"/"right") then cycle `idx` with wrap-around
- Dot row lets the user jump directly to any image; `dir` set based on whether target is ahead or behind
- Keyboard: `ArrowLeft`/`ArrowRight` navigate; `Escape` closes lightbox (only active when lightbox is open)

**Animation**:
- Slide direction drives CSS class: `slideInRight` or `slideInLeft` (defined in `animations.css`)
- Lightbox entry uses `fadeIn` animation (also in `animations.css`)
- `key={idx}` on `<img>` forces React to remount the element on each slide, re-triggering the animation

**Lightbox**:
- Click on the carousel image opens the lightbox; click outside the content or press Escape to close
- Lightbox renders the same nav buttons and dot row; `e.stopPropagation()` prevents close when clicking inside content

**CSS**:
- Imports `animations.css` and `carousel.css` directly
- All carousel/lightbox classes are BEM-style: `carousel__btn`, `carousel__btn--prev`, `carousel__dot--active`, `lightbox__close`, etc.

**MDX Registration**:
- Exported as default; registered as `Carousel` in `mdx.tsx` custom components map, so `<Carousel imgs={[...]} />` works in markdown posts

### Quote Component (`app/components/extra.tsx`)

**Purpose**: Simple styled quote display.

**Renders**:
```typescript
"<quote text>" <author name>
```

**Styling**:
- Quote text in italics
- Author name appended with space prefix
- No custom styling; relies on consumer's container styles

## Data Flow

1. **Navbar**:
   - Root layout renders `<Navbar />`
   - User toggles music button → React state updates
   - Audio element plays/pauses; event listener resets state on end

2. **BlogPosts**:
   - Page calls `getSortedBlogPosts()`, passes array to `<BlogPosts />`
   - Component initializes state: category='All', page=1, year=0, month=0
   - Render loop filters posts, generates dropdowns with counts
   - User selects filter → state updates → re-render with filtered subset

3. **Footer**:
   - Root layout renders `<Footer />`
   - Config is static; links never change without rebuild

## Dependencies

**Internal**:
- `config.json` — contactInfo (footer), blog.maxDescLength (posts component)
- `app/blog/utils.ts` — Type definitions, formatDate, utility functions

**External**:
- `next/link` — Next.js Link component for client-side navigation
- React hooks: `useState`, `useRef`, `useEffect`, `useMemo`
- MUI: `Pagination`, `PaginationItem`, `Select`, `MenuItem`, `FormControl`, `InputLabel`, `TextField`
- FlexSearch: `Document` class for full-text indexing

## Patterns & Conventions

**State Management**:
- All state local to component (posts.tsx, nav.tsx)
- No global state management
- Category filter cascades: selecting category resets year/month/page to defaults

**Responsive Design**:
- Mobile-first with Tailwind breakpoints (md:)
- Navbar: full width on mobile, sticky on desktop (lg:)
- Footer: flex column on mobile, row on desktop
- Blog list: post info stacks on mobile, inline on desktop

**Link Styling**:
- Internal nav links: no underline, hover color change
- Blog post links: same styling
- External footer links: target="_blank" with arrow icon

**Dropdown Behavior**:
- Category dropdown shows all categories with post count
- Year dropdown generates from posts in selected category
- Month dropdown only appears if year > 0
- All resets on cascade (category resets year/month, year resets month)

## Gotchas & Non-Obvious Logic

**Search Overrides Filters**:
- When `searchQuery` is non-empty, **all category/year/month filters are ignored**
- Search results are merged from title + content indices (union, not intersection)
- Filters are hidden entirely while search is active (better UX: user doesn't expect cascade)
- Clearing search query immediately restores filter dropdowns

**Search Index Memoization**:
- `searchIndex` is built via `useMemo` and recalculated only when `allBlogs` array reference changes
- Does NOT recalculate when state (page, category, etc.) changes
- Efficient but means new posts only appear in search after a full component re-mount (or allBlogs prop change)

**Category Cascading** (filters only):
- When category changes, year and month dropdowns are recalculated
- Year list calculated from **all posts in category**, not just filtered subset
- After year selection, month list calculated from **filtered posts (category + year)**
- This prevents invalid year/month combinations but can be confusing

**Pagination Edge Case**:
- If `pagination={true}`, slice uses: `slice(page * itemPerPage - itemPerPage, page * itemPerPage)`
- Example: page 1, itemPerPage=4 → slice(0, 4); page 2 → slice(4, 8)
- If user filters down to 2 items but is on page 3, no posts render (graceful)
- Page is reset to 1 on search query change, but not on category/year/month filter changes

**Music Player Event Listener**:
- `ended` listener attached in render (no cleanup dependency array)
- Listener called every render; may create multiple listeners if re-renders occur
- Works fine in practice due to event delegation, but technically a memory leak

**Highlighted Posts**:
- If `highlightedPosts` array provided, component filters **all posts to only those slugs**
- Ignores category/year/month filters (highlighted posts take precedence)
- Search also respects highlighted posts: only searches within the highlighted subset
- Home page uses this with `highlightedPosts={[]}` (empty array = show all sorted)

**Arrow Icon Rendering**:
- `ArrowIcon` component checks `noArrow` prop
- If `noArrow=true`, returns `undefined` (not `null`), rendered as nothing
- Conditional spacing: `ml-2` only added if arrow is visible

**Search Index Structure**:
- FlexSearch Document uses field-based indexing: `{ id: 'id', index: ['title', 'content'], store: false }`
- Posts added with `{ id: idx, title: post.metadata.title, content: post.content }`
- Search results returned as array of objects with `result` field containing matched IDs
- Type-casting to `any` is necessary due to FlexSearch's loose type definitions

**Open Questions**:
- Why music player is built into nav instead of a separate modal/component
- Should highlighted posts also be searchable, or is the current filter-first approach correct?
