import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import { emptyProduct, UserRole } from '../../types/requests'
import 'react-datepicker/dist/react-datepicker.css'
import ProductForm from '../../components/ProductForm'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { useGlobal } from '../../context/global'

const Page = () => {
  const { t } = useTranslation('experience')
  const { role, isLoading } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && role !== UserRole.admin) {
      router.push('/blogs')
    }
  }, [role, isLoading, router])

  return (
    <Layout title={t('title')}>
      {isLoading || !role ? (
        <Spinner animation="border" />
      ) : (
        <ProductForm product={emptyProduct} />
      )}
    </Layout>
  )
}

export default Page
