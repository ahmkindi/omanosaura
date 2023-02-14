import useTranslation from 'next-translate/useTranslation'
import Layout from '../../../components/Layout'
import BlogForm from '../../../components/BlogForm'
import applyConverters from 'axios-case-converter'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import { GetServerSideProps } from 'next'
import { Blog, UserRole } from '../../../types/requests'
import useSWR, { SWRConfig } from 'swr'
import { useRouter } from 'next/router'
import { fetcher } from '../../../utils/axiosServer'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { useGlobal } from '../../../context/global'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const { session_id } = context.req.cookies
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: blog }: AxiosResponse<Blog> = await axios.get(
    `${process.env.SERVER_URL}blogs/${id}`,
    { headers: { Cookie: `session_id=${session_id}` } }
  )
  return {
    props: {
      fallback: {
        [`blogs/${id}`]: blog,
      },
    },
  }
}

const Blog = () => {
  const { t } = useTranslation('blog')
  const router = useRouter()
  const { role, isLoading } = useGlobal()
  const { id } = router.query
  const { data: blog } = useSWR(`blogs/${id}`, fetcher<Blog>) 

  useEffect(() => {
    if (!isLoading && role !== UserRole.admin) {
      router.push('/blogs')
    }
  }, [role, isLoading, router])

  if (!blog) {
    return null
  }

  return (
    <Layout title={t('title')}>
     {isLoading || !role ? <Spinner animation="border" /> : <BlogForm blog={blog} id={blog.id} />} 
    </Layout>
  )
}

const Page = ({ fallback }: { fallback: Map<string, Blog> }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Blog />
    </SWRConfig>
  )
}

export default Page
