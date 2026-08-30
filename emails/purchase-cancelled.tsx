import { Text } from '@react-email/components'
import { EmailShell, BRAND_PRIMARY } from './components'
import { pick, type EmailLocale } from './i18n'

export type PurchaseCancelledProps = {
  purchaseId: string
  name: string
  productTitle: string
  chosenDate: string
  costOMR: string
  refund: 'none' | 'refunded' | 'processing'
  locale?: EmailLocale
}

const COPY = {
  en: {
    preview: (title: string) => `Your booking for ${title} has been cancelled`,
    heading: 'Booking cancelled',
    body: (name: string) => `Hi ${name}, your booking has been cancelled.`,
    product: 'Experience',
    date: 'Date',
    reference: 'Reference',
    refundNone:
      'No payment was taken for this booking, so there is nothing to refund.',
    refundDone: (amount: string) =>
      `Your refund of ${amount} has been issued to your original payment method. Depending on your bank it can take 3 to 14 business days to appear.`,
    refundProcessing: (amount: string) =>
      `Your refund of ${amount} is being processed and will be returned to your original payment method. We will be in touch if we need anything from you.`,
    footer:
      'We hope to see you on another adventure soon. Questions? info@omanosaura.com',
    team: 'Omanosaura Team',
  },
  ar: {
    preview: (title: string) => `تم إلغاء حجزك لرحلة ${title}`,
    heading: 'تم إلغاء الحجز',
    body: (name: string) => `مرحباً ${name}، تم إلغاء حجزك.`,
    product: 'التجربة',
    date: 'التاريخ',
    reference: 'رقم المرجع',
    refundNone: 'لم يتم دفع أي مبلغ لهذا الحجز، لذا لا يوجد مبلغ لاسترجاعه.',
    refundDone: (amount: string) =>
      `تم استرجاع مبلغ ${amount} إلى وسيلة الدفع الأصلية. قد يستغرق ظهور المبلغ من 3 إلى 14 يوم عمل حسب البنك.`,
    refundProcessing: (amount: string) =>
      `جارٍ معالجة استرجاع مبلغ ${amount} إلى وسيلة الدفع الأصلية. سنتواصل معك إذا احتجنا أي شيء منك.`,
    footer: 'نتمنى نشوفك في مغامرة ثانية قريباً. للاستفسار: info@omanosaura.com',
    team: 'فريق عُمانوصورا',
  },
}

export default function PurchaseCancelledEmail(props: PurchaseCancelledProps) {
  const locale = props.locale ?? 'en'
  const t = pick(locale, COPY)
  const refundLine =
    props.refund === 'none'
      ? t.refundNone
      : props.refund === 'refunded'
        ? t.refundDone(props.costOMR)
        : t.refundProcessing(props.costOMR)
  return (
    <EmailShell preview={t.preview(props.productTitle)} locale={locale}>
      <Text style={{ color: BRAND_PRIMARY, fontSize: 20, fontWeight: 'bold' }}>
        {t.heading}
      </Text>
      <Text>{t.body(props.name)}</Text>
      <Text>
        <b>{t.product}:</b> {props.productTitle}
        <br />
        <b>{t.date}:</b> {props.chosenDate}
        <br />
        <b>{t.reference}:</b> {props.purchaseId}
      </Text>
      <Text>{refundLine}</Text>
      <Text>{t.footer}</Text>
      <Text>{t.team}</Text>
    </EmailShell>
  )
}
