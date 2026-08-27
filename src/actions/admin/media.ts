'use server'

import { del, list } from '@vercel/blob'
import { requireRole } from '@/lib/auth'

export type BlobFile = {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

export type MediaListing = {
  // Sub-folder prefixes directly under `prefix`, e.g. 'products/'.
  folders: string[]
  files: BlobFile[]
}

export async function listMedia(prefix = ''): Promise<MediaListing> {
  await requireRole('admin')
  try {
    const { blobs, folders } = await list({ limit: 500, prefix, mode: 'folded' })
    return {
      folders,
      files: blobs
        .map((b) => ({
          url: b.url,
          pathname: b.pathname,
          size: b.size,
          uploadedAt: new Date(b.uploadedAt).toISOString(),
        }))
        .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)),
    }
  } catch (error) {
    // Missing/expired blob credentials shouldn't crash the admin page.
    console.error('blob list failed', error)
    return { folders: [], files: [] }
  }
}

export async function deleteMedia(url: string): Promise<{ ok: boolean }> {
  try {
    await requireRole('admin')
    await del(url)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
