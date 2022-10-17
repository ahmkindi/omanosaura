import React from 'react'
import useUser from '../hooks/useUser'
import styles from '../styles/Avatar.module.css'
import { User } from '../types/requests'

const Avatar = ({ user }: { user: User }) => {
  const { logout } = useUser()
  return (
    <div className={styles.circle} onClick={() => logout()}>
      <p className={styles.inner}>
        {user?.firstname?.[0]?.toUpperCase()}
        {user?.lastname?.[0]?.toUpperCase()}
      </p>
    </div>
  )
}

export default Avatar
