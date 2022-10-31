import React from 'react'
import { Purchase } from '../types/requests'
import styles from '../styles/PurchaseCard.module.scss'
import useTranslation from 'next-translate/useTranslation'
import FlipCard from './FlipCard'
import ProductCard from './ProductCard'

const PurchaseCard = ({ purchase }: { purchase: Purchase }) => {
  const { t, lang } = useTranslation('purchases')

  return (
    <FlipCard
      front={
        <div className={styles.front}>
          <div>
            <p>{t('purchaseMade')}</p>
            <h4>{new Date(purchase.createdAt).toDateString()}</h4>
          </div>
          <div>
            <p>{t('tripDate')}</p>
            <h4>{new Date(purchase.chosenDate).toDateString()}</h4>
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
              }).format(purchase.priceBaisa / 1000)}
            </h4>
          </div>
        </div>
      }
      back={
        <ProductCard
          product={{ ...purchase, rating: 0, reviewCount: 0, ratingCount: 0 }}
        />
      }
    />
  )
}

export default PurchaseCard
