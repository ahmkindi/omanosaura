import { SafeImage } from '@/components/safe-image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Users, CalendarDays, CreditCard, Banknote } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { getUserPurchases, type PurchaseDTO } from '@/data/purchases'
import { redirect, Link } from '@/i18n/navigation'
import { formatOMR } from '@/lib/price'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PurchaseActions } from '@/components/purchases/purchase-actions'

const STATUS_VARIANT: Record<
  PurchaseDTO['status'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  confirmed: 'default',
  pending: 'secondary',
  cancelled: 'outline',
  refund_pending: 'secondary',
  refunded: 'outline',
  expired: 'outline',
}

export default async function PurchasesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const user = await getCurrentUser()
  if (!user) redirect({ href: '/?login=1', locale })

  const [t, tc, purchases] = await Promise.all([
    getTranslations('purchases'),
    getTranslations('common'),
    getUserPurchases(user!.id),
  ])

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-12">
      <h1 className="font-display text-3xl font-bold uppercase sm:text-4xl">{tc('purchases')}</h1>
      {purchases.length === 0 && (
        <p className="text-muted-foreground">{t('noPurchases')}</p>
      )}
      <div className="space-y-4">
        {purchases.map((p) => {
          const inactive = ['cancelled', 'refunded', 'expired'].includes(p.status)
          return (
            <Card key={p.id} className={inactive ? 'opacity-70' : undefined}>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href={`/experiences/${p.productId}`}
                  className="relative size-20 shrink-0 overflow-hidden rounded-lg"
                >
                  <SafeImage
                    src={p.productPhoto}
                    alt={p.productTitle}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/experiences/${p.productId}`}
                      className="truncate font-semibold hover:underline"
                    >
                      {locale === 'ar' && p.productTitleAr
                        ? p.productTitleAr
                        : p.productTitle}
                    </Link>
                    <Badge variant={STATUS_VARIANT[p.status]}>
                      {t(`status.${p.status}`)}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" /> {p.chosenDate}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3.5" /> {p.numOfParticipants}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {p.paid ? (
                        <CreditCard className="size-3.5" />
                      ) : (
                        <Banknote className="size-3.5" />
                      )}
                      {formatOMR(p.costBaisa, locale)}
                    </span>
                  </div>
                  {p.rescheduledFrom && (
                    <p className="text-muted-foreground text-xs">
                      {t('rescheduledFrom', { date: p.rescheduledFrom })}
                    </p>
                  )}
                </div>
                <PurchaseActions purchase={p} />
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
