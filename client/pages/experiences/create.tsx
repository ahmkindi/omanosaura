import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import { emptyProduct } from '../../types/requests'
import 'react-datepicker/dist/react-datepicker.css'
import ProductForm from '../../components/ProductForm'
import useUser from '../../hooks/useUser'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'

const Page = () => {
  const { t } = useTranslation('experience')
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
        <ProductForm product={emptyProduct} />
      )}
    </Layout>
  )
}

export default Page
