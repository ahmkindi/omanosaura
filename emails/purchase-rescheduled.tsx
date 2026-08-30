import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'
import { pick, type EmailLocale } from './i18n'

export type PurchaseRescheduledProps = {
  purchaseId: string
  name: string
  productTitle: string
  oldDate: string
  newDate: string
  participants: number
  locale?: EmailLocale
}

const COPY = {
  en: {
    preview: (title: string) => `Your booking for ${title} has a new date`,
    heading: 'Booking rescheduled',
    body: (name: string) =>
      `Hi ${name}, the date of your booking has been changed.`,
    product: 'Experience',
    oldDate: 'Previous date',
    newDate: 'New date',
    participants: 'Participants',
    reference: 'Reference',
    policy:
      'You can still cancel or change the date until 24 hours before your trip day from the Purchases page: https://omanosaura.com/purchases',
    team: 'Omanosaura Team',
  },
  ar: {
    preview: (title: string) => `تم تغيير موعد حجزك لرحلة ${title}`,
    heading: 'تم تغيير موعد الحجز',
    body: (name: string) => `مرحباً ${name}، تم تغيير تاريخ حجزك.`,
    product: 'التجربة',
    oldDate: 'التاريخ السابق',
    newDate: 'التاريخ الجديد',
    participants: 'عدد المشاركين',
    reference: 'رقم المرجع',
    policy:
      'لا زال تقدر تلغي أو تغيّر التاريخ حتى 24 ساعة قبل يوم الرحلة من صفحة مشترياتك: https://omanosaura.com/ar/purchases',
    team: 'فريق عُمانوصورا',
  },
}

export default function PurchaseRescheduledEmail(
  props: PurchaseRescheduledProps,
) {
  const locale = props.locale ?? 'en'
  const t = pick(locale, COPY)
  return (
    <EmailShell preview={t.preview(props.productTitle)} locale={locale}>
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        {t.heading}
      </Text>
      <Text>{t.body(props.name)}</Text>
      <Text>
        <b>{t.product}:</b> {props.productTitle}
        <br />
        <b>{t.oldDate}:</b> {props.oldDate}
        <br />
        <b>{t.newDate}:</b> {props.newDate}
        <br />
        <b>{t.participants}:</b> {props.participants}
        <br />
        <b>{t.reference}:</b> {props.purchaseId}
      </Text>
      <Text style={{ fontSize: 13, color: '#556' }}>{t.policy}</Text>
      <Text>{t.team}</Text>
    </EmailShell>
  )
}
