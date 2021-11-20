import { useContext } from 'react'
import LocaleContext from '../LocaleContext'
import i18n from '../i18n'
import styles from './navigation.module.scss'
import mainLogo from '../assets/main_logo.png'
import { ButtonGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

function Navigation() {
  const { t } = useTranslation()
  const { locale } = useContext(LocaleContext)
  const location = useLocation()
  console.log(location?.pathname)

  function changeLocale(l) {
    if (locale !== l) {
      i18n.changeLanguage(l)
    }
  }

  return (
    <div
      className={styles.navbar}
      style={{ direction: locale === 'ar' ? 'rtl' : 'ltr' }}
    >
      <Link to="/">
        <img width="300" src={mainLogo} alt={'omanosaura'} />
      </Link>
      <ButtonGroup
        className={styles.langButtonGroup}
        aria-label="Basic example"
        style={{ direction: 'ltr' }}
      >
        <Button
          className={
            locale === 'ar' ? styles.langButtonActive : styles.langButton
          }
          onClick={() => changeLocale('ar')}
        >
          AR
        </Button>
        <Button
          className={
            locale === 'en' ? styles.langButtonActive : styles.langButton
          }
          onClick={() => changeLocale('en')}
        >
          EN
        </Button>
      </ButtonGroup>
      <div
        className={styles.navOptions}
        style={{
          marginLeft: locale === 'ar' ? '0px' : 'auto',
          marginRight: locale === 'ar' ? 'auto' : '0px',
        }}
      >
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
      </div>
    </div>
  )
}

export default Navigation
