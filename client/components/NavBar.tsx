import useTranslation from 'next-translate/useTranslation'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import useUser from '../hooks/useUser'
import styles from '../styles/Navbar.module.css'
import { ButtonGroup, Button } from 'react-bootstrap'
import { navoptions } from '../types/navoptions'
import { useGlobal } from '../context/global'
import { useRouter } from 'next/router'
import { FiLogIn } from 'react-icons/fi'
import Avatar from './Avatar'

const NavBar = () => {
  const { user, isLoading, login } = useUser()
  const { menuOpen, setMenuOpen } = useGlobal()
  const { lang, t } = useTranslation('common')
  const { pathname } = useRouter()

  const isAr = lang === 'ar'

  return (
    <header className={styles.header}>
      <div className={`${styles.navbar} ${isAr ? styles.navbarAr : null}`}>
        <Link href={'/'}>
          <Image
            src={isAr ? '/logo_ar.png' : '/main_logo.png'}
            alt="omanosaura"
            width={320}
            height={85.97}
            layout="intrinsic"
          />
        </Link>
        <svg className={styles.navSVG}>
          <defs>
            <filter id="gooeyness">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="2.2"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                result="gooeyness"
              />
              <feComposite in="SourceGraphic" in2="gooeyness" operator="atop" />
            </filter>
          </defs>
        </svg>
        <div
          className={`${styles.plate} ${menuOpen ? styles.active : null}`}
          onClick={() => setMenuOpen?.((prevValue) => !prevValue)}
        >
          <svg
            className={styles.burger}
            version="1.1"
            height="70"
            width="70"
            viewBox="0 0 70 70"
          >
            <path
              className={`${styles.line} ${styles.line1}`}
              d="M 50,65 H 70 C 70,65 75,65.198488 75,70.762712 C 75,73.779026 74.368822,78.389831 66.525424,78.389831 C 22.092231,78.389831 -18.644068,-30.508475 -18.644068,-30.508475"
            />
            <path
              className={`${styles.line} ${styles.line2}`}
              d="M 50,35 H 70 C 70,35 81.355932,35.300135 81.355932,25.635593 C 81.355932,20.906215 78.841706,14.830508 72.881356,14.830508 C 35.648232,14.830508 -30.508475,84.322034 -30.508475,84.322034"
            />
            <path
              className={`${styles.line} ${styles.line3}`}
              d="M 50,50 H 30 C 30,50 12.288136,47.749959 12.288136,60.169492 C 12.288136,67.738339 16.712974,73.305085 40.677966,73.305085 C 73.791674,73.305085 108.47458,-19.915254 108.47458,-19.915254"
            />
            <path
              className={`${styles.line} ${styles.line4}`}
              d="M 50,50 H 70 C 70,50 81.779661,50.277128 81.779661,36.607372 C 81.779661,28.952694 77.941689,25 69.067797,25 C 39.95532,25 -16.949153,119.91525 -16.949153,119.91525"
            />
            <path
              className={`${styles.line} ${styles.line5}`}
              d="M 50,65 H 30 C 30,65 17.79661,64.618439 17.79661,74.152543 C 17.79661,80.667556 25.093813,81.355932 38.559322,81.355932 C 89.504001,81.355932 135.59322,-21.186441 135.59322,-21.186441"
            />
            <path
              className={`${styles.line} ${styles.line6}`}
              d="M 50,35 H 30 C 30,35 16.525424,35.528154 16.525424,24.152542 C 16.525424,17.535987 22.597755,13.559322 39.40678,13.559322 C 80.617882,13.559322 94.067797,111.01695 94.067797,111.01695"
            />
          </svg>
          <svg
            className={styles.x}
            version="1.1"
            height="70"
            width="70"
            viewBox="0 0 70 70"
          >
            <path className={styles.line} d="M 34,32 L 66,68" />
            <path className={styles.line} d="M 66,32 L 34,68" />
          </svg>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'fit-content',
          }}
        >
          <div
            style={{
              alignSelf: 'end',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {isLoading ? null : user ? (
              <Avatar user={user} />
            ) : (
              <Button
                style={{
                  marginLeft: '1rem',
                  width: 'fit-content',
                  padding: '0px 8px 0px 8px',
                  margin: isAr ? '0px 0px 0px 8px' : '0px 8px 0px 0px',
                }}
                className={styles.langButton}
                onClick={() => login()}
              >
                <FiLogIn color="var(--primary)" style={{ margin: '4px' }} />
                {t('login')}
              </Button>
            )}
            <ButtonGroup
              className={styles.langButtonGroup}
              aria-label="lang buttons"
              style={{ direction: 'ltr' }}
            >
              <Link href="" locale="ar" passHref>
                <Button
                  className={isAr ? styles.langButtonActive : styles.langButton}
                >
                  AR
                </Button>
              </Link>
              <Link href="" locale="en" passHref>
                <Button
                  className={
                    !isAr ? styles.langButtonActive : styles.langButton
                  }
                >
                  EN
                </Button>
              </Link>
            </ButtonGroup>
          </div>
          <div
            className={styles.navOptions}
            style={{
              marginLeft: isAr ? '0px' : 'auto',
              marginRight: isAr ? 'auto' : '0px',
            }}
          >
            {navoptions.map((n) => (
              <Link key={n} href={`/${n}`} passHref>
                <div
                  key={n}
                  className={
                    pathname === `/${n}` ? styles.navActive : styles.navInactive
                  }
                >
                  {t(n)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`${styles.navOptionsColumn} ${
          menuOpen ? styles.active : null
        }`}
      >
        {navoptions.map((n) => (
          <Link key={n} href={`/${n}`} passHref>
            <div
              className={
                pathname === `/${n}` ? styles.navActive : styles.navInactive
              }
            >
              {t(n)}
            </div>
          </Link>
        ))}
      </div>
    </header>
  )
}

export default NavBar
