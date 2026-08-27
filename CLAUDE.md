@AGENTS.md

# Omanosaura

Bilingual (English + Arabic, RTL) tourism site for an Omani adventure company:
experiences with Thawani checkout, static blogs, an admin area, and Firebase
auth. This repo IS the whole app — a single Next.js 16 project deployed to
Vercel. There is no separate backend; the old Go API and Next 13 client were
removed (see the `pre-root-refactor` tag and `attic/*` branches for history).

## Stack

- **Next.js 16** (App Router, Turbopack). Note `proxy.ts` (not `middleware.ts`),
  async `cookies()`/`params`. Read `node_modules/next/dist/docs/` before using
  an unfamiliar API — this version differs from older Next.
- **Prisma 7** + `@prisma/adapter-neon` (prod) / `@prisma/adapter-pg` (local).
  `src/lib/db.ts` picks the adapter by hostname.
- **Neon Postgres** (project `jolly-fog-29374894`, eu-central-1).
- **next-intl 4** — `en` default (no prefix), `/ar` prefixed, RTL. Messages in
  `messages/{en,ar}.json`.
- **Tailwind v4 + shadcn/ui**, **motion** for animation. Brand tokens in
  `src/app/globals.css`: `--night` navy, `--sand` bg, `--wadi` cyan, secondary
  orange. Display font Bricolage Grotesque, body IBM Plex Sans Arabic, mono IBM
  Plex Mono.
- **Firebase Auth** (kept from the old app; `users.id` = Firebase UID). Session
  cookies, not client tokens.
- **Thawani** payments (Omani gateway), **Brevo** SMTP for email, **Vercel Blob**
  for admin media uploads.

## Layout

```
src/
  app/[locale]/        pages (home, experiences, blogs, about, contact, profile,
                       purchases, admin/*, auth/complete)
  app/api/             auth/session, auth/me, webhooks/thawani,
                       purchase/success/[id], cron/reconcile-purchases, media/upload
  actions/             server actions (purchase, reviews, profile, contact, admin/*)
  data/                DB reads for server components (products, purchases, users)
  content/blogs/       STATIC blog posts (JSON + index.ts) — NOT in the database
  lib/                 db, auth, thawani, pricing, email, firebase/*, seo, sanitize
  components/          layout/, home/, experiences/, admin/, ui/ (shadcn)
  i18n/                routing, navigation, request
messages/{en,ar}.json  translations
prisma/                schema + 0_init migration
public/blog-media/     self-hosted blog images
```

## Data model

Products, purchases, reviews, users, user_customer_id live in Postgres (Prisma
schema maps to the legacy snake_case columns via `@map`). **Blogs do NOT** — they
are static files in `src/content/blogs/`. Money is stored in **baisa** (1 OMR =
1000 baisa) as `BigInt`; convert to `number` in the `data/` layer before crossing
into client components. Dates are `@db.Date`; format date-only, never TZ-shift.

## Commands

```bash
npm run dev              # local dev (needs local Postgres, see below)
npm run build            # prisma generate + next build
npx prisma migrate dev   # create a migration from schema changes (local)
npx prisma migrate deploy # apply migrations to whatever DATABASE_URL points at
```

## Environment

`.env` (gitignored) holds real secrets locally. Production/preview vars live in
Vercel. Full list: `DATABASE_URL` + `DIRECT_DATABASE_URL` (Neon; pooled for the
app, direct for migrations), `FIREBASE_SERVICE_ACCOUNT` (base64 JSON),
`NEXT_PUBLIC_FIREBASE_*` (×7), `THAWANI_API_KEY/BASE_URL/PUBLISHABLE_KEY/WEBHOOK_SECRET`,
`EMAIL_USERNAME/PASSWORD` + `SMTP_HOST/PORT` + `EMAIL_FROM` (Brevo), `BLOB_READ_WRITE_TOKEN`,
`BASE_URL`, `CRON_SECRET`.

## Local database

Dev uses a Docker Postgres 17 on port 5433 (NOT Neon):

```bash
docker start omanosaura-dev-db   # already created and seeded
# DATABASE_URL=postgresql://omanosaura:localdev@localhost:5433/omanosaura
```

`src/lib/db.ts` uses the pg adapter for non-neon hosts automatically. To make
yourself admin locally:
`docker exec omanosaura-dev-db psql -U omanosaura -d omanosaura -c "UPDATE users SET role='admin' WHERE email='<you>'"`

## Gotchas (things that already bit us)

- **IPv6 / Google + Neon**: this machine's IPv6 route to Google/Neon times out.
  Prefix Node commands that reach Firebase/Neon with
  `NODE_OPTIONS=--dns-result-order=ipv4first` and retry once on `ETIMEDOUT`.
- **Firebase authorized domains**: every domain the app is served on must be in
  Firebase Auth → authorized domains, or login fails with
  `auth/unauthorized-domain`. Managed via the Identity Toolkit admin API with the
  service account (see the debugging skill). Dynamic Links deprecation does NOT
  affect this web app — web email-link + popup auth still work and are free.
- **Prisma client is gitignored** (`src/generated/`). Builds run `prisma generate`
  first; that's why `prisma.config.ts` makes its datasource optional.
- **Blog slugs**: legacy slugs had `'`, `!`, `...`, `?` and 404'd. Static slugs
  are clean; legacy paths 301 via `next.config.ts`.
- **Auth is server-side**. `src/lib/auth.ts` verifies the session cookie;
  `requireRole('admin')` gates admin actions. The navbar reads the session
  client-side via `/api/auth/me` so pages can stay static/ISR.

## Project skills

- `.claude/skills/deploying` — ship changes, env vars, Vercel, domains
- `.claude/skills/adding-experiences` — add/edit a trip (admin or DB)
- `.claude/skills/adding-blogs` — add a static blog post
- `.claude/skills/debugging` — auth, DB, Thawani, email, build failures
