import styles from './trips.module.scss'
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
    })
  }

  return (
    <>
      <div className={styles.intro}>
        <h5>
          Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit
          enim labore culpa sint ad nisi Lorem pariatur mollit ex esse
          exercitation amet. Nisi anim cupidatat excepteur officia.
          Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
        </h5>
        <Lottie
          className={styles.traveler}
          options={travelerOptions}
          height={400}
          width={400}
        />
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
                <time datetime="2020-05-25 12:00:00">
                  <i className="fas fa-calendar-alt mr-2"></i>Mon, May 25th 2020
                </time>
              </div>
              <div className={styles.postcardBar}></div>
              <div className={styles.postcardPreviewText}>{trip.desc}</div>
              <ul className={styles.postcardTagbox}>
                <li className={styles.tagItem}>
                  <i class="fas fa-tag mr-2"></i>Podcast
                </li>
                <li className={styles.tagItem}>
                  <i class="fas fa-clock mr-2"></i>55 mins.
                </li>
                <li
                  className={`${styles.tagItem} ${styles.play} ${styles.blue}`}
                >
                  <a href="/">
                    <GrGallery
                      style={{
                        marginRight: '4px',
                        marginBottom: '4px',
                        color: 'white',
                      }}
                    />
                    Gallery
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
