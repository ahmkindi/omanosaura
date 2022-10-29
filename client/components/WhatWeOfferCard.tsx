import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import styles from '../styles/WhatWeOfferCard.module.scss'

const WhatWeOffer = ({
  icon,
  text,
  href,
}: {
  icon: JSX.Element
  text: string
  href: string
}) => {
  const { t } = useTranslation('home')

  return (
    <Link href={href} passHref>
      <div className={`${styles.card} ${styles.trips}`}>
        <div className={styles.overlay}></div>
        <div className={styles.circle}>{icon}</div>
        <p>{t(text)}</p>
      </div>
    </Link>
  )
}

export default WhatWeOffer
