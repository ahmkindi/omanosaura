---
name: deploying
description: Use when shipping Omanosaura changes to production, adding or changing Vercel environment variables, wiring the omanosaura.com domain, or triggering/verifying a Vercel deploy.
---

# Deploying Omanosaura

## Overview

The repo root is a single Next.js app on Vercel (project `omanosaura`, team
`team_sqQLOiO9vwR9wMfeAMFqA392`, root directory = repo root). Pushing to `main`
auto-deploys. Env vars live in Vercel, not in git.

## Ship a change

```bash
npm run build          # always build locally first (catches DB/type errors)
git add -A && git commit -m "..."
git push origin main   # Vercel auto-deploys main → production
```

To deploy without waiting for the git hook, or to force a build:

```bash
npx vercel deploy --prod --yes --scope team_sqQLOiO9vwR9wMfeAMFqA392
```

Login first if the CLI isn't authed: `npx vercel login` (browser). The repo is
already linked (`.vercel/project.json`).

## Environment variables

Vars are per-environment (production, preview). Add or change one:

```bash
printf '%s' "<value>" | npx vercel env add <NAME> production \
  --scope team_sqQLOiO9vwR9wMfeAMFqA392 --force --type <secret|config> --yes
```

- `--type secret` = encrypted, hidden. `--type config` = readable in dashboard.
- **`NEXT_PUBLIC_*` cannot be `secret`** — they ship to the browser; use
  `--type config`.
- Run env-add commands from the **repo root** (where `.vercel/` lives) or the CLI
  reports "not linked".
- Env changes only take effect on the **next deploy** — redeploy after adding.

Verify: `npx vercel env ls production --scope team_sqQLOiO9vwR9wMfeAMFqA392`

The full required var list is in the root `CLAUDE.md`.

## Database migrations at deploy time

Schema changes need the migration applied to Neon before/with the deploy:

```bash
# create locally against the dev DB
npx prisma migrate dev --name <change>
# apply to Neon (uses DIRECT_DATABASE_URL from .env)
NODE_OPTIONS=--dns-result-order=ipv4first npx prisma migrate deploy
```

The build runs `prisma generate` (not `migrate`), so migrations must be applied
separately. Prefer Neon's dashboard branching to test a migration against
prod-like data first.

## Thawani webhook (one-time portal setup, not yet done)

Fulfillment is webhook-first; the webhook stays inert until this is configured.
In the **Thawani merchant portal** (production portal — production keys are
already live in the Vercel env):

1. Set webhook URL: `https://omanosaura.com/api/webhooks/thawani`
2. Set a webhook secret, then store the same value:
   `printf '%s' "<secret>" | npx vercel env add THAWANI_WEBHOOK_SECRET production --scope team_sqQLOiO9vwR9wMfeAMFqA392 --force --type secret --yes` and redeploy.

Contract implemented in `src/app/api/webhooks/thawani/route.ts`:
- Headers: `thawani-timestamp`, `thawani-signature`
- Signature = `HMAC-SHA256(rawBody + '-' + timestamp, secret)` hex-encoded
- Events handled: `checkout.completed` with `payment_status === 'paid'` →
  idempotent fulfillment keyed on `client_reference_id` (= purchase UUID);
  `payment.failed` is logged; everything else ignored. Always returns 200 for
  verified events so Thawani doesn't retry forever.
- Test with https://webhook.site first if unsure of the portal's payload.

Until configured, payments still complete via the success redirect
(`/api/purchase/success/[id]`) and the daily reconcile cron — the webhook adds
resilience for customers who close the browser after paying.

## Domains

- `www.omanosaura.com` is aliased on each production deploy automatically.
- Apex `omanosaura.com` must be added once in Vercel → Project → Settings →
  Domains (CLI can't add an externally-registered apex). DNS: apex `A` →
  `216.198.79.1`, `www` `CNAME` → the Vercel target shown in the dashboard.
- After adding/serving any new domain, add it to Firebase authorized domains or
  login breaks — see the `debugging` skill.

## Post-deploy check

```bash
curl -sI https://www.omanosaura.com | head -3          # 200, no `server: nginx`
curl -s https://www.omanosaura.com/api/auth/me         # {"user":null} when logged out
```

Build logs for a failed deploy: use the Vercel MCP `get_deployment_build_logs`
with `errorsOnly: true`, or `npx vercel inspect <url> --logs`.
