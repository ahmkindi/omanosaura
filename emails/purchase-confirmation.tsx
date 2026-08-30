import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'
import { pick, type EmailLocale } from './i18n'

export type PurchaseEmailProps = {
  purchaseId: string
  name: string
  email: string
  productTitle: string
  paid: boolean
  chosenDate: string
  costOMR: string
  participants: number
  locale?: EmailLocale
}

const COPY = {
  en: {
    preview: (title: string) => `Your booking for ${title}`,
    thanks: (name: string) => `Thank you for your booking, ${name}!`,
    confirmed: 'Your booking for',
    confirmedTail: 'is confirmed.',
    date: 'Date',
    participants: 'Participants',
    total: 'Total',
    payment: 'Payment',
    paidOnline: 'Paid online',
    cashOnArrival: 'Cash on arrival',
    reference: 'Reference',
    policy:
      'Free cancellation and date changes are available until 24 hours before your trip day. Manage your booking any time from the Purchases page: https://omanosaura.com/purchases',
    questions:
      'If you have any questions, contact us at info@omanosaura.com. See you on the trail!',
    team: 'Omanosaura Team',
  },
  ar: {
    preview: (title: string) => `حجزك لرحلة ${title}`,
    thanks: (name: string) => `شكراً لحجزك، ${name}!`,
    confirmed: 'تم تأكيد حجزك لرحلة',
    confirmedTail: '.',
    date: 'التاريخ',
    participants: 'عدد المشاركين',
    total: 'الإجمالي',
    payment: 'الدفع',
    paidOnline: 'مدفوع إلكترونياً',
    cashOnArrival: 'نقداً عند الوصول',
    reference: 'رقم المرجع',
    policy:
      'تقدر تلغي أو تغيّر التاريخ مجاناً حتى 24 ساعة قبل يوم الرحلة، وتدير حجزك في أي وقت من صفحة مشترياتك: https://omanosaura.com/ar/purchases',
    questions:
      'لأي استفسار تواصل معنا على info@omanosaura.com. نشوفك على الدرب!',
    team: 'فريق عُمانوصورا',
  },
}

export default function PurchaseConfirmationEmail(props: PurchaseEmailProps) {
  const locale = props.locale ?? 'en'
  const t = pick(locale, COPY)
  return (
    <EmailShell preview={t.preview(props.productTitle)} locale={locale}>
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        {t.thanks(props.name)}
      </Text>
      <Text>
        {t.confirmed} <b>{props.productTitle}</b> {t.confirmedTail}
      </Text>
      <Text>
        <b>{t.date}:</b> {props.chosenDate}
        <br />
        <b>{t.participants}:</b> {props.participants}
        <br />
        <b>{t.total}:</b> {props.costOMR}
        <br />
        <b>{t.payment}:</b> {props.paid ? t.paidOnline : t.cashOnArrival}
        <br />
        <b>{t.reference}:</b> {props.purchaseId}
      </Text>
      <Text style={{ fontSize: 13, color: '#556' }}>{t.policy}</Text>
      <Text>{t.questions}</Text>
      <Text>{t.team}</Text>
    </EmailShell>
  )
}
