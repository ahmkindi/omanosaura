import { useTranslation } from 'react-i18next'
import Jaifar from '../assets/jaifar.png'
import styles from './welcome.module.scss'

const About = () => {
  const { t } = useTranslation()

  return (
    <div>
      <div className={styles.section}>
        <h3>{t('aboutCompany')}</h3>
        <h5 style={{ margin: '0 0.5rem', textAlign: 'center' }}>
          {t('companyDesc')}
        </h5>
      </div>
      <div className={styles.section}>
        <h3>{t('ourChamp')}</h3>
        <div className={styles.welcomeBox}>
          <div>
            <img
              src={Jaifar}
              className={styles.aboutImg}
              alt="omanosaura founder Jaifar Al Kindi"
            />
          </div>
          <div className={styles.aboutText}>
            <h2>{t('jaifar')}</h2>
            <h4>{t('jaifarTitle')}</h4>
            <br />
            <h5>{t('jaifarDesc')}</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
