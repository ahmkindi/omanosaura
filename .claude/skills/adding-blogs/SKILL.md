---
name: adding-blogs
description: Use when adding, editing, or removing an Omanosaura blog post, or working with blog content, blog images, or blog slugs. Blogs are static files, not database rows.
---

# Adding blog posts

## Overview

Blogs are **static content**, not in the database. Each post is one JSON file in
`src/content/blogs/`, registered in `src/content/blogs/index.ts`. Images are
self-hosted in `public/blog-media/`. This was a deliberate simplification —
there is no blog admin UI.

## Add a post

1. Create `src/content/blogs/<clean-slug>.json`:

```json
{
  "slug": "my-post",
  "legacySlug": "my-post",
  "title": "English title",
  "titleAr": "العنوان بالعربية",
  "description": "One-line English summary",
  "descriptionAr": "ملخص بالعربية",
  "photo": "/blog-media/cover.jpg",
  "createdAt": "2026-08-27",
  "page": "<h2>English body as HTML</h2><p>...</p>",
  "pageAr": "<h2>المحتوى بالعربية</h2><p>...</p>"
}
```

- **slug**: lowercase, letters/numbers/dashes only — no `'`, `!`, `?`, `...`.
  It's the URL: `/blogs/<slug>`.
- **photo** and any `<img src>` inside `page`/`pageAr` must point at
  `/blog-media/<file>` (drop the image files in `public/blog-media/`). Don't
  reference external hosts — the whole point is self-hosting.
- **page/pageAr** are HTML strings, sanitized at render (`src/lib/sanitize.ts`)
  and styled by `src/components/rich-content.tsx`.

2. Register it in `src/content/blogs/index.ts`: add an `import` and include it in
   the `blogPosts` array. The list auto-sorts by `createdAt` descending.

3. `npm run build` — the post is statically generated at `/blogs/<slug>` and
   `/ar/blogs/<slug>`, added to the sitemap, and gets Article JSON-LD +
   OpenGraph automatically.

## Old-slug redirects

If a post replaces a legacy URL that had special characters, add a 301 in the
`redirects()` block of `next.config.ts` (see the existing blog entries).

## Remove a post

Delete its JSON file and its import/array entry in `index.ts`. Optionally add a
redirect if the URL was indexed.

## Reading data

`src/data/blogs.ts` reads from the static index (synchronous — no `await`). If
you add a field, update `BlogPost` in `index.ts` and the `BlogDTO` mapping.
