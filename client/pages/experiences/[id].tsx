import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { Product } from '../../types/requests'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const { session_id } = context.req.cookies
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: product }: AxiosResponse<Product> = await axios.get(
    `http://localhost:3000/server/user/products/${id}`,
    { headers: { Cookie: `session_id=${session_id}` } }
  )
  return {
    props: { product },
  }
}

const ExperiencePage = () => {
  const { t } = useTranslation('experiences')

  return <Layout title={t('title')}>Experience Page</Layout>
}

export default ExperiencePage
