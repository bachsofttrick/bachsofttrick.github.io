# Plan: Add FlexSearch to blog page

## Overview
Add full-text search to the blog index page using FlexSearch. A search input will appear above the existing filters in `BlogPosts`; when a query is active it overrides category/year/month filtering and shows matching posts.

## Tasks

### Task 1: Install flexsearch
**Status**: done
**Goal**: Add `flexsearch` and its TypeScript types as dependencies.
**Depends on**: none
**Details**: Run `pnpm add flexsearch` and `pnpm add -D @types/flexsearch` in the project root. Verify both appear in `package.json`.

### Task 2: Add search input and FlexSearch logic to BlogPosts
**Status**: done
**Goal**: Integrate a text search input into the `BlogPosts` component that uses FlexSearch to filter posts by title and content.
**Depends on**: Task 1
**Details**:
- File to modify: `app/components/posts.tsx`
- Add a `searchQuery` state (string, default `''`) and a text input rendered above the existing filter dropdowns when `pagination` is true.
- Build a FlexSearch `Document` index with `useMemo` from `allBlogs`. Index fields: `title` (from `post.metadata.title`) and `content` (from `post.content`). Use `id` field mapped to the array index or a composite key like `category + slug`.
- When `searchQuery` is non-empty: replace `returnBlogs` with the FlexSearch search results (merge results from both `title` and `content` fields, deduplicate by id, map back to `MDXData`). Reset page to 1 whenever `searchQuery` changes.
- When `searchQuery` is empty: existing category/year/month filter logic runs unchanged.
- Style the input to match the existing MUI aesthetic -- use an MUI `TextField` with label "Search" and `className='mr-4 mb-4'`.
- When `searchQuery` is active, hide the category/year/month dropdowns (return null for that block) so the UI is uncluttered.
- The `highlightedPosts` pre-filter still runs before search so it is unaffected.
