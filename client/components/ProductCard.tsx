import React from 'react'
import { Product, ProductKind } from '../types/requests'
import styles from '../styles/ProductCard.module.scss'
import { FaComment } from 'react-icons/fa'
import { BiTrip } from 'react-icons/bi'
import { GiMountainClimbing } from 'react-icons/gi'
import { BsCashCoin } from 'react-icons/bs'
import useTranslation from 'next-translate/useTranslation'
import { Rating } from 'react-simple-star-rating'
import Link from 'next/link'

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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '0.9rem',
            }}
          >
            <Rating
              initialValue={product.rating}
              allowFraction
              size={23}
              fillColor="var(--orange)"
              readonly
            />
            <div>{`( ${product.ratingCount} ratings )`}</div>
          </div>
        </div>
        <p>{isAr ? product.subtitleAr : product.subtitle}</p>
        <div className={styles.info}>
          <div>
            <FaComment style={{ marginRight: '10px' }} />
            {product.ratingCount}
          </div>
          <div>
            <BsCashCoin style={{ marginRight: '10px' }} />
            {`${product.priceBaisa * 1000} omr`}
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
