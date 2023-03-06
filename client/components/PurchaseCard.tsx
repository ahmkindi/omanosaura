import React from 'react'
import { Product, Purchase } from '../types/requests'
import styles from '../styles/PurchaseCard.module.scss'
import useTranslation from 'next-translate/useTranslation'
import FlipCard from './FlipCard'
import ProductCard from './ProductCard'
import useSWR from 'swr'
import { fetcher } from '../utils/axiosServer'

const PurchaseCard = ({ purchase }: { purchase: Purchase }) => {
  const { t, lang } = useTranslation('purchases')
  const { data: product } = useSWR(`products/${purchase.productId}`, fetcher<Product>)

  return (
    <FlipCard
      front={
        <div className={styles.front}>
          <div>
            <p>{t('purchaseMade')}</p>
            <h4>{new Date(purchase.createdAt).toLocaleDateString()}</h4>
          </div>
          <div>
            <p>{t('tripDate')}</p>
            <h4>{new Date(purchase.chosenDate).toLocaleDateString()}</h4>
          </div>
          <div>
            <p>{t('numOfParticipants')}</p>
            <h4>{purchase.numOfParticipants}</h4>
          </div>
          <div>
            <p>{t('totalPrice')}</p>
            <h4>
              {new Intl.NumberFormat(lang, {
                style: 'currency',
                currency: 'OMR',
              }).format(purchase.costBaisa / 1000)}
            </h4>
          </div>
        </div>
      }
      back={
        <ProductCard
          product={{
            ...purchase,
            rating: product?.rating ?? 0,
            reviewCount: product?.reviewCount ?? 0,
            ratingCount: product?.ratingCount ?? 0,
            id: purchase.productId,
          }}
        />
      }
    />
  )
}

export default PurchaseCard
