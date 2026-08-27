import Image, { type ImageProps } from 'next/image'

const FALLBACK = '/back-photo.jpg'

/**
 * next/image wrapper for legacy free-text photo URLs: falls back when the
 * stored URL is empty and skips optimization for GIFs (the optimizer rejects
 * many remote GIFs).
 */
export function SafeImage({ src, ...props }: ImageProps) {
  const url = typeof src === 'string' && src.trim() !== '' ? src : FALLBACK
  const unoptimized =
    typeof url === 'string' && url.toLowerCase().split('?')[0].endsWith('.gif')
  return <Image src={url} unoptimized={unoptimized} {...props} />
}
