import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import 'react-datepicker/dist/react-datepicker.css'
import BlogForm from '../../components/BlogForm'
import { EmptyBlog, UserRole } from '../../types/requests'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { useGlobal } from '../../context/global'

const Page = () => {
  const { t } = useTranslation('blog')
  const { role, isLoading } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && role !== UserRole.admin) {
      router.push('/blogs')
    }
  }, [role, isLoading, router])

  return (
    <Layout title={t('title')}>
      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <BlogForm blog={EmptyBlog} />
      )}
    </Layout>
  )
}

export default Page
