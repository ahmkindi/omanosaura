import React from 'react'
import styles from '../styles/contact.module.scss'
import {
  AiOutlineWhatsApp,
  AiOutlineInstagram,
  AiFillPhone,
} from 'react-icons/ai'
import Image from 'next/image'
import { TbPhotoPlus, TbPhotoSearch } from 'react-icons/tb'
import Link from 'next/link'
import { useGlobal } from '../context/global'
import { UserRole } from '../types/requests'

const Footer = () => {
  const { user } = useGlobal()

  return (
    <footer className={styles.footer}>
      <div className={styles.socials} style={{ gap: '1rem' }}>
        <Image src="/colored_small.png" alt="Logo" width={45} height={45} />
        <a
          href="https://www.instagram.com/omanosaura/"
          target="_blank"
          rel="noreferrer"
        >
          <AiOutlineInstagram />
        </a>
        <a href="https://wa.me/0096895598840" target="_blank" rel="noreferrer">
          <AiOutlineWhatsApp />
        </a>
        <a
          href="tel:+96892767527"
          onClick={() => navigator.clipboard.writeText('0096892767527')}
        >
          <AiFillPhone />
        </a>
        {user?.role === UserRole.admin && (
          <>
            <Link href="/images">
              <TbPhotoPlus />
            </Link>
            <Link href="/media">
              <TbPhotoSearch />
            </Link>
          </>
        )}
      </div>
    </footer>
  )
}

export default Footer
