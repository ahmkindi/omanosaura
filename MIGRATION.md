# Cutover runbook: VPS → Vercel

The new app lives in `web/` and fully replaces `server/` (Go API) and `client/` (Next 13).

## Prerequisites (owner actions)

1. **Vercel project**: create at vercel.com, import this repo, set **Root Directory = `web`**.
2. **Neon**: Vercel Marketplace → Neon (Postgres 17, Frankfurt). Injects `DATABASE_URL` (pooled) + unpooled URL — add the unpooled one as `DIRECT_DATABASE_URL`.
3. **Blob**: Vercel → Storage → Blob store. Injects `BLOB_READ_WRITE_TOKEN`.
4. **Firebase service account**: Firebase console → Project settings → Service accounts → Generate new private key. Then `base64 -w0 key.json` → set as `FIREBASE_SERVICE_ACCOUNT`. Revoke the old VPS key at decommission.
5. **Env vars** (Vercel → Settings → Environment Variables):
   - `NEXT_PUBLIC_FIREBASE_*` ×7 (from `client/.env.local`)
   - `THAWANI_API_KEY`, `THAWANI_BASE_URL`, `THAWANI_PUBLISHABLE_KEY` (UAT until prod switch)
   - `THAWANI_WEBHOOK_SECRET` (set the same value in the Thawani merchant portal with webhook URL `https://omanosaura.com/api/webhooks/thawani`)
   - `EMAIL_USERNAME`, `EMAIL_PASSWORD` (from VPS `~/omanosaura/.env` — note repo `.env.example` has typo `EMAIL_PASSOWRD`; the correct var is `EMAIL_PASSWORD`)
   - `BASE_URL=https://omanosaura.com` (Production) / preview URL for Preview
   - `CRON_SECRET` (any random string; Vercel cron sends it automatically)
6. **Firebase authorized domains**: add `<project>.vercel.app` (omanosaura.com already there).

## Data migration (T-days before)

```bash
# 1. Export media FIRST (from VPS via docker cp) — archive it
ssh ahmed@<VPS> 'docker cp omanosaura-server-1:/app/media /tmp/media-export && tar czf /tmp/media.tar.gz -C /tmp media-export'
scp ahmed@<VPS>:/tmp/media.tar.gz .

# 2. Dump prod DB (creds stay on the VPS)
ssh ahmed@<VPS> 'docker exec omanosaura-db-1 sh -c "pg_dump -U \$POSTGRES_USER -d postgres --format=custom --no-owner --no-privileges --exclude-table=public.schema_migrations" > /tmp/omanosaura.dump'
scp ahmed@<VPS>:/tmp/omanosaura.dump .

# 3. Restore into Neon (unpooled URL)
pg_restore --no-owner --no-privileges -d "$DIRECT_DATABASE_URL" omanosaura.dump
psql "$DIRECT_DATABASE_URL" -c 'DROP VIEW IF EXISTS available_products;'

# 4. Prisma baseline (schema pre-exists from restore)
cd web && npx prisma migrate resolve --applied 0_init && npx prisma migrate status

# 5. Media → Blob + URL rewrite (idempotent)
tar xzf media.tar.gz
BLOB_READ_WRITE_TOKEN=... node scripts/migrate-media.mjs ./media-export
DATABASE_URL="$DIRECT_DATABASE_URL" node scripts/rewrite-media-urls.mjs
git add scripts/url-map.json && git commit  # bakes /media/* redirects into next.config
```

## Verify on preview (before DNS)

- Login: magic link, Google, Facebook (test on the stable `<project>.vercel.app` alias)
- Browse en + ar (RTL), product detail, blog with images
- UAT card purchase round-trip: dialog → Thawani → redirect to /purchases, purchase `complete=true`, both emails received
- Webhook: Thawani portal → set webhook to preview URL temporarily, repeat purchase, check function logs
- Cash purchase, review CRUD, admin product/blog CRUD → public pages revalidate
- `/sitemap.xml`, `/robots.txt`, `/media/<some-file>` → 308 to Blob

## Cutover day (~30–60 min window)

1. Lower DNS TTL to 300 **at least a day before**; pre-add `omanosaura.com` + `www` in Vercel (verify via `_vercel` TXT while DNS still points at VPS).
2. Stop writes: `ssh ahmed@<VPS> 'docker stop omanosaura-server-1'`
3. Final dump → `pg_restore --clean --if-exists --no-owner --no-privileges` into Neon → re-drop `available_products`/`schema_migrations` → re-run `rewrite-media-urls.mjs` → media delta (`docker cp` again if new files, re-run migrate-media)
4. Flip DNS: apex A → Vercel IP (dashboard shows it), `www` CNAME → dashboard target
5. Smoke test on omanosaura.com: cert, login, product page, UAT purchase, sitemap
6. Rollback if needed: flip DNS back, `docker start omanosaura-server-1`

## Post-cutover

- Reconcile purchases `paid=true AND complete=false` against Thawani dashboard (the daily cron also sweeps these)
- **Thawani UAT → production** (separate step): swap `THAWANI_*` env to prod values + prod portal webhook, one real low-value transaction, refund it
- Google Search Console: resubmit sitemap
- T+7–14: archive final dump + media tarball + VPS `.env`, revoke old Firebase key, `docker compose down --volumes` on VPS (incl. dead `crazy_kirch` smartpay container), remove certbot crontab entries, cancel VPS
- Repo: tag `pre-vercel-migration`, branch `attic/vps-stack`, then delete `server/`, `client/`, `app/`, compose files, `Makefile`, `db_backup.sh` from main
