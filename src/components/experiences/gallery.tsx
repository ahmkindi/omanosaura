'use client'

import { SafeImage } from '@/components/safe-image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

/**
 * Edge-to-edge snap filmstrip with a fullscreen swipeable lightbox.
 */
export function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const onScroll = useCallback(() => {
    const el = stripRef.current
    if (!el) return
    const children = Array.from(el.children) as HTMLElement[]
    const center = el.scrollLeft + el.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft + child.clientWidth / 2 - center)
      if (dist < bestDist) {
        bestDist = dist
        best = i
      }
    })
    setActive(best)
  }, [])

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => Math.min((o ?? 0) + 1, photos.length - 1))
      if (e.key === 'ArrowLeft') setOpen((o) => Math.max((o ?? 0) - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, photos.length])

  if (photos.length === 0) return null

  return (
    <>
      <div className="relative">
        <div
          ref={stripRef}
          onScroll={onScroll}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
        >
          {photos.map((src, i) => (
            <button
              key={src}
              className="relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[46%] lg:w-[32%]"
              onClick={() => setOpen(i)}
              aria-label={`${title} ${i + 1}/${photos.length}`}
            >
              <SafeImage
                src={src}
                alt={`${title} ${i + 1}`}
                fill
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 32vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          ))}
        </div>
        {photos.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5 sm:hidden" dir="ltr">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`size-1.5 rounded-full transition-colors ${
                  i === active ? 'bg-secondary' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="bg-night/95 fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <button
              className="absolute top-4 end-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              onClick={() => setOpen(null)}
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <span className="absolute top-5 start-5 font-mono text-sm text-white/70">
              {open + 1} / {photos.length}
            </span>

            {open > 0 && (
              <button
                className="absolute left-3 z-10 hidden rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:block"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(open - 1)
                }}
                aria-label="Previous"
              >
                <ChevronLeft className="size-6" />
              </button>
            )}
            {open < photos.length - 1 && (
              <button
                className="absolute right-3 z-10 hidden rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:block"
                onClick={(e) => {
                  e.stopPropagation()
                  setOpen(open + 1)
                }}
                aria-label="Next"
              >
                <ChevronRight className="size-6" />
              </button>
            )}

            <motion.div
              key={open}
              className="relative h-[80svh] w-[94vw] sm:w-[86vw]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -70 && open < photos.length - 1) setOpen(open + 1)
                else if (info.offset.x > 70 && open > 0) setOpen(open - 1)
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage
                src={photos[open]}
                alt={`${title} ${open + 1}`}
                fill
                sizes="94vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
