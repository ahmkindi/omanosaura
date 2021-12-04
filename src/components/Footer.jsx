import styles from './navigation.module.scss'
import coloredSmallLogo from '../assets/colored_small.png'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <img src={coloredSmallLogo} alt="Logo" width={55} />
      <h4>
        Made With <span> Exhilatation! </span>
      </h4>
    </footer>
  )
}

export default Footer
