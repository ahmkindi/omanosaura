import { useTranslation } from 'react-i18next'
import styles from './welcome.module.scss'
import hiker from '../assets/hiker.json'
import Lottie from 'react-lottie'
import { Button } from 'react-bootstrap'

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
  )
}

export default Welcome
