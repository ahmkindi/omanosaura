import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'
import { pick, type EmailLocale } from './i18n'

export type ReviewRequestProps = {
  name: string
  productTitle: string
  productUrl: string
  locale?: EmailLocale
}

const COPY = {
  en: {
    preview: (title: string) => `How was ${title}?`,
    heading: 'How was your adventure?',
    body: (name: string, title: string) =>
      `Hi ${name}, we hope you had a great time on ${title}! Your feedback helps other explorers find their next adventure.`,
    cta: (url: string) => `Leave a quick review here: ${url}`,
    thanks: 'Thank you for exploring Oman with us!',
    team: 'Omanosaura Team',
  },
  ar: {
    preview: (title: string) => `كيف كانت ${title}؟`,
    heading: 'كيف كانت مغامرتك؟',
    body: (name: string, title: string) =>
      `مرحباً ${name}، نتمنى إنك استانست في ${title}! تقييمك يساعد مستكشفين آخرين يلقون مغامرتهم الجاية.`,
    cta: (url: string) => `اترك تقييمك السريع هنا: ${url}`,
    thanks: 'شكراً لاستكشافك عُمان معنا!',
    team: 'فريق عُمانوصورا',
  },
}

export default function ReviewRequestEmail(props: ReviewRequestProps) {
  const locale = props.locale ?? 'en'
  const t = pick(locale, COPY)
  return (
    <EmailShell preview={t.preview(props.productTitle)} locale={locale}>
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        {t.heading}
      </Text>
      <Text>{t.body(props.name, props.productTitle)}</Text>
      <Text>{t.cta(props.productUrl)}</Text>
      <Text>{t.thanks}</Text>
      <Text>{t.team}</Text>
    </EmailShell>
  )
}
