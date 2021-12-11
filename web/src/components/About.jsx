import { useTranslation } from 'react-i18next'
import Jaifar from '../assets/jaifar.png'
import styles from './welcome.module.scss'
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from 'react-icons/ai'

const About = () => {
  const { t } = useTranslation()
  return (
    <div>
      <div className={styles.section}>
        <h3>{t('aboutCompany')}</h3>
        <h5>{t('companyDesc')}</h5>
      </div>
      <div className={styles.section}>
        <h3>{t('ourChamp')}</h3>
        <div style={{ display: 'flex' }}>
          <div className={styles.aboutCard}>
            <div className={styles.aboutCardImage}>
              <img src={Jaifar} alt="omanosaura founder Jaifar Al Kindi" />
            </div>
            <ul className={styles.socialIcons}>
              <li>
                <a href="/">
                  <AiOutlineInstagram />
                </a>
              </li>
              <li>
                <a href="/">
                  <AiOutlineFacebook />
                </a>
              </li>
              <li>
                <a href="/">
                  <AiOutlineTwitter />
                </a>
              </li>
            </ul>
            <div className={styles.details}>
              <h2>
                {t('jaifar')}
                <br />
                <span className={styles.jobTitle}>{t('jaifarTitle')}</span>
              </h2>
            </div>
          </div>
          <h5 style={{ maxWidth: '500px' }}>{t('jaifarDesc')}</h5>
        </div>
      </div>
    </div>
  )
}

export default About
