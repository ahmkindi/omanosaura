import { useTranslation } from 'react-i18next'
import styles from './welcome.module.scss'
import hiker from '../assets/hiker.json'
import Lottie from 'react-lottie'
import { Button } from 'react-bootstrap'
import { ReactComponent as TripsIcon } from '../assets/location.svg'
import { ReactComponent as AdventuresIcon } from '../assets/adventurer.svg'
import { MdGroups as WhyUsIcon1 } from 'react-icons/md'
import { HiSparkles as WhyUsIcon2 } from 'react-icons/hi'
import { AiOutlineSafetyCertificate as WhyUsIcon3 } from 'react-icons/ai'
import { useContext, useState } from 'react'
import LocaleContext from '../LocaleContext'
import Events from './Events'
import { useNavigate } from 'react-router-dom'
import Switch from 'react-switch'

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
  const { locale } = useContext(LocaleContext)
  const navigate = useNavigate()
  const [translate, setTranslate] = useState(false)

  return (
    <>
      <div className={styles.welcomeBox}>
        <div>
          <div className={styles.omanSlogan}>{t('omanSlogan')}</div>
          <div className={styles.contact}>{t('introText')}</div>
          <Button
            className={styles.myButton}
            onClick={() => navigate('/contact')}
          >
            {t('contactText')}
          </Button>
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
            <p>{t('trips')}</p>
          </a>
          <a href="/adventures" className={`${styles.card} ${styles.trips}`}>
            <div className={styles.overlay}></div>
            <div className={styles.circle}>
              <AdventuresIcon />
            </div>
            <p>{t('adventures')}</p>
          </a>
        </div>
      </div>
      <Events />
      <div className={`${styles.section} ${styles.whyUs}`}>
        <h3>{t('whyUs')}</h3>
        <div>
          <div className={styles.whyUsCards}>
            <WhyUsIcon1 size={75} />
            <h3>{t(`whyUsTitle1`)}</h3>
            <p>{t(`whyUsDesc1`)}</p>
          </div>
          <div>
            <WhyUsIcon2 size={75} />
            <h3>{t(`whyUsTitle2`)}</h3>
            <p>{t(`whyUsDesc2`)}</p>
          </div>
          <div>
            <WhyUsIcon3 size={75} />
            <h3>{t(`whyUsTitle3`)}</h3>
            <p>{t(`whyUsDesc3`)}</p>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <h3>{t('reviews')}</h3>
        <div className={styles.toggle}>
          <Switch
            checked={translate}
            onChange={(checked) => setTranslate(checked)}
            dir="rtl"
            onColor="#f58a07"
            onHandleColor="#043c6c"
            offHandleColor="#04d0e8"
            handleDiameter={20}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={30}
            width={115}
            id="material-switch"
            uncheckedIcon={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  // fontSize: 16,
                  fontWeight: 'bold',
                  color: '043c6c',
                  paddingRight: 60,
                }}
              >
                {t('translate')}
              </div>
            }
          />
        </div>
        <div
          className={`${styles.blockquote} ${
            locale === 'ar' && translate ? styles.blockAR : null
          }`}
        >
          <h1 dir={locale === 'ar' && translate ? 'rtl' : 'ltr'}>
            {translate
              ? t('reviewDesc')
              : 'Conocimos Omanosaura por casualidad y al final, su calidad humana y buen servicio marcó la diferencia. Si buscas sentir la cultura omaní y vivir aventuras a un buen precio enhorabuena, estás en el lugar correcto'}
          </h1>
          <h4>
            &mdash;{t('reviewName')}
            <br />
            <em>{t('reviewNameDesc')}</em>
          </h4>
        </div>
      </div>
    </>
  )
}

export default Welcome
