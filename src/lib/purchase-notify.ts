import 'server-only'
import { prisma } from '@/lib/db'
import { sendEmail, ADMIN_EMAIL } from '@/lib/email'
import { toDateString } from '@/data/serialize'
import { formatOMR } from '@/lib/price'
import { modificationDeadline, canModifyBooking } from '@/lib/booking-policy'
import { env } from '@/env'
import { asEmailLocale, type EmailLocale } from '../../emails/i18n'
import PurchaseConfirmationEmail from '../../emails/purchase-confirmation'
import PurchaseInternalEmail from '../../emails/purchase-internal'
import PurchaseCancelledEmail from '../../emails/purchase-cancelled'
import PurchaseRescheduledEmail from '../../emails/purchase-rescheduled'
import TripReminderEmail from '../../emails/trip-reminder'
import ReviewRequestEmail from '../../emails/review-request'
import BookingEventInternalEmail from '../../emails/booking-event-internal'
import RefundActionRequiredEmail from '../../emails/refund-action-required'

async function loadPurchase(purchaseId: string) {
  return prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      user: {
        select: { email: true, name: true, phone: true, locale: true },
      },
      product: { select: { title: true, titleAr: true, id: true } },
    },
  })
}

type LoadedPurchase = NonNullable<Awaited<ReturnType<typeof loadPurchase>>>

function commonDetails(purchase: LoadedPurchase) {
  const locale = asEmailLocale(purchase.user.locale)
  return {
    locale,
    name: purchase.user.name,
    email: purchase.user.email,
    productTitle:
      locale === 'ar' && purchase.product.titleAr
        ? purchase.product.titleAr
        : purchase.product.title,
    chosenDate: toDateString(purchase.chosenDate),
    costOMR: formatOMR(Number(purchase.costBaisa), locale),
    participants: purchase.numOfParticipants,
  }
}

/**
 * Sends the customer confirmation + internal notification for a purchase
 * (port of the legacy NotifyOfPurchase goroutine).
 */
export async function notifyOfPurchase(
  purchaseId: string,
  { customer = true, admin = true } = {},
) {
  try {
    const purchase = await loadPurchase(purchaseId)
    if (!purchase) return
    const d = commonDetails(purchase)

    const sends: Promise<void>[] = []
    if (customer) {
      sends.push(
        sendEmail({
          to: d.email,
          subject:
            d.locale === 'ar'
              ? `تأكيد الحجز ${purchaseId}`
              : `Booking confirmed ${purchaseId}`,
          react: PurchaseConfirmationEmail({
            purchaseId,
            paid: purchase.paid,
            ...d,
          }),
        }),
      )
    }
    if (admin) {
      sends.push(
        sendEmail({
          to: ADMIN_EMAIL,
          subject: `New Purchase: ${purchase.product.title}`,
          react: PurchaseInternalEmail({
            purchaseId,
            paid: purchase.paid,
            ...d,
            // Internal mail stays English regardless of the customer locale.
            locale: 'en' as EmailLocale,
            productTitle: purchase.product.title,
            costOMR: formatOMR(Number(purchase.costBaisa), 'en'),
          }),
        }),
      )
    }
    await Promise.all(sends)
  } catch (error) {
    console.error('notifyOfPurchase failed', error)
  }
}

export async function notifyOfCancellation(
  purchaseId: string,
  refund: 'none' | 'refunded' | 'processing',
) {
  try {
    const purchase = await loadPurchase(purchaseId)
    if (!purchase) return
    const d = commonDetails(purchase)

    await Promise.all([
      sendEmail({
        to: d.email,
        subject:
          d.locale === 'ar'
            ? `تم إلغاء الحجز ${purchaseId}`
            : `Booking cancelled ${purchaseId}`,
        react: PurchaseCancelledEmail({ purchaseId, refund, ...d }),
      }),
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `Booking cancelled: ${purchase.product.title}`,
        react: BookingEventInternalEmail({
          event: 'cancelled',
          purchaseId,
          productTitle: purchase.product.title,
          customerName: d.name,
          customerEmail: d.email,
          chosenDate: d.chosenDate,
          participants: d.participants,
          costOMR: formatOMR(Number(purchase.costBaisa), 'en'),
          paid: purchase.paid,
          refund,
          actor: purchase.cancelledBy === 'admin' ? 'admin' : 'user',
        }),
      }),
    ])
  } catch (error) {
    console.error('notifyOfCancellation failed', error)
  }
}

