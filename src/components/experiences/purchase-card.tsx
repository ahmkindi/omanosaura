'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { Info } from 'lucide-react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { purchaseProduct } from '@/actions/purchase'
import { computeCostBaisa } from '@/lib/pricing'
import { formatOMR } from '@/lib/price'
import { useSessionUser } from '@/components/layout/use-session-user'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type PurchaseCardProduct = {
  id: string
  title: string
  basePriceBaisa: number
  extraPriceBaisa: number
  pricePer: number
  plannedDates: string[]
}

function tomorrowISO(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export function PurchaseCard({ product }: { product: PurchaseCardProduct }) {
  const t = useTranslations('experiences')
  const tc = useTranslations('common')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useSessionUser()

  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [chosenDate, setChosenDate] = useState('')
  const [payExtra, setPayExtra] = useState(false)
  const [method, setMethod] = useState<'card' | 'cash'>('card')
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)

  const minDate = tomorrowISO()
  const upcomingShared = product.plannedDates.filter((d) => d >= minDate)

  const total = useMemo(
    () =>
      computeCostBaisa({
        quantity,
        basePriceBaisa: product.basePriceBaisa,
        extraPriceBaisa: product.extraPriceBaisa,
        pricePer: product.pricePer,
        payExtra,
      }),
    [quantity, payExtra, product],
  )

  const openDialog = () => {
    if (!user) {
      const params = new URLSearchParams(searchParams)
      params.set('login', '1')
      router.push(`${pathname}?${params.toString()}` as never)
      return
    }
    setOpen(true)
  }

  const submit = async () => {
    setBusy(true)
    const result = await purchaseProduct({
      productId: product.id,
      quantity,
      chosenDate,
      cash: method === 'cash',
      payExtra,
    })
    setBusy(false)
    if (!result.ok) {
      toast.error(t('failedPurchase'))
      return
    }
    if (result.cash) {
      toast.success(t('successfulPurchase'))
      setOpen(false)
    } else {
      window.location.assign(result.redirectUrl)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {product.pricePer === 1
            ? tc('pricePer.single', {
                price: formatOMR(product.basePriceBaisa, locale),
              })
            : tc('pricePer.multi', {
                price: formatOMR(product.basePriceBaisa, locale),
                people: product.pricePer,
              })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingShared.length > 0 && (
          <div className="space-y-2">
            <p className="text-muted-foreground text-xs">{t('explainGreen')}</p>
            <div className="flex flex-wrap gap-1.5">
              {upcomingShared.map((d) => (
                <Badge
                  key={d}
                  variant="outline"
                  className="cursor-pointer border-green-600 text-green-700"
                  onClick={() => {
                    setChosenDate(d)
                    openDialog()
                  }}
                >
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <p className="text-muted-foreground flex items-start gap-1.5 text-xs">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          {t('cancelPolicy')}
        </p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" onClick={openDialog}>
          {t('purchase')}
        </Button>
      </CardFooter>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t('purchaseTitle', { product: product.title })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qty">{t('numOfParticipants')}</Label>
              <Input
                id="qty"
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">{t('chosenDate')}</Label>
              <Input
                id="date"
                type="date"
                min={minDate}
                value={chosenDate}
                onChange={(e) => setChosenDate(e.target.value)}
                className={
                  upcomingShared.includes(chosenDate)
                    ? 'border-green-600'
                    : undefined
                }
              />
              <p className="text-muted-foreground text-xs">{t('cancelPolicy')}</p>
            </div>
            {product.extraPriceBaisa > 0 && (
              <label className="flex items-start gap-2 text-sm">
                <Checkbox
                  checked={payExtra}
                  onCheckedChange={(v) => setPayExtra(v === true)}
                />
                {t('payExtra', {
                  price: formatOMR(product.extraPriceBaisa, locale),
                })}
              </label>
            )}
            <div className="space-y-2">
              <Label>{t('payCash')}</Label>
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as 'card' | 'cash')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">{t('card')}</SelectItem>
                  <SelectItem value="cash">{t('cash')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="font-semibold">
              {t('totalPrice')} {formatOMR(total, locale)}
            </p>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={accepted}
                onCheckedChange={(v) => setAccepted(v === true)}
              />
              <span>
                {t('byPurchasing')}{' '}
                <Link
                  href="/terms"
                  target="_blank"
                  className="underline"
                  rel="noreferrer"
                >
                  {t('readTerms')}
                </Link>
              </span>
            </label>
            <Button
              className="w-full"
              disabled={busy || !chosenDate || !accepted}
              onClick={submit}
            >
              {t('purchase')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
