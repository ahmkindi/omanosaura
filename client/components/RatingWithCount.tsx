import React from 'react'
import { Rating } from 'react-simple-star-rating'

export const RatingWithCount = ({
  rating,
  ratingCount,
}: {
  rating: number
  ratingCount: number
}) => {
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
        initialValue={rating}
        allowFraction
        size={23}
        fillColor="var(--orange)"
        readonly
      />
      <div>{`( ${ratingCount} ratings )`}</div>
    </div>
  )
}
