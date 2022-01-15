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
import { useContext } from 'react'
import LocaleContext from '../LocaleContext'
import axios from 'axios'
import useSWR from 'swr'

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
  const { data: events } = useSWR('/current/events', async (url) => {
    const { data } = await axios.get(url)
    return data
  })

  const whyUs = []
  for (let i = 1; i <= 3; i++) {
    whyUs.push({
      title: t(`whyUsTitle${i}`),
      desc: t(`whyUsDesc${i}`),
      icon: WhyUsIcon1,
    })
  }

  return (
    <>
      <div className={styles.welcomeBox}>
        <div>
          <div className={styles.omanSlogan}>{t('omanSlogan')}</div>
          <div className={styles.contact}>{t('introText')}</div>
          <Button className={styles.myButton}>{t('contactText')}</Button>
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
      {events && (
        <div className={`${styles.section} ${styles.events}`}>
          <h3>{t('currentEvents')}</h3>
          <div>
            {events.map((event) => (
              <div className={styles.event} key={event.id}>
                <img
                  alt="event"
                  src={`data:image/jpeg;base64,${event.photo}`}
                />
                <Button className={styles.myButton}>{t(`register`)}</Button>
              </div>
            ))}
          </div>
        </div>
      )}
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
            <h3>{t(`whyUsTitle1`)}</h3>
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
        <div
          className={`${styles.blockquote} ${
            locale === 'ar' ? styles.blockAR : null
          }`}
        >
          <h1>{t('reviewDesc')}</h1>
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
