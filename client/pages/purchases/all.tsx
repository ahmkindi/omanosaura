import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import useUser from '../../hooks/useUser'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { Purchase, UserPurchase } from '../../types/requests'
import { GetServerSideProps } from 'next'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '../../utils/axiosServer'
import PurchaseCard from '../../components/PurchaseCard'
import { OverlayTrigger, Button } from 'react-bootstrap'
import Link from 'next/link'


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session_id } = context.req.cookies
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: purchases }: AxiosResponse<Purchase[]> = await axios.get(
    'http://localhost:3000/server/user/admin/products/purchases',
    { headers: { Cookie: `session_id=${session_id}` } }
  )
  return {
    props: {
      fallback: {
        'purchases': purchases,
      },
    },
  }
}

const Purchases = () => {
  const { t } = useTranslation('purchases')
  const { user } = useUser()
  const { data: purchases } = useSWR(user ? 'user/admin/products/purchases' : null, fetcher<UserPurchase[]>)
  console.log(purchases)

  return (
    <Layout title={t('title')}>
    </Layout>
  )
}

const Page = ({ fallback }: { fallback: Map<string, UserPurchase[]> }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Purchases />
    </SWRConfig>
  )
}

export default Page
