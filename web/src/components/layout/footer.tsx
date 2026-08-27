import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Camera, Mail, Phone } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const NAV_LINKS = ['experiences', 'blogs', 'about', 'contact'] as const

export async function Footer() {
  const t = await getTranslations('common')

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div className="space-y-3">
          <Image
            src="/simple_logo.svg"
            alt="Omanosaura"
            width={56}
            height={56}
            className="brightness-0 invert"
          />
          <p className="text-sm opacity-80">{t('description')}</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          {NAV_LINKS.map((key) => (
            <Link
              key={key}
              href={`/${key}` as never}
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-sm">
          <a
            href="mailto:admin@omanosaura.com"
            className="flex items-center gap-2 opacity-80 hover:opacity-100"
          >
            <Mail className="size-4" /> admin@omanosaura.com
          </a>
          <a
            href="https://wa.me/0096895598840"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 opacity-80 hover:opacity-100"
          >
            <Phone className="size-4" /> WhatsApp
          </a>
          <a
            href="https://www.instagram.com/omanosaura/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 opacity-80 hover:opacity-100"
          >
            <Camera className="size-4" /> Instagram
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Omanosaura
      </div>
    </footer>
  )
}
