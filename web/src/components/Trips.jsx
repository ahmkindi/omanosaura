import styles from './trips.module.scss'
import welcomeStyles from './welcome.module.scss'
import traveler from '../assets/trips/traveler.json'
import Lottie from 'react-lottie'
import useSWR from 'swr'
import axios from 'axios'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LocaleContext from '../LocaleContext'
import Gallery from './Gallery'

const travelerOptions = {
  loop: true,
  autoplay: true,
  animationData: traveler,
  renderSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const Trips = () => {
  const { locale } = useContext(LocaleContext)
  const { t } = useTranslation()
  const [gallery, setGallery] = useState()

  const { data: trips } = useSWR('/trips', async (url) => {
    const { data } = await axios.get(url)
    return data
  })

  const isAr = locale === 'ar'

  return (
    <>
      <div className={welcomeStyles.welcomeBox}>
        <div>
          <h5>{t('tripsIntro')}</h5>
        </div>
        <Lottie options={travelerOptions} height={400} width={400} />
      </div>
      <div style={{ margin: '8px' }}>
        {trips?.map((trip) => (
          <article
            className={`${styles.postcard} ${styles.dark} ${styles.blue}`}
          >
            <a className={styles.postcardImgLink} href="/">
              <img
                className={styles.postcardImg}
                src={`data:image/jpeg;base64,${trip.front_photo}`}
                alt={isAr ? trip.title_ar : trip.title}
              />
            </a>
            <div className={styles.postcardText}>
              <h1 class={`${styles.postcardTitle} ${styles.blue}`}>
                <a href="/">{isAr ? trip.title_ar : trip.title}</a>
              </h1>
              <div class={`${styles.postcardSubtitle} ${styles.small}`}>
                {isAr ? trip.subtitle_ar : trip.subtitle}
              </div>
              <div className={styles.postcardBar}></div>
              <div className={styles.postcardPreviewText}>
                {isAr ? trip.description_ar : trip.description}
              </div>
              <ul className={styles.postcardTagbox}>
                <li
                  className={`${styles.tagItem} ${styles.play} ${styles.blue}`}
                >
                  <a
                    href="/"
                    style={{ padding: '0.8em 0.5em', paddingBottom: '0.8em' }}
                    onClick={() => setGallery(trip.id)}
                  >
                    {t('gallery')}
                  </a>
                </li>
              </ul>
            </div>
          </article>
        ))}
        {gallery && <Gallery trip={gallery} setGallery={setGallery} />}
      </div>
    </>
  )
}

export default Trips
