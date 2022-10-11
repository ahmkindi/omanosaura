import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import useUser from '../hooks/useUser'
import { navOptions } from '../types/values'
import styles from '../styles/NavBar.module.css'
import FaUserCircle from 'react-icons/fa'
import Image from 'next/image'

const NavBar = () => {
  const { user, isLoading, login, logout } = useUser()
  const { t, lang } = useTranslation('common')
  const { pathname } = useRouter()

  const isAr = lang === 'ar'

  return (
    <nav className={styles.nav}>
      <Image
        src={isAr ? 'arabic_logo.svg' : 'main_logo.svg'}
        alt="Omanosaura Logo"
        width={210}
      />
      <div>
        <div>
          <ButtonGroup
            className={styles.langButtonGroup}
            aria-label="Basic example"
            style={{ direction: 'ltr' }}
          >
            <Button
              className={isAr ? styles.langButtonActive : styles.langButton}
              onClick={() => changeLocale('ar')}
            >
              AR
            </Button>
            <Button
              className={!isAr ? styles.langButtonActive : styles.langButton}
              onClick={() => changeLocale('en')}
            >
              EN
            </Button>
          </ButtonGroup>
        </div>
        <div>
          {navOptions.map((o) => (
            <Link
              key={o}
              href={o}
              className={pathname === o ? styles.navActive : styles.navInactive}
            >
              {t('trips')}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
