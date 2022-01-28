import styles from './contact.module.scss'
import coloredSmallLogo from '../assets/colored_small.png'
import {
  AiOutlineWhatsApp,
  AiOutlineInstagram,
  AiFillPhone,
} from 'react-icons/ai'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src={coloredSmallLogo} alt="Logo" width={55} />
      <div className={styles.socials} style={{ gap: '1rem' }}>
        <a
          href="https://www.instagram.com/omanosaura/"
          target="_blank"
          rel="noreferrer"
        >
          <AiOutlineInstagram />
        </a>
        <a href="https://wa.me/0096895598840" target="_blank" rel="noreferrer">
          <AiOutlineWhatsApp />
        </a>
        <a
          href="tel:+96892767527"
          onClick={() => navigator.clipboard.writeText('0096892767527')}
        >
          <AiFillPhone />
        </a>
      </div>
    </footer>
  )
}

export default Footer
