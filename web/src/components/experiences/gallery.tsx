'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [open, setOpen] = useState<string | null>(null)

  if (photos.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src) => (
          <button
            key={src}
            className="relative aspect-square overflow-hidden rounded-lg"
            onClick={() => setOpen(src)}
          >
            <Image
              src={src}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform hover:scale-105"
            />
          </button>
        ))}
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {open && (
            <Image
              src={open}
              alt={title}
              width={1200}
              height={800}
              className="h-auto w-full rounded-md object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
