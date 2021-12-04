import { BsInstagram } from 'react-icons/bs'
import styles from './welcome.module.scss'

const Contact = () => {
  return (
    <div>
      <a
        className={styles.instaButton}
        href="https://www.instagram.com/jaifar96/"
      >
        <BsInstagram className={styles.instaIcon} />
      </a>
      Contact
    </div>
  )
}

export default Contact
