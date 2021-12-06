import { useTranslation } from 'react-i18next'
import styles from './welcome.module.scss'
import hiker from '../assets/hiker.json'
import Lottie from 'react-lottie'
import { Button } from 'react-bootstrap'
import { ReactComponent as TripsIcon } from '../assets/location.svg'
import { ReactComponent as AdventuresIcon } from '../assets/adventurer.svg'

const hikerOptions = {
  loop: true,
  autoplay: true,
  animationData: hiker,
  renderSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

function Welcome() {
  const { t } = useTranslation()

  return (
    <>
      <div className={styles.welcomeBox}>
        <div>
          <div className={styles.omanSlogan}>{t('omanSlogan')}</div>
          <div className={styles.contact}>{t('introText')}</div>
          <Button>{t('contactText')}</Button>
        </div>
        <div>
          <Lottie options={hikerOptions} width={400} height={400} />
        </div>
      </div>
      <div className={`${styles.section} ${styles.services}`}>
        <h3>{t('services')}</h3>
        <div>
          <a href="/trips" className={`${styles.card} ${styles.trips}`}>
            <div className={styles.overlay}></div>
            <div className={styles.circle}>
              <TripsIcon />
            </div>
            <p>Trips</p>
          </a>
          <a href="/adventures" className={`${styles.card} ${styles.trips}`}>
            <div className={styles.overlay}></div>
            <div className={styles.circle}>
              <AdventuresIcon />
            </div>
            <p>Adventures</p>
          </a>
        </div>
      </div>
      <div className={`${styles.section} ${styles.whyus}`}>
        <h3>{t('whyUs')}</h3>
      </div>
      <div className={styles.section}>
        <h3>{t('reviews')}</h3>
      </div>
    </>
  )
}

export default Welcome
