import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React from 'react'
import styles from '../styles/WhatWeOfferCard.module.scss'

export interface WhatWeOfferProps {
  icon: JSX.Element
  title: string
  desc: string
  href: string
}

const WhatWeOffer = ({ icon, title, desc, href }: WhatWeOfferProps) => {
  const { t } = useTranslation('home')

  return (
    <Link href={href} passHref style={{ textDecoration: 'none' }}>
      <div className={`${styles.card} ${styles.trips}`}>
        <div className={styles.overlay}></div>
        <div className={styles.circle}>{icon}</div>
        <p>{t(title)}</p>
        <span>{t(desc)}</span>
      </div>
    </Link>
  )
}

export default WhatWeOffer
