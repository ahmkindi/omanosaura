---
name: adding-experiences
description: Use when adding, editing, or removing an Omanosaura experience/trip/product, changing its price, dates, photos, or bilingual copy, or working with the products table and pricing logic.
---

# Adding experiences

## Overview

Experiences (aka products/trips) are database rows, edited through the admin UI.
Each has English and Arabic fields, a base price plus optional per-person extra,
a "price per N people" group size, planned shared dates, and a photo gallery.

## The normal way: admin UI

1. Sign in as an admin user (`users.role = 'admin'`; set it in the DB — see the
   local-admin snippet in `CLAUDE.md`).
2. Go to `/admin/experiences` → **New**, or click an existing one to edit.
3. The form (`src/components/admin/product-form.tsx`) writes via the
   `upsertProduct` server action (`src/actions/admin/products.ts`), which
   re-checks `requireRole('admin')`, validates with zod, and revalidates the
   public pages.

Prices are entered in **OMR** in the form and stored in **baisa** (×1000).
Delete is soft (`is_deleted = true`).

## Fields that matter

- `title`/`titleAr`, `subtitle`/`subtitleAr`, `description`/`descriptionAr`
  (rich HTML from the Tiptap editor; sanitized on save).
- `photo` (card/hero) + `photos[]` (gallery). Store absolute URLs; any https host
  renders (`next.config.ts` allows `**`). Prefer Vercel Blob (admin media
  manager at `/admin/media`) for new uploads.
- `basePriceBaisa`, `extraPriceBaisa`, `pricePer`, `plannedDates[]` (shared
  cheaper dates), `longitude`/`latitude`, `kind` (`exp`|`team`|`school`).

## Pricing logic (keep in sync)

`src/lib/pricing.ts` — cost = `ceil(quantity / pricePer) * basePriceBaisa`
plus `payExtra ? quantity * extraPriceBaisa : 0`. The Thawani checkout sends this
total as a single line item (`src/actions/purchase.ts`).

## Editing the schema

If you need a new column, change `prisma/schema.prisma`, then
`npx prisma migrate dev --name <change>` locally and
`npx prisma migrate deploy` against Neon (see the `deploying` skill). Update the
DTO in `src/data/serialize.ts` and the form.

## Slugs

Product `id` is a slug derived from the title (lowercased, spaces → dashes) on
create. It's the URL: `/experiences/<id>`. Changing a title does not change the
slug of an existing product.

## Verify

`/experiences` lists it; `/experiences/<id>` renders detail, gallery, purchase
dialog. Test a purchase against Thawani UAT before assuming checkout works.
