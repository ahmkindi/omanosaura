import styles from './trips.module.scss'
import welcomeStyles from './welcome.module.scss'
import { useTranslation } from 'react-i18next'
import traveler from '../assets/trips/traveler.json'
import Lottie from 'react-lottie'
import { GrGallery } from 'react-icons/gr'

const travelerOptions = {
  loop: true,
  autoplay: true,
  animationData: traveler,
  renderSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const Trips = () => {
  const { t } = useTranslation()

  const trips = []
  for (let i = 1; i <= 9; i++) {
    trips.push({
      title: t(`trip${i}`),
      desc: t(`trip${i}Desc`),
      img: `/static/trip_${i}_front.png`,
      tag: t(`trip${i}Tag`),
      sub: t(`trip${i}Sub`),
    })
  }

  return (
    <>
      <div className={welcomeStyles.welcomeBox}>
        <div>
          <h5>{t('tripsIntro')}</h5>
        </div>
        <Lottie options={travelerOptions} height={400} width={400} />
      </div>
      <div style={{ margin: '8px' }}>
        {trips.map((trip) => (
          <article
            className={`${styles.postcard} ${styles.dark} ${styles.blue}`}
          >
            <a className={styles.postcardImgLink} href="/">
              <img
                className={styles.postcardImg}
                src={trip.img}
                alt={trip.title}
              />
            </a>
            <div className={styles.postcardText}>
              <h1 class={`${styles.postcardTitle} ${styles.blue}`}>
                <a href="/">{trip.title}</a>
              </h1>
              <div class={`${styles.postcardSubtitle} ${styles.small}`}>
                {trip.sub}
              </div>
              <div className={styles.postcardBar}></div>
              <div className={styles.postcardPreviewText}>{trip.desc}</div>
              <ul className={styles.postcardTagbox}>
                <li className={styles.tagItem}>{trip.tag}</li>
                <li
                  className={`${styles.tagItem} ${styles.play} ${styles.blue}`}
                >
                  <a href="/">
                    <GrGallery className={styles.myIcon} />
                    {t('gallery')}
                  </a>
                </li>
              </ul>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default Trips
