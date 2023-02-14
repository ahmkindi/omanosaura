import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Layout from '../../../components/Layout'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { Product, UserRole } from '../../../types/requests'
import useSWR, { SWRConfig } from 'swr'
import "yet-another-react-lightbox/styles.css";
import { useRouter } from 'next/router'
import { fetcher } from '../../../utils/axiosServer'
import Image from 'next/image'
import { useState } from 'react'
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import styles from '../../../styles/experiences.module.scss'
import Box from '../../../components/Box'
import Reviews from '../../../components/Reviews'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import PurchaseModal from '../../../components/PurchaseModal'
import Link from 'next/link'
import { useGlobal } from '../../../context/global'

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

export enum ModalTypes {
  none,
  gallery,
  purchase
}

const SingleExperience = () => {
  const { t, lang } = useTranslation('experiences')
  const router = useRouter()
  const { id } = router.query
  const { data: product } = useSWR(`products/${id}`, fetcher<Product>) 
  const [openModal, setOpenModal] = useState(ModalTypes.none)
  const isAr = lang === 'ar'
  const { user, role } = useGlobal()

  if (!product) return null

  return <Layout title={t('title')}>
    <Box>
      <Image src={product.photo} width={450} height={450} alt={product.title} />
      <div className={styles.details}>
        <h3>{
isAr ? product?.titleAr : product?.title
        }</h3>
        <h4>{
isAr ? product?.subtitleAr : product?.subtitle
        }</h4>
     <div dangerouslySetInnerHTML={{ __html: isAr ? product?.descriptionAr : product?.description }} />
        <div  style={{ display: 'flex', justifyContent: 'end', alignItems: 'end', alignSelf: 'end',  gap: '1rem'}}>
      {role === UserRole.admin && 
      <Link href={`/experiences/${id}/edit`} passHref>
      <Button variant="primary">
          {t('edit')}
      </Button>
      </Link>
      }
      <Button variant="outline-secondary" onClick={() => setOpenModal(ModalTypes.gallery)}>
          {t('gallery')}
      </Button>
   {user ?
      <Button disabled={user === undefined} variant="outline-primary" onClick={() => setOpenModal(ModalTypes.purchase)}>
          {t('purchase')}
      </Button>
   :
       <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{t('loginFirst')}</Tooltip>}>
      <span className="d-inline-block">
      <Button disabled variant="outline-primary">
          {t('purchase')}
      </Button>
      </span>
    </OverlayTrigger> } 
        </div>
      </div>
    </Box>
      <Reviews product={product} />
      <Lightbox
        open={openModal === ModalTypes.gallery}
        close={() => setOpenModal(ModalTypes.none)}
        slides={[getSlide(product?.photo), ...product?.photos.map(p => getSlide(p))]}
        plugins={[Fullscreen, Zoom]}
      />
      {openModal === ModalTypes.purchase && <PurchaseModal product={product} setOpenModal={setOpenModal} />}
  </Layout>
}

const getSlide = (imgSrc: string): SlideImage => {
  return {
    src: imgSrc,
  }
}


const Page = ({ fallback }: { fallback: Map<string, Product> }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <SingleExperience />
    </SWRConfig>
  )
}

export default Page
