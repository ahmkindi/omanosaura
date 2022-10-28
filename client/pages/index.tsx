import type { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { Button } from 'react-bootstrap'
import Box from '../components/Box'
import Layout from '../components/Layout'
import Smartphone from '../components/Smartphone'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const { t } = useTranslation()
  return (
    <Layout>
      <Box>
        <div>
          <div className={styles.omanSlogan}>{t('omanSlogan')}</div>
          <div className={styles.contact}>{t('introText')}</div>
          <Link href="/experiences" passHref>
            <Button className={styles.myButton}>{t('contactText')}</Button>
          </Link>
        </div>
        <Smartphone />
      </Box>
    </Layout>
  )
}

export default Home
