import React from 'react'
import { Product, ProductKind } from '../types/requests'
import styles from '../styles/ProductCard.module.scss'
import { TbLetterA, TbLetterT } from 'react-icons/tb'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { RatingWithCount } from './RatingWithCount'

const ProductCard = ({ product }: { product: Product }) => {
  const { t, lang } = useTranslation('common')
  const isAr = lang === 'ar'

  return (
    <Link passHref href={`/experiences/${product.id}`}>
      <div
        className={styles.container}
        style={{ background: `url(${product.photo})` }}
      >
        <div className={styles.profile}>
          <h3 className="flex text-start h-12 text-xl">
            {isAr ? product.titleAr : product.title}
          </h3>
          <div className="flex w-100 justify-between mb-2">
            <p className="text-secondary">
              {isAr ? product.subtitleAr : product.subtitle}
            </p>
            {product.kind === ProductKind.trip ? (
              <TbLetterT
                className="border-2 border-primary mb-0 box-border"
                size={20}
              />
            ) : (
              <TbLetterA
                className="border-2 border-primary mb-0 box-border"
                size={20}
              />
            )}
          </div>
          <div className={styles.info}>
            <div>
              {t('pricePer4', {
                price: new Intl.NumberFormat(lang, {
                  style: 'currency',
                  currency: 'OMR',
                }).format(product.basePriceBaisa / 1000 ?? 0),
              })}
            </div>
            <div className="items-start">
              <RatingWithCount
                rating={product.rating}
                ratingCount={product.ratingCount}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
