import styles from './trips.module.scss'

const cards = [
  {
    title: 'Mountain View',
    copy: 'Check out all of these gorgeous mountain trips with beautiful views of, you guessed it, the mountains',
    button: 'View Trips',
  },
  {
    title: 'To The Beach',
    copy: 'Plan your next beach trip with these fabulous destinations',
    button: 'View Trips',
  },
  {
    title: 'Desert Destinations',
    copy: "It's the desert you've always dreamed of",
    button: 'Book Now',
  },
  {
    title: 'Explore The Galaxy',
    copy: 'Seriously, straight up, just blast off into outer space today',
    button: 'Book Now',
  },
]

const Trips = () => {
  return (
    <div className={styles.tripContainer}>
      {cards.map((card) => (
        <div className={styles.card}>
          <div className={styles.content}>
            <h2 className={styles.title}>{card.title}</h2>
            <p className={styles.copy}>{card.copy}</p>
            <button className={styles.btn}>{card.button}</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Trips
