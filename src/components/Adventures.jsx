import styles from './trips.module.scss'
import { useTranslation } from 'react-i18next'

const Adventures = () => {
  const { t } = useTranslation()
  const cards = []
  for (let i = 1; i <= 10; i++) {
    cards.push({
      title: t(`adv${i}`),
      copy: t(`adv${i}Desc`),
      button: t('contact'),
    })
  }
  return (
    <div className={styles.advContainer}>
      {cards.map((card) => (
        <div className={styles.card}>
          <div className={styles.content}>
            <h2 className={styles.title}>{card.title}</h2>
            <p className={styles.copy}>{card.copy}</p>
            <button className={styles.btn}>{card.button}</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Adventures
