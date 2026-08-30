import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'
import { pick, type EmailLocale } from './i18n'

export type TripReminderProps = {
  purchaseId: string
  name: string
  productTitle: string
  chosenDate: string
  participants: number
  /** yyyy-MM-dd HH:mm (Muscat) after which changes are no longer possible. */
  modifyDeadline: string
  canStillModify: boolean
  locale?: EmailLocale
}

const COPY = {
  en: {
    preview: (title: string) => `Your trip ${title} is coming up`,
    heading: 'Your trip is coming up!',
    body: (name: string, title: string, date: string) =>
      `Hi ${name}, a friendly reminder that your booking for ${title} is on ${date}. We can't wait to see you!`,
    participants: 'Participants',
    reference: 'Reference',
    modify: (deadline: string) =>
      `If the date no longer suits you, you can reschedule or cancel free of charge until ${deadline} (Oman time) from your Purchases page: https://omanosaura.com/purchases`,
    noModify:
      'The free cancellation window for this booking has closed, so we are counting on you being there!',
    tips: 'Bring water, sun protection and comfortable shoes. If you have any questions, reply to this email or contact info@omanosaura.com.',
    team: 'Omanosaura Team',
  },
  ar: {
    preview: (title: string) => `رحلتك ${title} قريبة`,
    heading: 'رحلتك على الأبواب!',
    body: (name: string, title: string, date: string) =>
      `مرحباً ${name}، نذكّرك بأن حجزك لرحلة ${title} بتاريخ ${date}. متشوقين نشوفك!`,
    participants: 'عدد المشاركين',
    reference: 'رقم المرجع',
    modify: (deadline: string) =>
      `إذا ما عاد التاريخ يناسبك، تقدر تغيّر الموعد أو تلغي مجاناً حتى ${deadline} (بتوقيت عُمان) من صفحة مشترياتك: https://omanosaura.com/ar/purchases`,
    noModify: 'انتهت فترة الإلغاء المجاني لهذا الحجز، فنعتمد على حضورك!',
    tips: 'أحضر معك ماءً وواقياً من الشمس وحذاءً مريحاً. لأي استفسار راسلنا على info@omanosaura.com.',
    team: 'فريق عُمانوصورا',
  },
}

export default function TripReminderEmail(props: TripReminderProps) {
  const locale = props.locale ?? 'en'
  const t = pick(locale, COPY)
  return (
    <EmailShell preview={t.preview(props.productTitle)} locale={locale}>
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        {t.heading}
      </Text>
      <Text>{t.body(props.name, props.productTitle, props.chosenDate)}</Text>
      <Text>
        <b>{t.participants}:</b> {props.participants}
        <br />
        <b>{t.reference}:</b> {props.purchaseId}
      </Text>
      <Text>
        {props.canStillModify ? t.modify(props.modifyDeadline) : t.noModify}
      </Text>
      <Text style={{ fontSize: 13, color: '#556' }}>{t.tips}</Text>
      <Text>{t.team}</Text>
    </EmailShell>
  )
}
