import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import { Product } from '../../types/requests'
import useSWR, { SWRConfig } from 'swr'
import "yet-another-react-lightbox/styles.css";
import { useRouter } from 'next/router'
import { fetcher } from '../../utils/axiosServer'
import Image from 'next/image'
import { useState } from 'react'
import Lightbox, { SlideImage } from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import styles from '../../styles/experiences.module.scss'
import Box from '../../components/Box'
import Section from '../../components/Section'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  const { session_id } = context.req.cookies
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: product }: AxiosResponse<Product> = await axios.get(
    `http://localhost:3000/server/products/${id}`,
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

const SingleExperience = () => {
  const { t, lang } = useTranslation('experiences')
  const router = useRouter()
  const { id } = router.query
  const { data: product } = useSWR(`products/${id}`, fetcher<Product>) 
  const [openGallery, setOpenGallery] = useState(false)
  const isAr = lang === 'ar'

  if (!product) return null

  return <Layout title={t('title')}>
    <Box>
      <Image src={product.photo} width={400} height={400} alt={product.title} onClick={() => setOpenGallery(true)} />
      <div className={styles.details}>
        <h3>{
isAr ? product?.titleAr : product?.title
        }</h3>
        <h4>{
isAr ? product?.subtitleAr : product?.subtitle
        }</h4>
      </div>
    </Box>
      <Reviews />
      <Lightbox
        open={openGallery}
        close={() => setOpenGallery(false)}
        slides={[getSlide(product?.photo), ...product?.photos.map(p => getSlide(p))]}
        plugins={[Fullscreen, Thumbnails, Zoom]}
      />
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
