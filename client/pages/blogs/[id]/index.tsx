import useTranslation from "next-translate/useTranslation"
import { useRouter } from "next/router"
import Layout from '../../../components/Layout'
import applyConverters from 'axios-case-converter'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import { GetServerSideProps } from 'next'
import { Blog } from '../../../types/requests'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '../../../utils/axiosServer'
import useUser from "../../../hooks/useUser"
import Section from "../../../components/Section"
import { format } from "date-fns"
import Link from "next/link"


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: blog }: AxiosResponse<Blog> = await axios.get(`${process.env.SERVER_URL}blogs/${id}`)
  return {
    props: {
      fallback: {
        [`blogs/${id}`]: blog,
      },
    },
  }
}

const Blog = () => {
  const { t, lang } = useTranslation('blog')
  const isAr = lang === 'ar'
  const router = useRouter()
  const { id } = router.query
  const { data: blog } = useSWR(`blogs/${id}`, fetcher<Blog>) 
  const { user } = useUser()

  if (!blog) {
    return null
  }

  return (
    <Layout title={isAr ? blog.titleAr : blog.title}>
      <Section title={isAr ? blog.titleAr : blog.title}>
<div dangerouslySetInnerHTML={{ __html: isAr ? blog.pageAr : blog.page }} />
        <div>
          <div style={{ textAlign: isAr ? 'right' : 'left', marginTop: '5rem', marginBottom: '1rem'}}>
          <h5>{blog.firstname} {blog.lastname}</h5>
          <p>{format(new Date(blog.createdAt), 'dd/MM/yyyy')}</p>
          {user?.id === blog.userId && <Link href={`/blogs/${id}/edit`}>{t('edit')}</Link>}
          </div>
        </div>
      </Section>
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
