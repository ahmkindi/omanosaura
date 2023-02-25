import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { Purchase, UserPurchase } from '../../types/requests'
import { GetServerSideProps } from 'next'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '../../utils/axiosServer'
import DataTable from 'react-data-table-component'
import { format } from 'date-fns'
import { Button } from 'react-bootstrap'
import { useMemo } from 'react'
import { downloadCSV } from '../../utils/exportCSV'
import Link from 'next/link'
import { useGlobal } from '../../context/global'


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.req.cookies
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: purchases }: AxiosResponse<Purchase[]> = await axios.get(
    `${process.env.SERVER_URL}user/admin/products/purchases`,
    { headers: { Cookie: `token=${token}` } }
  )
  return {
    props: {
      fallback: {
        'user/admin/products/purchases': purchases,
      },
    },
  }
}

const Purchases = () => {
  const { t, lang } = useTranslation('purchases')
  const { user } = useGlobal()
  const { data: purchases } = useSWR(user ? 'user/admin/products/purchases' : null, fetcher<UserPurchase[]>)

  const columns = [
    {
      name: t('productId'),
      selector: (row: UserPurchase) => row.productId,
      cell: (row: UserPurchase) => <Link href={`/experiences/${row.productId}`}>{row.productId}</Link>,
    },
    {
      name: t('userEmail'),
      selector: (row: UserPurchase) => row.email,
      sortable: true,
    },
    {
      name: t('userPhone'),
      selector: (row: UserPurchase) => row.phone,
      sortable: true,
    },
    {
      name: t('numOfParticipants'),
      selector: (row: UserPurchase) => row.numOfParticipants.toString(),
      sortable: true,
    },
    {
      name: t('totalPrice'),
      selector: (row: UserPurchase) =>
        new Intl.NumberFormat(lang, {
          style: 'currency',
          currency: 'OMR',
        }).format(row.costBaisa / 1000),
      sortable: true,
    },
    {
      name: t('paid?'),
      selector: (row: UserPurchase) => row.paid ? t('paid') : t('notPaid'),
      sortable: true,
    },
    {
      name: t('chosenDate'),
      selector: (row: UserPurchase) => format(new Date(row.chosenDate), 'dd/MM/yyyy'),
      sortable: true,
    },
  ]
  const actionsMemo = useMemo(() => purchases ? <Export onExport={() => downloadCSV(purchases)} /> : null, [purchases]);

  return (
    <Layout title={t('title')}>

      {purchases &&
        <DataTable title={t('allPurchases')} columns={columns} data={purchases} actions={actionsMemo} pagination />}
    </Layout>
  )
}

const Export = ({ onExport }: { onExport: () => void }) => {
  const { t } = useTranslation('purchases')
  return <Button onClick={() => onExport()}>{t('export')}</Button>;
}

const Page = ({ fallback }: { fallback: Map<string, UserPurchase[]> }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Purchases />
    </SWRConfig>
  )
}

export default Page
