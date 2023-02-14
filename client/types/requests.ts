import { User } from 'firebase/auth'
import { getAfterTomorrow } from '../utils/dates'

export enum UserRole {
  admin = 'admin',
}

export interface Role {
  role: UserRole
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
  chosenDate: getAfterTomorrow(),
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

export interface UserPurchase extends Purchase, User {}

export const emptyProduct: ProductDetails = {
  kind: ProductKind.adventure,
  title: '',
  titleAr: '',
  subtitle: '',
  subtitleAr: '',
  description: '',
  descriptionAr: '',
  photo: '',
  priceBaisa: 1000,
  plannedDates: [],
  photos: [],
  lastUpdated: new Date(),
  longitude: 0,
  latitude: 0,
}

export interface BlogPreface {
  id: string
  userId: string
  firstname: string
  lastname: string
  title: string
  titleAr: string
  description: string
  descriptionAr: string
  photo: string
  createdAt: Date
}

export interface Blog extends BlogPreface {
  page: string
  pageAr: string
}

export const EmptyBlog: Blog = {
  id: '',
  userId: '00000000-0000-0000-0000-000000000000',
  firstname: '',
  lastname: '',
  title: '',
  titleAr: '',
  description: '',
  descriptionAr: '',
  photo: '',
  createdAt: new Date(),
  page: '',
  pageAr: '',
}
