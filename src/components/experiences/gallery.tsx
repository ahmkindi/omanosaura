'use client'

import { SafeImage } from '@/components/safe-image'
import { useCallback, useRef, useState } from 'react'
import { Expand } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

/**
 * Hero image + edge-to-edge snap filmstrip. The lightbox
 * (yet-another-react-lightbox) opens over ALL photos, hero included.
 */
export function ProductGallery({
  hero,
  photos,
  title,
  stripHeading,
}: {
  hero: string
  photos: string[]
  title: string
  stripHeading: string
}) {
  const slides = [hero, ...photos.filter((p) => p && p !== hero)]
  const [index, setIndex] = useState(-1)
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

  const strip = slides.slice(1)

  return (
    <>
      <button
        className="group relative block aspect-[16/9] w-full overflow-hidden rounded-xl"
        onClick={() => setIndex(0)}
        aria-label={`${title} 1/${slides.length}`}
      >
        <SafeImage
          src={hero}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute end-3 bottom-3 rounded-full bg-black/45 p-2 text-white opacity-80 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <Expand className="size-4" />
        </span>
      </button>

      {strip.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{stripHeading}</h2>
          <div className="relative">
            <div
              ref={stripRef}
              onScroll={onScroll}
              className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
            >
              {strip.map((src, i) => (
                <button
                  key={src}
                  className="relative aspect-[4/3] w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl sm:w-[46%] lg:w-[32%]"
                  onClick={() => setIndex(i + 1)}
                  aria-label={`${title} ${i + 2}/${slides.length}`}
                >
                  <SafeImage
                    src={src}
                    alt={`${title} ${i + 2}`}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 32vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </button>
              ))}
            </div>
            {strip.length > 1 && (
              <div className="mt-3 flex justify-center gap-1.5 sm:hidden" dir="ltr">
                {strip.map((_, i) => (
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
        </section>
      )}

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides.map((src) => ({ src, alt: title }))}
        plugins={[Zoom, Counter, Thumbnails]}
        counter={{ container: { style: { top: 0, direction: 'ltr' } } }}
        thumbnails={{ vignette: false, imageFit: 'cover' }}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          root: { backgroundColor: 'rgb(22 50 79 / 0.97)' },
          container: { backgroundColor: 'transparent' },
          thumbnailsContainer: { backgroundColor: 'transparent' },
          thumbnail: { backgroundColor: 'rgb(255 255 255 / 0.08)', border: 'none' },
        }}
      />
    </>
  )
}
