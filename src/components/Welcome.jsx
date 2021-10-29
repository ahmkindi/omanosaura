import { useTranslation } from 'react-i18next'
import styles from './welcome.module.scss'
import { BsInstagram } from 'react-icons/bs'

function Welcome() {
  const { t } = useTranslation()

  return (
    <div className={styles.welcomeBox}>
      <div className={styles.omanSlogan}>{t('omanSlogan')}</div>
      <div className={styles.contact}>{t('contact')}</div>
      <a
        className={styles.instaButton}
        href="https://www.instagram.com/jaifar96/"
      >
        <BsInstagram className={styles.instaIcon} />
      </a>
    </div>
  )
}

export default Welcome
