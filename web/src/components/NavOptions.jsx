import styles from './navigation.module.scss'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

function NavOptions() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <>
      <Link to="/trips">
        <div
          className={
            location?.pathname === '/trips'
              ? styles.navActive
              : styles.navInactive
          }
        >
          {t('trips')}
        </div>
      </Link>
      <Link to="/adventures">
        <div
          className={
            location?.pathname === '/adventures'
              ? styles.navActive
              : styles.navInactive
          }
        >
          {t('adventures')}
        </div>
      </Link>
      <Link to="/about">
        <div
          className={
            location?.pathname === '/about'
              ? styles.navActive
              : styles.navInactive
          }
        >
          {t('about')}
        </div>
      </Link>
      <Link to="/contact">
        <div
          className={
            location?.pathname === '/contact'
              ? styles.navActive
              : styles.navInactive
          }
        >
          {t('contact')}
        </div>
      </Link>
    </>
  )
}

export default NavOptions
