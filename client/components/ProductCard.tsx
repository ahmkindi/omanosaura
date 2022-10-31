import React from 'react'
import { Product, ProductKind } from '../types/requests'
import styles from '../styles/ProductCard.module.scss'
import { FaComment } from 'react-icons/fa'
import { BiTrip } from 'react-icons/bi'
import { GiMountainClimbing } from 'react-icons/gi'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { RatingWithCount } from './RatingWithCount'

const ProductCard = ({ product }: { product: Product }) => {
  const { lang } = useTranslation()
  const isAr = lang === 'ar'

  return (
    <div
      className={styles.container}
      style={{ background: `url(${product.photo})` }}
    >
      <div className={styles.profile}>
        <div className={styles.header}>
          <Link passHref href={`/experiences/${product.id}`}>
            <h2>{isAr ? product.titleAr : product.title}</h2>
          </Link>
          <RatingWithCount
            rating={product.rating}
            ratingCount={product.ratingCount}
          />
        </div>
        <p className={isAr ? styles.ar : undefined}>
          {isAr ? product.subtitleAr : product.subtitle}
        </p>
        <div className={styles.info}>
          <div>
            <FaComment
              style={isAr ? { marginLeft: '10px' } : { marginRight: '10px' }}
            />
            {product.ratingCount}
          </div>
          <div style={{ fontSize: '1.2rem' }}>
            {new Intl.NumberFormat(lang, {
              style: 'currency',
              currency: 'OMR',
            }).format(product.priceBaisa / 1000)}
          </div>
          {product.kind === ProductKind.trip ? (
            <BiTrip size={70} />
          ) : (
            <GiMountainClimbing size={70} />
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
