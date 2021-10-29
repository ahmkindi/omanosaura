import { useContext } from 'react'
import LocaleContext from '../LocaleContext'
import i18n from '../i18n'
import styles from './navigation.module.scss'
import mainLogo from '../assets/main_logo.png'
import { ButtonGroup, Button } from 'react-bootstrap'

function Navigation() {
  const { locale } = useContext(LocaleContext)

  function changeLocale(l) {
    if (locale !== l) {
      i18n.changeLanguage(l)
    }
  }

  return (
    <div className={styles.navbar}>
      <img width="300" src={mainLogo} alt={'omanosaura'} />
      <ButtonGroup
        className={styles.langButtonGroup}
        aria-label="Basic example"
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
    </div>
  )
}

export default Navigation
