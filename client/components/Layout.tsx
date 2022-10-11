import React, { ReactNode } from 'react'
import Footer from './Footer'
import styles from '../styles/Layout.module.css'
import NavBar from './NavBar'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import { createStyles } from '@mantine/core'

type LayoutProps = {
  title?: string
  description?: string
  children?: ReactNode
}

const useStyles = createStyles(() => ({
  layout: {
    textAlign: 'center',
    maxWidth: '1250px',
    margin: 'auto',
    position: 'relative',
    minHeight: '100vh',
  },
  nonFooter: {
    paddingBottom: 'var(--footer-height)',
  },
}))

export const Layout = (props: LayoutProps): JSX.Element => {
  const { t } = useTranslation()
  const { classes } = useStyles()

  return (
    <div className={classes.layout}>
      <Head>
        <title>{props.title ?? t('common:company')}</title>
        <meta
          name="description"
          content={props.description ?? t('common:description')}
        />
        <link rel="icon" href="/favicon.ico" />
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
