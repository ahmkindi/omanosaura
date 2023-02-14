import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { Purchase, UserRole } from '../../types/requests'
import { GetServerSideProps } from 'next'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '../../utils/axiosServer'
import PurchaseCard from '../../components/PurchaseCard'
import { OverlayTrigger, Button } from 'react-bootstrap'
import Link from 'next/link'
import { useGlobal } from '../../context/global'


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { session_id } = context.req.cookies
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: purchases }: AxiosResponse<Purchase[]> = await axios.get(
    `${process.env.SERVER_URL}user/products/purchase`,
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
  const { user, role } = useGlobal()
  const { data: purchases } = useSWR(user ? 'user/products/purchase' : null, fetcher<Purchase[]>)

  return (
    <Layout title={t('title')}>
      {role === UserRole.admin && <Link href="/purchases/all" passHref>
        <Button variant="outline-secondary" className="mx-4">{t('allPurchases')}</Button>
      </Link>
      }
      {user && purchases ? (
        purchases.length > 0 ?
          <>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 150, hide: 150 }}
              overlay={<p style={{ padding: '1rem', marginTop: '0.5rem', borderRadius: '1rem', backgroundColor: 'var(--orange)', color: 'var(--primary)' }}>{t('doubleClick')}</p>}
            >
              <Button variant="outline-secondary">?</Button>
            </OverlayTrigger>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
              {purchases.map(p =>
                <PurchaseCard key={p.id} purchase={p} />
              )}
            </div>
          </>
          : <h3 className="mt-5">{t('noPurchases')}</h3>
      ) : (
        <h3 className="mt-5">{t('loginFirst')}</h3>
      )}
    </Layout>
  )
}

const Page = ({ fallback }: { fallback: Map<string, Purchase[]> }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Purchases />
    </SWRConfig>
  )
}

export default Page
