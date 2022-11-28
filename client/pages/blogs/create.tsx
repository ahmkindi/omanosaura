import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import 'react-datepicker/dist/react-datepicker.css'
import BlogForm from '../../components/BlogForm'
import { EmptyBlog } from '../../types/requests'
import useUser from '../../hooks/useUser'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'

const Page = () => {
  const { t } = useTranslation('blog')
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user?.roles.includes('admin')) {
      router.push('/blogs')
    }
  }, [user, isLoading, router])

  return (
    <Layout title={t('title')}>
      {isLoading || !user ? (
        <Spinner animation="border" />
      ) : (
        <BlogForm blog={EmptyBlog} />
      )}
    </Layout>
  )
}

export default Page
