import { useTranslation } from 'react-i18next'
import Jaifar from '../assets/jaifar.png'
import styles from './welcome.module.scss'
import {
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from 'react-icons/ai'
import { useContext } from 'react'
import LocaleContext from '../LocaleContext'

const About = () => {
  const { t } = useTranslation()
  const { locale } = useContext(LocaleContext)

  return (
    <div>
      <div className={styles.section}>
        <h3>{t('aboutCompany')}</h3>
        <h5>{t('companyDesc')}</h5>
      </div>
      <div className={styles.section}>
        <h3>{t('ourChamp')}</h3>
        <div className={styles.welcomeBox}>
          <div className={styles.aboutCard}>
            <div className={styles.aboutCardImage}>
              <img src={Jaifar} alt="omanosaura founder Jaifar Al Kindi" />
            </div>
            <ul className={styles.socialIcons}>
              <li>
                <a href="https://www.instagram.com/jaifar96/">
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
          <div>
            <h5 style={{ maxWidth: '500px' }}>{t('jaifarDesc')}</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
