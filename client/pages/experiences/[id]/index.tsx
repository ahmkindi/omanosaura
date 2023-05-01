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
import { useCallback } from 'react'
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import styles from '../../../styles/experiences.module.scss'
import Box from '../../../components/Box'
import Reviews from '../../../components/Reviews'
import { Button } from 'react-bootstrap'
import PurchaseModal from '../../../components/PurchaseModal'
import Link from 'next/link'
import { useGlobal } from '../../../context/global'
import 'react-quill/dist/quill.snow.css'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const { token } = context.req.cookies
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: product }: AxiosResponse<Product> = await axios.get(
    `${process.env.SERVER_URL}products/${id}`,
    { headers: { Cookie: `token=${token}` } }
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
  gallery = "gallery",
  purchase = "purchase"
}

const SingleExperience = () => {
  const { t, lang } = useTranslation('experiences')
  const router = useRouter()
  const { id } = router.query
  const { data: product } = useSWR(`products/${id}`, fetcher<Product>)
  const isAr = lang === 'ar'
  const { user } = useGlobal()
  const modal = router.query.experienceModal

  const closeModal = useCallback(
    () => {
      delete router.query.experienceModal
      router.push(router)
    },
    [router],
  )

  if (!product) return null

  return <Layout title={t('title')}>
    <Box style={{ textAlign: 'initial' }}>
      <Image className='rounded shadow-md' src={product.photo} width={450} height={450} alt={product.title} />
      <div className={styles.details}>
        <h3>{
          isAr ? product?.titleAr : product?.title
        }</h3>
        <h4>{
          isAr ? product?.subtitleAr : product?.subtitle
        }</h4>
        <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: isAr ? product?.descriptionAr : product?.description }} />
        <div className='flex justify-end items-end self-end gap-2 mt-1'>
          {user?.role === UserRole.admin &&
            <Link href={`/experiences/${id}/edit`} passHref>
              <Button variant="primary">
                {t('edit')}
              </Button>
            </Link>
          }
          <Button variant="outline-secondary" onClick={() => {
            router.query.experienceModal = ModalTypes.gallery
            router.push(router)
          }}>
            {t('gallery')}
          </Button>
          <Button variant="outline-primary" onClick={() => {
            router.query.experienceModal = ModalTypes.purchase
            router.push(router)
          }}>
            {t('purchase')}
          </Button>
        </div>
      </div>
    </Box>
    <Reviews product={product} />
    <Lightbox
      open={modal === ModalTypes.gallery}
      close={() => closeModal()}
      slides={[getSlide(product?.photo), ...product?.photos.map(p => getSlide(p))]}
      plugins={[Fullscreen, Zoom]}
    />
    {modal === ModalTypes.purchase && <PurchaseModal product={product} closeModal={closeModal} />}
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