export async function notifyOfReschedule(purchaseId: string, oldDate: Date) {
  try {
    const purchase = await loadPurchase(purchaseId)
    if (!purchase) return
    const d = commonDetails(purchase)
    const oldDateStr = toDateString(oldDate)

    await Promise.all([
      sendEmail({
        to: d.email,
        subject:
          d.locale === 'ar'
            ? `تم تغيير موعد الحجز ${purchaseId}`
            : `Booking rescheduled ${purchaseId}`,
        react: PurchaseRescheduledEmail({
          purchaseId,
          oldDate: oldDateStr,
          newDate: d.chosenDate,
          ...d,
        }),
      }),
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `Booking rescheduled: ${purchase.product.title}`,
        react: BookingEventInternalEmail({
          event: 'rescheduled',
          purchaseId,
          productTitle: purchase.product.title,
          customerName: d.name,
          customerEmail: d.email,
          chosenDate: d.chosenDate,
          oldDate: oldDateStr,
          participants: d.participants,
          costOMR: formatOMR(Number(purchase.costBaisa), 'en'),
          paid: purchase.paid,
        }),
      }),
    ])
  } catch (error) {
    console.error('notifyOfReschedule failed', error)
  }
}

/** Formats the modification deadline in Muscat wall-clock time. */
function deadlineMuscat(chosenDate: Date): string {
  const deadline = modificationDeadline(chosenDate)
  const muscat = new Date(deadline.getTime() + 4 * 3_600_000)
  return `${muscat.toISOString().slice(0, 10)} ${muscat.toISOString().slice(11, 16)}`
}

export async function sendTripReminder(purchaseId: string) {
  const purchase = await loadPurchase(purchaseId)
  if (!purchase) return
  const d = commonDetails(purchase)

  await sendEmail({
    to: d.email,
    subject:
      d.locale === 'ar'
        ? `تذكير برحلتك: ${d.productTitle}`
        : `Reminder: your trip ${d.productTitle}`,
    react: TripReminderEmail({
      purchaseId,
      modifyDeadline: deadlineMuscat(purchase.chosenDate),
      canStillModify: canModifyBooking(purchase.chosenDate),
      ...d,
    }),
  })
}

export async function sendReviewRequest(purchaseId: string) {
  const purchase = await loadPurchase(purchaseId)
  if (!purchase) return
  const d = commonDetails(purchase)
  const prefix = d.locale === 'ar' ? '/ar' : ''

  await sendEmail({
    to: d.email,
    subject:
      d.locale === 'ar'
        ? `كيف كانت ${d.productTitle}؟`
        : `How was ${d.productTitle}?`,
    react: ReviewRequestEmail({
      name: d.name,
      productTitle: d.productTitle,
      productUrl: `${env.baseUrl}${prefix}/experiences/${purchase.product.id}`,
      locale: d.locale,
    }),
  })
}

export async function sendRefundActionRequired(purchaseId: string) {
  try {
    const purchase = await loadPurchase(purchaseId)
    if (!purchase) return

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: `ACTION REQUIRED — manual refund for ${purchaseId}`,
      react: RefundActionRequiredEmail({
        purchaseId,
        productTitle: purchase.product.title,
        customerName: purchase.user.name,
        customerEmail: purchase.user.email,
        customerPhone: purchase.user.phone,
        costOMR: formatOMR(Number(purchase.costBaisa), 'en'),
        thawaniPaymentId: purchase.thawaniPaymentId,
      }),
    })
  } catch (error) {
    console.error('sendRefundActionRequired failed', error)
  }
}
