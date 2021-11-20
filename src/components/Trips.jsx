import styles from './trips.module.scss'
import { useTranslation } from 'react-i18next'

const Trips = () => {
  const { t } = useTranslation()

  const trips = []
  for (let i = 1; i <= 9; i++) {
    trips.push({
      title: t(`trip${i}`),
      desc: t(`trip${i}Desc`),
    })
  }

  return (
    <div style={{ margin: '8px' }}>
      {trips.map((trip) => (
        <article className={`${styles.postcard} ${styles.dark} ${styles.blue}`}>
          <a className={styles.postcardImgLink} href="/">
            <img
              className={styles.postcardImg}
              src="https://picsum.photos/1000/1000"
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
              <li className={`${styles.tagItem} ${styles.play} ${styles.blue}`}>
                <a href="/">
                  <i class="fas fa-play mr-2"></i>Play Episode
                </a>
              </li>
            </ul>
          </div>
        </article>
      ))}
    </div>
  )
}

export default Trips
