import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Layout from '../../../components/Layout'
import ProductForm from '../../../components/ProductForm'
import applyConverters from 'axios-case-converter'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import { Product } from '../../../types/requests'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '../../../utils/axiosServer'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const { session_id } = context.req.cookies
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: product }: AxiosResponse<Product> = await axios.get(
    `${process.env.SERVER_URL}products/${id}`,
    { headers: { Cookie: `session_id=${session_id}` } }
  )
  return {
    props: {
      fallback: {
        [`products/${id}`]: product,
      },
    },
  }
}

const Blog = () => {
  const { t } = useTranslation('experiences')
  const router = useRouter()
  const { id } = router.query
  const { data: product } = useSWR(`products/${id}`, fetcher<Product>) 

  if (!product) return null

  return (
    <Layout title={t('title')}>
      <ProductForm product={product} id={product.id} />
    </Layout>
  )
}

const Page = ({ fallback }: { fallback: Map<string, Product> }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Blog />
    </SWRConfig>
  )
}

export default Page
