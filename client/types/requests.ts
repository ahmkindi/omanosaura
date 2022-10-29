import { getTomorrow } from '../utils/dates'

export interface User {
  id: string
  email: string
  firstname: string
  lastname: string
  phone: string
}

export interface EmailForm {
  name: string
  email: string
  subject: string
  message: string
}

export const EmptyEmailForm: EmailForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export enum ProductKind {
  trip = 'trip',
  adventure = 'adventure',
}

export interface ProductDetails {
  kind: ProductKind
  title: string
  titleAr: string
  subtitle: string
  subtitleAr: string
  description: string
  descriptionAr: string
  photo: string
  priceBaisa: number
  plannedDates: Date[]
  photos: string[]
  lastUpdated: Date
  longitude: number
  latitude: number
}

export interface Product extends ProductDetails {
  id: string
  rating: number
  ratingCount: number
  reviewCount: number
}

export interface Review {
  productId: string
  userId: string
  rating: number
  title: string
  review: string
  lastUpdated: Date
  firstname: string
  lastname: string
}

export interface UserReview {
  rating: number
  title: string
  review: string
}

export const emptyUserReview: UserReview = {
  rating: 5,
  title: '',
  review: '',
}

export interface PurchaseProduct {
  proudctId: string
  quantity: number
  chosenDate: Date
  cash: boolean
}

export const emptyPurchaseProduct: PurchaseProduct = {
  proudctId: '',
  quantity: 1,
  chosenDate: getTomorrow(),
  cash: false,
}

export interface Purchase extends ProductDetails {
  id: string
  productId: string
  numOfParticipants: number
  paid: boolean
  costBaisa: number
  chosenDate: Date
  createdAt: Date
}
