'use client'

import { useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'
import { CalendarClock, XCircle, CreditCard } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  cancelPurchase,
  reschedulePurchase,
  retryPayment,
} from '@/actions/purchase'
import {
  canModifyBooking,
  modificationDeadline,
} from '@/lib/booking-policy'
import type { PurchaseDTO } from '@/data/purchases'

function tomorrowISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function PurchaseActions({ purchase }: { purchase: PurchaseDTO }) {
  const t = useTranslations('purchases')
  const locale = useLocale()
  const router = useRouter()
  const [busy, startTransition] = useTransition()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [newDate, setNewDate] = useState('')

  const modifiable =
    purchase.status === 'confirmed' && canModifyBooking(purchase.chosenDate)

  const deadline = modificationDeadline(purchase.chosenDate)
  const deadlineStr = deadline.toLocaleString(
    locale === 'ar' ? 'ar-OM' : 'en-OM',
    { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Muscat' },
  )

  const onCancel = () =>
    startTransition(async () => {
      const result = await cancelPurchase({ purchaseId: purchase.id })
      if (result.ok) {
        setCancelOpen(false)
        toast.success(
          result.refund === 'refunded'
            ? t('cancelledRefunded')
            : result.refund === 'processing'
              ? t('cancelledRefundProcessing')
              : t('cancelled'),
        )
        router.refresh()
      } else {
        toast.error(result.error === 'too-late' ? t('tooLate') : t('actionFailed'))
        if (result.error === 'too-late' || result.error === 'conflict') {
          router.refresh()
        }
      }
    })

  const onReschedule = () =>
    startTransition(async () => {
      const result = await reschedulePurchase({
        purchaseId: purchase.id,
        newDate,
      })
      if (result.ok) {
        setRescheduleOpen(false)
        toast.success(t('rescheduled'))
        router.refresh()
      } else {
        toast.error(
          result.error === 'too-late'
            ? t('tooLate')
            : result.error === 'too-early'
              ? t('dateTooSoon')
              : t('actionFailed'),
        )
        if (result.error === 'too-late' || result.error === 'conflict') {
          router.refresh()
        }
      }
    })

  const onRetry = () =>
    startTransition(async () => {
      const result = await retryPayment({ purchaseId: purchase.id })
      if (result.ok) {
        window.location.assign(result.redirectUrl)
      } else {
        toast.error(
          result.error === 'too-early' ? t('tooLateToPay') : t('actionFailed'),
        )
        router.refresh()
      }
    })

  if (purchase.status === 'pending') {
    return (
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <Button size="sm" onClick={onRetry} disabled={busy}>
          <CreditCard className="size-4" /> {t('completePayment')}
        </Button>
        <p className="text-muted-foreground text-xs">{t('paymentPendingNote')}</p>
      </div>
    )
  }

  if (purchase.status !== 'confirmed') return null

  if (!modifiable) {
    return (
      <p className="text-muted-foreground text-xs">
        {t('deadlinePassed', { deadline: deadlineStr })}
      </p>
    )
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setNewDate('')
            setRescheduleOpen(true)
          }}
          disabled={busy}
        >
          <CalendarClock className="size-4" /> {t('reschedule')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={() => setCancelOpen(true)}
          disabled={busy}
        >
          <XCircle className="size-4" /> {t('cancel')}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        {t('deadlineNote', { deadline: deadlineStr })}
      </p>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('cancelConfirmTitle')}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            {purchase.paid ? t('cancelConfirmCard') : t('cancelConfirmCash')}
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelOpen(false)}
              disabled={busy}
            >
              {t('keepBooking')}
            </Button>
            <Button variant="destructive" onClick={onCancel} disabled={busy}>
              {t('confirmCancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('rescheduleTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor={`new-date-${purchase.id}`}>{t('newDate')}</Label>
            <Input
              id={`new-date-${purchase.id}`}
              type="date"
              min={tomorrowISO()}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRescheduleOpen(false)}
              disabled={busy}
            >
              {t('back')}
            </Button>
            <Button onClick={onReschedule} disabled={busy || !newDate}>
              {t('confirmReschedule')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
