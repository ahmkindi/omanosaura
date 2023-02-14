import { signOut, User } from 'firebase/auth'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { BsFillPencilFill } from 'react-icons/bs'
import auth from '../config/firebase'
import styles from '../styles/Avatar.module.scss'

const Avatar = ({ user }: { user: User }) => {
  const { t, lang } = useTranslation('common')
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div
      className={styles.circle}
      onClick={() => setProfileOpen((prev) => !prev)}
    >
      <p className={styles.inner}>
        {user.displayName?.split(' ')?.[0]?.[0]?.toUpperCase()}
        {user.displayName?.split(' ')?.[1]?.[0]?.toUpperCase()}
      </p>
      {profileOpen && (
        <div
          className={`${styles.userBox} ${
            lang === 'ar' ? styles.userBoxAr : null
          }`}
        >
          <div className={styles.profile}>
            <h5>{user.displayName}</h5>
            <div>{user.email}</div>
            <div>{user.phoneNumber}</div>
            <Link passHref href="/profile">
              <Button variant="outline-secondary">
                <BsFillPencilFill />
              </Button>
            </Link>
          </div>
          <div className={styles.actions}>
            <Link passHref href="/purchases">
              <div>{t('purchases')}</div>
            </Link>
            <div onClick={() => signOut(auth)}>{t('logout')}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Avatar
