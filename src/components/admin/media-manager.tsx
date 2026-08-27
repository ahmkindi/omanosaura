'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import {
  ChevronRight,
  Copy,
  Folder,
  FolderPlus,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import { deleteMedia, listMedia, type MediaListing } from '@/actions/admin/media'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function MediaManager() {
  const [prefix, setPrefix] = useState('')
  const [listing, setListing] = useState<MediaListing | null>(null)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(
    () => listMedia(prefix).then(setListing),
    [prefix],
  )
  useEffect(() => {
    setListing(null)
    setQuery('')
    void refresh()
  }, [refresh])

  const onUpload = async (selected: FileList | null) => {
    if (!selected?.length) return
    setBusy(true)
    try {
      for (const file of Array.from(selected)) {
        await upload(`${prefix}${file.name}`, file, {
          access: 'public',
          handleUploadUrl: '/api/media/upload',
        })
      }
      toast.success('Uploaded')
      await refresh()
    } catch (error) {
      toast.error(String(error))
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const newFolder = () => {
    const name = prompt('Folder name')?.trim().replace(/\/+$/, '')
    if (!name) return
    if (/[^a-zA-Z0-9._-]/.test(name)) {
      toast.error('Use letters, numbers, dots, dashes')
      return
    }
    setPrefix(`${prefix}${name}/`)
  }

  // Breadcrumb segments: '' → ['products/', 'products/2024/']
  const crumbs = prefix
    .split('/')
    .filter(Boolean)
    .map((seg, i, all) => ({
      label: seg,
      prefix: all.slice(0, i + 1).join('/') + '/',
    }))

  const files =
    listing?.files.filter((f) =>
      f.pathname.toLowerCase().includes(query.toLowerCase()),
    ) ?? []

  return (
    <div className="space-y-6" dir="ltr">
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => onUpload(e.target.files)}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          Upload{prefix ? ` to ${prefix}` : ''}
        </Button>
        <Button variant="outline" onClick={newFolder}>
          <FolderPlus className="size-4" /> New folder
        </Button>
        <Input
          placeholder="Filter files…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <nav className="text-muted-foreground flex items-center gap-1 text-sm">
        <button
          className="hover:text-foreground font-medium"
          onClick={() => setPrefix('')}
        >
          Media
        </button>
        {crumbs.map((c) => (
          <span key={c.prefix} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" />
            <button
              className="hover:text-foreground font-medium"
              onClick={() => setPrefix(c.prefix)}
            >
              {c.label}
            </button>
          </span>
        ))}
      </nav>

      {listing === null ? (
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      ) : (
        <>
          {listing.folders.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {listing.folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setPrefix(f)}
                  className="bg-card hover:bg-accent flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium"
                >
                  <Folder className="text-secondary size-4" />
                  {f.slice(prefix.length).replace(/\/$/, '')}
                </button>
              ))}
            </div>
          )}

          {files.length === 0 ? (
            <p className="text-muted-foreground rounded-2xl border border-dashed px-6 py-10 text-center text-sm">
              {listing.folders.length === 0
                ? 'Empty folder — upload a file to create it.'
                : 'No files here.'}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {files.map((f) => (
                <Card key={f.url} className="overflow-hidden pt-0">
                  <div className="bg-muted relative aspect-square">
                    {/\.(mp4|webm|mov)$/i.test(f.pathname) ? (
                      <video
                        src={f.url}
                        className="size-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <Image
                        src={f.url}
                        alt={f.pathname}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="space-y-2">
                    <p
                      className="truncate text-xs"
                      title={f.pathname}
                    >
                      {f.pathname.slice(prefix.length)}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          void navigator.clipboard.writeText(f.url)
                          toast.success('URL copied')
                        }}
                      >
                        <Copy className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          if (!confirm(`Delete ${f.pathname}?`)) return
                          await deleteMedia(f.url)
                          await refresh()
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
