import 'server-only'
import { prisma } from '@/lib/db'
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
}

export async function getUserPurchases(userId: string): Promise<PurchaseDTO[]> {
  const purchases = await prisma.purchase.findMany({
    where: { userId, complete: true },
    include: {
      product: { select: { title: true, titleAr: true, photo: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return purchases.map((p) => ({
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
  }))
}

export type AdminPurchaseDTO = PurchaseDTO & {
  userName: string
  userEmail: string
  userPhone: string
}

export async function getAllPurchases(): Promise<AdminPurchaseDTO[]> {
  const purchases = await prisma.purchase.findMany({
    where: { complete: true },
    include: {
      product: { select: { title: true, titleAr: true, photo: true } },
      user: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { chosenDate: 'desc' },
  })
  return purchases.map((p) => ({
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
    userName: p.user.name,
    userEmail: p.user.email,
    userPhone: p.user.phone,
  }))
}
