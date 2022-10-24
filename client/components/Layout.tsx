import React, { ReactNode } from 'react'
import Footer from './Footer'
import styles from '../styles/Layout.module.css'
import NavBar from './NavBar'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import { useGlobal } from '../context/global'
import { Alert, Toast } from 'react-bootstrap'

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
        //TODO: complete reusable toast
        <Toast
          variant={alert.type}
          show={alert !== undefined}
          onClose={() => setAlert?.(undefined)}
          dismissible
        >
          <Alert.Heading>
            {alert.substring(0, alertText.indexOf('|'))}
          </Alert.Heading>
          <p>{alertText.substring(alertText.indexOf('|') + 1)}</p>
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
