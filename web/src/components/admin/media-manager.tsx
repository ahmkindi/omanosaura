'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { Copy, Loader2, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { deleteMedia, listMedia, type BlobFile } from '@/actions/admin/media'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function MediaManager() {
  const [files, setFiles] = useState<BlobFile[] | null>(null)
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const refresh = () => listMedia().then(setFiles)
  useEffect(() => {
    void refresh()
  }, [])

  const onUpload = async (selected: FileList | null) => {
    if (!selected?.length) return
    setBusy(true)
    try {
      for (const file of Array.from(selected)) {
        await upload(file.name, file, {
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

  return (
    <div className="space-y-6" dir="ltr">
      <div className="flex items-center gap-3">
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
          Upload
        </Button>
      </div>

      {files === null ? (
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
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
                <p className="truncate text-xs" title={f.pathname}>
                  {f.pathname}
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
    </div>
  )
}
