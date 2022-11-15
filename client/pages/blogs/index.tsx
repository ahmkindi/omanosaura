import useTranslation from 'next-translate/useTranslation'
import useSWR, { SWRConfig } from 'swr'
import Layout from '../../components/Layout'
import { BlogPreface } from '../../types/requests'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { fetcher } from '../../utils/axiosServer'
import Section from '../../components/Section'
import BlogCard from '../../components/BlogCard'

export async function getServerSideProps() {
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: products }: AxiosResponse<BlogPreface[]> = await axios.get(
    `${process.env.SERVER_URL}products`
  )
  return {
    props: {
      fallback: {
        products: products,
      },
    },
  }
}

const Blog = () => {
  const { t } = useTranslation('blog')
  const { data: blogs } = useSWR('blogs', fetcher<BlogPreface[]>)

  return <Layout title={t('title')}>
    <Section title={t('sharing')}>
      {blogs?.map(b => <BlogCard key={b.id} blogPreface={b}/>)}
    </Section>
  </Layout>
}

const Page = ({ fallback }: { fallback: Map<string, BlogPreface[]> }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Blog />
    </SWRConfig>
  )
}

export default Page
