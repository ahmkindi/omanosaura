import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import { emptyProduct } from '../../types/requests'
import 'react-datepicker/dist/react-datepicker.css'
import ProductForm from '../../components/ProductForm'

const Page = () => {
  const { t } = useTranslation('experience')
  return (
    <Layout title={t('title')}>
      <ProductForm product={emptyProduct} />
    </Layout>
  )
}

export default Page
