import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { BsFillPencilFill } from 'react-icons/bs'
import useUser from '../hooks/useUser'
import styles from '../styles/Avatar.module.scss'
import { User } from '../types/requests'

const Avatar = ({ user }: { user: User }) => {
  const { logout } = useUser()
  const { t, lang } = useTranslation('common')
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <div
      className={styles.circle}
      onClick={() => setProfileOpen((prev) => !prev)}
    >
      <p className={styles.inner}>
        {user.firstname[0]?.toUpperCase()}
        {user.lastname[0]?.toUpperCase()}
      </p>
      {profileOpen && (
        <div className={`${styles.userBox} ${lang === 'ar' ? styles.userBoxAr : null}`}>
          <div className={styles.profile}>
            <h5>{`${user.firstname} ${user.lastname}`}</h5>
            <div>{user.email}</div>
            <div>{user.phone}</div>
            <Link passHref href="/profile">
              <Button variant="outline-secondary">
                <BsFillPencilFill />
              </Button>
            </Link>
          </div>
          <div className={styles.actions}>
            <Link passHref href="purchases">
              <div>{t('purchases')}</div>
            </Link>
            <div onClick={() => logout()}>{t('logout')}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Avatar
