import type { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import Layout from '../components/Layout'

const Home: NextPage = () => {
  const { t, lang } = useTranslation()

  return (
    <Layout>
      <Link href="/" locale={lang === 'ar' ? 'en' : 'ar'}>
        <h2>{t('common:language')}</h2>
      </Link>
    </Layout>
  )
}

export default Home
