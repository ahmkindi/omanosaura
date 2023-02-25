import useTranslation from 'next-translate/useTranslation'
import Layout from '../components/Layout'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { GetServerSideProps } from 'next'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '../utils/axiosServer'
import DataTable from 'react-data-table-component'
import { format } from 'date-fns'
import { Button } from 'react-bootstrap'
import { useMemo } from 'react'
import { downloadCSV } from '../utils/exportCSV'
import { useGlobal } from '../context/global'
import { UserDetails } from '../types/requests'


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.req.cookies
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: users }: AxiosResponse<UserDetails[]> = await axios.get(
    `${process.env.SERVER_URL}user/admin/users`,
    { headers: { Cookie: `token=${token}` } }
  )
  return {
    props: {
      fallback: {
        'user/admin/users': users,
      },
    },
  }
}

const Purchases = () => {
  const { t } = useTranslation('purchases')
  const { user } = useGlobal()
  const { data: users } = useSWR(user ? 'user/admin/users' : null, fetcher<UserDetails[]>)

  const columns = [
    {
      name: t('userEmail'),
      selector: (row: UserDetails) => row.email,
      sortable: true,
    },
    {
      name: t('userPhone'),
      selector: (row: UserDetails) => row.phone,
      sortable: true,
    },
    {
      name: t('userName'),
      selector: (row: UserDetails) => row.name,
      sortable: true,
    },
    {
      name: t('lastTrip'),
      selector: (row: UserDetails) => {
        const vis = format(new Date(row.lastTrip), 'dd/MM/yyyy');
        if (vis === "01/01/0001") {
          return "-"
        }
        else {
          return vis
        }
      },
      sortable: true,
    },
    {
      name: t('numOfPurchases'),
      selector: (row: UserDetails) => row.purchaseCount,
      sortable: true,
    },
    {
      name: t('avgRating'),
      selector: (row: UserDetails) => row.avgRating === -1 ? "-" : row.avgRating,
      sortable: true,
    },
  ]
  const actionsMemo = useMemo(() => users ? <Export onExport={() => downloadCSV(users)} /> : null, [users]);

  return (
    <Layout title={t('title')}>
      {users &&
        <DataTable title={t('allUsers')} columns={columns} data={users} actions={actionsMemo} pagination />}
    </Layout>
  )
}

const Export = ({ onExport }: { onExport: () => void }) => {
  const { t } = useTranslation('purchases')
  return <Button onClick={() => onExport()}>{t('export')}</Button>;
}

const Page = ({ fallback }: { fallback: Map<string, UserDetails[]> }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Purchases />
    </SWRConfig>
  )
}

export default Page
