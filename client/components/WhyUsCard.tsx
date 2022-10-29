import useTranslation from 'next-translate/useTranslation'
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
  const { t } = useTranslation('home')

  return (
    <div className={styles.card}>
      {icon}
      <h3>{t(header)}</h3>
      <p>{t(desc)}</p>
    </div>
  )
}

export default WhyUsCard
