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
    <Link passHref href={`/experiences/${product.id}`}>
      <div
        className={styles.container}
        style={{ background: `url(${product.photo})` }}
      >
        <div className={styles.profile}>
          <div className={styles.header}>
            <h2>{isAr ? product.titleAr : product.title}</h2>
            <RatingWithCount
              rating={product.rating}
              ratingCount={product.ratingCount}
            />
          </div>
          <p className={isAr ? styles.ar : undefined}>
            {isAr ? product.subtitleAr : product.subtitle}
          </p>
          <div className={styles.info}>
            <div className="flex items-center">
              <FaComment
                style={isAr ? { marginLeft: '10px' } : { marginRight: '10px' }}
              />
              {product.ratingCount}
            </div>
            <div>
              {new Intl.NumberFormat(lang, {
                style: 'currency',
                currency: 'OMR',
              }).format(product.basePriceBaisa / 1000 ?? 0)}
            </div>
            {product.kind === ProductKind.trip ? (
              <BiTrip size={65} />
            ) : (
              <GiMountainClimbing size={65} />
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
