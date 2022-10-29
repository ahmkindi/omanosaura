import Link from 'next/link'
import React from 'react'
import styles from '../styles/WhatWeOfferCard.module.scss'

const WhatWeOffer = ({ icon, text }: { icon: JSX.Element; text: string }) => {
  return (
    <Link href="/experiences" className={`${styles.card} ${styles.trips}`}>
      <div className={styles.overlay}></div>
      <div className={styles.circle}>{icon}</div>
      <p>{text}</p>
    </Link>
  )
}

export default WhatWeOffer
