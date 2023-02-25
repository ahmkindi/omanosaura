import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { Rating } from 'react-simple-star-rating'
import styles from '../styles/rating.module.scss'

export const RatingWithCount = ({
  rating,
  ratingCount,
}: {
  rating: number
  ratingCount: number
}) => {
  const { t } = useTranslation('common')

  return (
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
        className={styles.rating}
        initialValue={rating}
        allowFraction
        size={23}
        readonly
      />
      <div>{t('ratings', { ratingCount: ratingCount ?? 0 })}</div>
    </div>
  )
}
