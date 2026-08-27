'use client'

import { SafeImage } from '@/components/safe-image'
import { motion, useReducedMotion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatOMR } from '@/lib/price'
import { Button } from '@/components/ui/button'
import { Strata } from './strata'

const ease = [0.22, 1, 0.36, 1] as const

export type HeroTrip = {
  id: string
  title: string
  titleAr: string
  photo: string
  latitude: number
  longitude: number
  basePriceBaisa: number
}

function coord(lat: number, lng: number): string {
  return `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}`
}

/** Solid-marquee of live trips riding the bottom of the hero. */
function HeroTrips({ trips }: { trips: HeroTrip[] }) {
  const locale = useLocale()
  if (trips.length === 0) return null
  const doubled = [...trips, ...trips]

  return (
    <motion.div
      className="absolute inset-x-0 bottom-24 z-10 overflow-x-clip sm:bottom-28"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.15, ease }}
    >
      <div className="animate-marquee flex w-max gap-3 [animation-duration:70s]" dir="ltr">
        {doubled.map((trip, i) => (
          <Link
            key={`${trip.id}-${i}`}
            href={`/experiences/${trip.id}`}
            className="group flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-2 pe-4 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            <span className="relative block h-14 w-20 overflow-hidden rounded-xl">
              <SafeImage
                src={trip.photo}
                alt=""
                fill
                sizes="80px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </span>
            <span className="block">
              <span className="text-wadi block font-mono text-[10px] tracking-widest uppercase">
                {coord(trip.latitude, trip.longitude)}
              </span>
              <span className="block max-w-44 truncate text-sm font-semibold text-white">
                {locale === 'ar' && trip.titleAr ? trip.titleAr : trip.title}
              </span>
              <span className="text-secondary block font-mono text-xs font-semibold">
                {formatOMR(trip.basePriceBaisa, locale)}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}

export function Hero({ trips }: { trips: HeroTrip[] }) {
  const t = useTranslations('home')
  const tc = useTranslations('common')
  const reduced = useReducedMotion()

  const words = t('omanSlogan').split(' ')

  return (
    <section className="bg-night relative -mt-16 flex min-h-[100svh] items-end overflow-hidden sm:items-center">
      {/* Slow Ken Burns drift over the canyon — no video (source clips are
          vertical phone footage with burned-in captions). */}
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.12 }}
        animate={reduced ? undefined : { scale: 1 }}
        transition={{ duration: 16, ease: 'linear' }}
        style={{
          backgroundImage: 'url(/back-photo.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      />
      {/* Night-navy wash so the photo reads on-brand, plus a start-side
          scrim so the copy stays readable over bright water */}
      <div className="from-night/85 via-night/40 to-night/90 absolute inset-0 bg-gradient-to-b" />
      <div className="from-night/70 absolute inset-0 bg-gradient-to-r via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-24 pb-56 sm:pb-64">
        <motion.p
          className="text-wadi mb-4 font-mono text-xs tracking-[0.35em] uppercase sm:text-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          23.58°N 58.38°E · {tc('company')}
        </motion.p>

        <h1 className="font-display max-w-4xl text-5xl leading-[1.02] font-bold text-white uppercase sm:text-7xl lg:text-8xl">
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-1 align-top">
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.09, ease }}
              >
                {word}
                {' '}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-5 max-w-xl text-base text-white [text-shadow:0_1px_14px_rgba(2,20,40,0.8)] sm:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease }}
        >
          {t('introText')}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease }}
        >
          <Button
            asChild
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-7 text-base font-semibold shadow-lg shadow-black/25"
          >
            <Link href="/experiences">{t('contactText')}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-white/30 bg-white/5 px-7 text-base text-white backdrop-blur hover:bg-white/15 hover:text-white"
          >
            <Link href="/contact">{tc('contact')}</Link>
          </Button>
        </motion.div>
      </div>

      <HeroTrips trips={trips} />

      <Strata />
    </section>
  )
}
