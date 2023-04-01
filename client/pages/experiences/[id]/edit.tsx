import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Layout from '../../../components/Layout'
import ProductForm from '../../../components/ProductForm'
import applyConverters from 'axios-case-converter'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import { Product, UserRole } from '../../../types/requests'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '../../../utils/axiosServer'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { useGlobal } from '../../../context/global'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: product }: AxiosResponse<Product> = await axios.get(
    `${process.env.SERVER_URL}products/${id}`,
  )

  return {
    props: {
      fallback: {
        [`products/${id}`]: product,
      },
    },
  }
}

const Experience = () => {
  const { t } = useTranslation('experiences')
  const router = useRouter()
  const { id } = router.query
  const { data: product } = useSWR(`products/${id}`, fetcher<Product>)
  const { user, isLoading } = useGlobal()

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.admin) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (!product) return null

  return (
    <Layout title={t('title')}>
      {isLoading ? <Spinner animation="border" /> : <ProductForm product={product} id={product.id} />}
    </Layout>
  )
}

const Page = ({ fallback }: { fallback: Map<string, Product> }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Experience />
    </SWRConfig>
  )
}

export default Page
