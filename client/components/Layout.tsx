import React, { ReactNode } from 'react'
import Footer from './Footer'
import styles from '../styles/Layout.module.css'
import NavBar from './NavBar'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

type LayoutProps = {
  title?: string
  description?: string
  children?: ReactNode
}

export const Layout = (props: LayoutProps): JSX.Element => {
  const { t, lang } = useTranslation()

  return (
    <div className={styles.layout} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
