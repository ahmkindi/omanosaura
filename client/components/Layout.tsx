import React, { ReactNode } from 'react'
import Footer from './Footer'
import styles from '../styles/Layout.module.css'
import NavBar from './NavBar'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import { useGlobal } from '../context/global'
import { Toast } from 'react-bootstrap'
import Image from 'next/image'

type LayoutProps = {
  title?: string
  description?: string
  children?: ReactNode
}

export const Layout = (props: LayoutProps): JSX.Element => {
  const { t, lang } = useTranslation()
  const { alert, setAlert } = useGlobal()

  return (
    <div className={styles.layout} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {alert && (
        <Toast
          onClose={() => setAlert?.(undefined)}
          style={{
            position: 'fixed',
            right: '10px',
            top: '10px',
            zIndex: '900',
          }}
        >
          <Toast.Header>
            <Image
              src="/colored_small.png"
              className="rounded mr-2"
              alt="colored small omanosaura logo"
              width={20}
              height={20}
            />
            <strong className="me-auto">{t('common:company')}</strong>
          </Toast.Header>
          <Toast.Body>{alert.message}</Toast.Body>
        </Toast>
      )}
      <Head>
        <title>{props.title ?? t('common:company')}</title>
        <meta
          name="description"
          content={props.description ?? t('common:description')}
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.nonFooter}>
        <NavBar />
        <main className={styles.children}>{props.children}</main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
