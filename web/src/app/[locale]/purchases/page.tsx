import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Users, CalendarDays, CreditCard, Banknote } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { getUserPurchases } from '@/data/purchases'
import { redirect, Link } from '@/i18n/navigation'
import { formatOMR } from '@/lib/price'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
      <h1 className="text-3xl font-bold">{tc('purchases')}</h1>
      {purchases.length === 0 && (
        <p className="text-muted-foreground">{t('noPurchases')}</p>
      )}
      <div className="space-y-4">
        {purchases.map((p) => (
          <Link
            key={p.id}
            href={`/experiences/${p.productId}`}
            className="block"
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={p.productPhoto}
                    alt={p.productTitle}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate font-semibold">
                    {locale === 'ar' && p.productTitleAr
                      ? p.productTitleAr
                      : p.productTitle}
                  </p>
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
                </div>
                <Badge variant={p.paid ? 'default' : 'secondary'}>
                  {p.paid ? t('paid?') : '💵'}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}
