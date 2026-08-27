#!/usr/bin/env node
/**
 * Media migration: local media-export dir → Vercel Blob.
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=... node scripts/migrate-media.mjs <media-export-dir>
 *
 * Produces url-map.json next to this script: every legacy URL spelling
 * (absolute https/http, relative /media/...) → new Blob URL.
 * Idempotent: re-running overwrites the same pathnames (no random suffix).
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { put } from '@vercel/blob'

const dir = process.argv[2]
if (!dir || !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    'Usage: BLOB_READ_WRITE_TOKEN=... node scripts/migrate-media.mjs <media-export-dir>',
  )
  process.exit(1)
}

const entries = await readdir(dir)
const map = {}

for (const name of entries) {
  const path = join(dir, name)
  if (!(await stat(path)).isFile()) continue
  const file = await readFile(path)
  const blob = await put(`media/${name}`, file, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  const encoded = encodeURIComponent(name)
  for (const old of [
    `https://omanosaura.com/media/${name}`,
    `https://omanosaura.com/media/${encoded}`,
    `http://omanosaura.com/media/${name}`,
    `/media/${name}`,
    `/media/${encoded}`,
  ]) {
    map[old] = blob.url
  }
  console.log(`${name} -> ${blob.url}`)
}

await writeFile(
  new URL('./url-map.json', import.meta.url),
  JSON.stringify(map, null, 2),
)
console.log(`\n${Object.keys(map).length} mappings written to scripts/url-map.json`)
