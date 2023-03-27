import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import { emptyProduct, ProductKindLabel, UserRole } from '../../types/requests'
import 'react-datepicker/dist/react-datepicker.css'
import ProductForm from '../../components/ProductForm'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { useGlobal } from '../../context/global'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
  const axios = applyConverters(axiosStatic as any) as AxiosInstance

  const { data: productKinds }: AxiosResponse<ProductKindLabel[]> =
    await axios.get(`${process.env.SERVER_URL}products/kinds`)

  return {
    props: {
      kinds: productKinds,
    },
  }
}

const Page = ({ kinds }: { kinds: ProductKindLabel[] }) => {
  const { t } = useTranslation('experiences')
  const { user, isLoading } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.role !== UserRole.admin) {
      router.push('/experiences')
    }
  }, [user, isLoading, router])

  return (
    <Layout title={t('title')}>
      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <ProductForm product={emptyProduct} kinds={kinds} />
      )}
    </Layout>
  )
}

export default Page
