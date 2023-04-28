import { signOut } from 'firebase/auth'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'react-bootstrap'
import { BsFillPencilFill } from 'react-icons/bs'
import auth from '../config/firebase'
import styles from '../styles/Avatar.module.scss'
import { User } from '../types/requests'

const Avatar = ({ user }: { user: User }) => {
  const { t, lang } = useTranslation('common')
  const [profileOpen, setProfileOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const circle = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !circle.current?.contains(event.target)
      ) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])

  return (
    <div
      className={styles.circle}
      onClick={() => setProfileOpen((prev) => !prev)}
      ref={circle}
    >
      <p className={styles.inner}>
        {user.name?.split(' ')?.[0]?.[0]?.toUpperCase()}
        {user.name?.split(' ')?.[1]?.[0]?.toUpperCase()}
      </p>
      {profileOpen && (
        <div
          className={`${styles.userBox} ${
            lang === 'ar' ? styles.userBoxAr : null
          }`}
          ref={ref}
        >
          <div className={styles.profile}>
            <h5>{user.name}</h5>
            <div>{user.email}</div>
            <div>{user.phone}</div>
            <Link passHref href="/profile">
              <Button variant="outline-secondary">
                <BsFillPencilFill />
              </Button>
            </Link>
          </div>
          <div className={styles.actions}>
            <Link passHref href="/purchases">
              {t('purchases')}
            </Link>
            <div onClick={() => signOut(auth)}>{t('logout')}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Avatar
