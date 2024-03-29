import React from 'react'
import { Product } from '../types/requests'
import styles from '../styles/ProductCard.module.scss'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { RatingWithCount } from './RatingWithCount'

const ProductCard = ({ product }: { product: Product }) => {
  const { t, lang } = useTranslation('common')
  const isAr = lang === 'ar'

  const price = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: 'OMR',
    maximumFractionDigits: 1,
  }).format(product.basePriceBaisa / 1000 ?? 0)

  return (
    <Link passHref href={`/experiences/${product.id}`}>
      <div
        className={styles.container}
        style={{ background: `url(${product.photo})` }}
      >
        <div className={styles.profile}>
          <h3>{isAr ? product.titleAr : product.title}</h3>
          <p className="text-secondary font-bold">
            {isAr ? product.subtitleAr : product.subtitle}
          </p>
          <p className="text-secondary text-sm">
            {t(`productkind.${product.kind}.title`)}
          </p>
          <div className={styles.info}>
            <div>
              {t(
                `pricePer.${
                  product.pricePer === 1
                    ? 'single'
                    : product.pricePer === 2
                    ? 'duo'
                    : 'multi'
                }`,
                {
                  price: price,
                  people: product.pricePer,
                }
              )}
            </div>
            <RatingWithCount
              rating={product.rating}
              ratingCount={product.ratingCount}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
