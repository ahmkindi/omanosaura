#!/usr/bin/env node
/**
 * Rewrites legacy /media URLs in the database to Blob URLs using
 * scripts/url-map.json. Idempotent — safe to re-run after the final
 * cutover-day restore.
 *
 * Usage: DATABASE_URL=postgres://... node scripts/rewrite-media-urls.mjs
 */
import { readFile } from 'node:fs/promises'
import pg from 'pg'

const map = JSON.parse(
  await readFile(new URL('./url-map.json', import.meta.url), 'utf8'),
)
const client = new pg.Client({ connectionString: process.env.DATABASE_URL })
await client.connect()

let updates = 0
for (const [oldUrl, newUrl] of Object.entries(map)) {
  const results = await Promise.all([
    client.query('UPDATE products SET photo = $2 WHERE photo = $1', [oldUrl, newUrl]),
    client.query('UPDATE blogs SET photo = $2 WHERE photo = $1', [oldUrl, newUrl]),
    client.query(
      `UPDATE products SET photos = array_replace(photos, $1, $2)
       WHERE $1 = ANY(photos)`,
      [oldUrl, newUrl],
    ),
    client.query(
      `UPDATE products SET description = replace(description, $1, $2),
              description_ar = replace(description_ar, $1, $2)
       WHERE description LIKE '%' || $1 || '%' OR description_ar LIKE '%' || $1 || '%'`,
      [oldUrl, newUrl],
    ),
    client.query(
      `UPDATE blogs SET page = replace(page, $1, $2),
              page_ar = replace(page_ar, $1, $2)
       WHERE page LIKE '%' || $1 || '%' OR page_ar LIKE '%' || $1 || '%'`,
      [oldUrl, newUrl],
    ),
  ])
  updates += results.reduce((sum, r) => sum + (r.rowCount ?? 0), 0)
}

console.log(`Done: ${updates} rows updated`)
const leftovers = await client.query(
  `SELECT id FROM products WHERE photo LIKE '%omanosaura.com/media%'
   UNION SELECT id FROM blogs WHERE photo LIKE '%omanosaura.com/media%'`,
)
if (leftovers.rows.length) {
  console.warn('Rows still referencing legacy media:', leftovers.rows)
}
await client.end()
