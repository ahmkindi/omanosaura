import React, { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import useSWR from 'swr'
import { Product } from '../types/requests'

const Reviews = ({ product }: { product: Product }) => {
  const [page, setPage] = useState(1)
  const { data: reviews } = useSWR(`product/${product.id}/reviews?page=${page}`)

  return (
    <div>
      <h3>Customer Reviews</h3>
      <Rating
        initialValue={product.rating}
        allowFraction
        size={23}
        fillColor="var(--orange)"
        readonly
      />
    </div>
  )
}

export default Reviews
