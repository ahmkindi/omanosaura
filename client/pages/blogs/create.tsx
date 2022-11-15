import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import 'react-datepicker/dist/react-datepicker.css'
import BlogForm from '../../components/BlogForm'

const Page = () => {
  const { t } = useTranslation('blog')

  return (
    <Layout title={t('title')}>
      <BlogForm />
    </Layout>
  )
}

export default Page
