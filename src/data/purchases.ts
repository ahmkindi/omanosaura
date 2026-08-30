import 'server-only'
import { prisma } from '@/lib/db'
import type { PurchaseStatus } from '@/generated/prisma/client'
import { toDateString } from './serialize'

export type PurchaseDTO = {
  id: string
  productId: string
  productTitle: string
  productTitleAr: string
  productPhoto: string
  numOfParticipants: number
  paid: boolean
  costBaisa: number
  chosenDate: string
  createdAt: string
  extraPriceChosen: boolean
  status: PurchaseStatus
  rescheduledFrom: string | null
}

function toDTO(p: {
  id: string
  productId: string
  product: { title: string; titleAr: string; photo: string }
  numOfParticipants: number
  paid: boolean
  costBaisa: bigint
  chosenDate: Date
  createdAt: Date
  extraPriceChosen: boolean
  status: PurchaseStatus
  rescheduledFrom: Date | null
}): PurchaseDTO {
  return {
    id: p.id,
    productId: p.productId,
    productTitle: p.product.title,
    productTitleAr: p.product.titleAr,
    productPhoto: p.product.photo,
    numOfParticipants: p.numOfParticipants,
    paid: p.paid,
    costBaisa: Number(p.costBaisa),
    chosenDate: toDateString(p.chosenDate),
    createdAt: toDateString(p.createdAt),
    extraPriceChosen: p.extraPriceChosen,
    status: p.status,
    rescheduledFrom: p.rescheduledFrom ? toDateString(p.rescheduledFrom) : null,
  }
}

export async function getUserPurchases(userId: string): Promise<PurchaseDTO[]> {
  const purchases = await prisma.purchase.findMany({
    // Expired checkouts are noise; everything else (incl. pending payments
    // and cancellations) stays visible to the customer.
    where: { userId, status: { not: 'expired' } },
    include: {
      product: { select: { title: true, titleAr: true, photo: true } },
    },
    orderBy: [{ chosenDate: 'desc' }, { createdAtTs: 'desc' }],
  })
  const active = purchases.filter((p) =>
    ['confirmed', 'pending'].includes(p.status),
  )
  const inactive = purchases.filter(
    (p) => !['confirmed', 'pending'].includes(p.status),
  )
  return [...active, ...inactive].map(toDTO)
}

export type AdminPurchaseDTO = PurchaseDTO & {
  userName: string
  userEmail: string
  userPhone: string
  thawaniPaymentId: string | null
  cancelledAt: string | null
  cancelledBy: string | null
}

export async function getAllPurchases(): Promise<AdminPurchaseDTO[]> {
  const purchases = await prisma.purchase.findMany({
    include: {
      product: { select: { title: true, titleAr: true, photo: true } },
      user: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { chosenDate: 'desc' },
  })
  return purchases.map((p) => ({
    ...toDTO(p),
    userName: p.user.name,
    userEmail: p.user.email,
    userPhone: p.user.phone,
    thawaniPaymentId: p.thawaniPaymentId,
    cancelledAt: p.cancelledAt ? p.cancelledAt.toISOString() : null,
    cancelledBy: p.cancelledBy,
  }))
}
