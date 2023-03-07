import useTranslation from 'next-translate/useTranslation'
import React from 'react'

export const RatingWithCount = ({
  rating,
  ratingCount,
}: {
  rating: number
  ratingCount: number
}) => {
  const { t } = useTranslation('common')

  return (
    <div className="flex items-center justify-center align-center">
      <svg
        aria-hidden="true"
        className="w-5 h-5 text-yellow-400 mr-0"
        fill="var(--orange)"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Rating star</title>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
      </svg>
      <p
        className="ml-1 text-sm font-bold text-primary mb-0 p-0"
        style={{ fontSize: '0.9rem' }}
      >
        {rating ? rating.toFixed(2) : '-'}
      </p>
      <span className="w-1 h-1 mx-1.5 bg-secondary rounded-full"></span>
      <p
        className="text-sm font-medium text-primary p-0 m-0"
        style={{ fontWeight: '300', fontSize: '0.8rem' }}
      >
        {t('ratings', { ratingCount: ratingCount ?? 0 })}
      </p>
    </div>
  )
}
