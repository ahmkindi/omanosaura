import React from 'react'
import styles from '../styles/WhyUsCard.module.scss'

const WhyUsCard = ({
  icon,
  header,
  desc,
}: {
  icon: JSX.Element
  header: string
  desc: string
}) => {
  return (
    <div className={styles.card}>
      {icon}
      <h3>{header}</h3>
      <p>{desc}</p>
    </div>
  )
}

export default WhyUsCard
