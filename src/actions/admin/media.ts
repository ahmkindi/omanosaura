'use server'

import { del, list } from '@vercel/blob'
import { requireRole } from '@/lib/auth'

export type BlobFile = {
  url: string
  pathname: string
  size: number
  uploadedAt: string
}

export async function listMedia(): Promise<BlobFile[]> {
  await requireRole('admin')
  try {
    const { blobs } = await list({ limit: 500 })
    return blobs
      .map((b) => ({
        url: b.url,
        pathname: b.pathname,
        size: b.size,
        uploadedAt: new Date(b.uploadedAt).toISOString(),
      }))
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
  } catch (error) {
    // Missing/expired blob credentials shouldn't crash the admin page.
    console.error('blob list failed', error)
    return []
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
