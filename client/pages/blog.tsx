import useTranslation from 'next-translate/useTranslation'
import Layout from '../components/Layout'

const Blog = () => {
  const { t } = useTranslation('about')

  return <Layout title={t('title')}>Blog Here</Layout>
}

export default Blog
