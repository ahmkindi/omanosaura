export interface User {
  id: string
  email: string
  firstname: string
  lastname: string
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

export interface Product {
  id: string
  kind: ProductKind
  title: string
  titleAr: string
  subtitle: string
  subtitleAr: string
  description: string
  descriptionAr: string
  photo: string
  priceBaisa: number
  plannedDates: Date
  photos: string[]
  lastUpdated: Date
  longitude: number
  latitude: number
  rating: number
  ratingCount: number
}
