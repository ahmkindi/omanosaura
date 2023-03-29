import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import { Product, ProductKindLabel } from '../../types/requests'
import { useMemo, useState } from 'react'
import ProductCard from '../../components/ProductCard'
import styles from '../../styles/experiences.module.scss'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useRouter } from 'next/router'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '../../utils/axiosServer'
import SearchBar from '../../components/SearchBar'
import { FullscreenControl, GeolocateControl, Marker, Popup } from 'react-map-gl'
import Pin from '../../components/Pin'
import Map from 'react-map-gl'
import Head from 'next/head'

export async function getServerSideProps() {
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: products }: AxiosResponse<Product[]> = await axios.get(
    `${process.env.SERVER_URL}products`
  )
  const { data: kinds }: AxiosResponse<ProductKindLabel[]> = await axios.get(
    `${process.env.SERVER_URL}products/kinds`
  )
  return {
    props: {
      fallback: {
        'products': products,
      },
      'kinds': kinds
    },
  }
}

const Experiences = ({ kinds }: { kinds: ProductKindLabel[] }) => {
  const { t } = useTranslation('experiences')
  const [openProduct, setOpenProduct] = useState<Product>()
  const router = useRouter()
  const { search, view } = router.query
  const { data: products } = useSWR('products', fetcher<Product[]>)

  const filteredProducts = useMemo(
    () =>
      search
        ? products?.filter(
          (p) =>
            p.title.includes(search as string) ||
            p.subtitle.includes(search as string) ||
            p.description.includes(search as string) ||
            p.titleAr.includes(search as string) ||
            p.subtitleAr.includes(search as string) ||
            p.descriptionAr.includes(search as string)
        )
        : products,
    [search, products]
  )

  const pins = useMemo(
    () =>
      filteredProducts?.map((product) => (
        <Marker
          key={`marker-${product.id}`}
          longitude={product.longitude}
          latitude={product.latitude}
          onClick={e => {
            e.originalEvent.stopPropagation();
            setOpenProduct(product);
          }}
        >
          <Pin />
          <Head>
            <link
              rel="preload"
              href={product.photo}
              as="image"
            />
          </Head>
        </Marker>
      )),
    [filteredProducts]
  )

  return (
    <>
      <Layout title={t('title')}>
        <SearchBar kinds={kinds} />
        {view === "map" ?
          <div className={styles.sketchy}>
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_TOKEN}
              initialViewState={{
                longitude: 57,
                latitude: 21,
                zoom: 3.5,
              }}
              style={{ width: '100%', height: '40rem' }}
              mapStyle="mapbox://styles/ahmkindi/clf16vx34001c01q6cf6he5s0"
              attributionControl={false}
            >
              <GeolocateControl />
              <FullscreenControl />
              {pins}
              {openProduct && (
                <Popup
                  className={styles.popup}
                  maxWidth='340px'
                  longitude={Number(openProduct.longitude)}
                  latitude={Number(openProduct.latitude)}
                  onClose={() => setOpenProduct(undefined)}
                >
                  <ProductCard product={openProduct} />
                </Popup>
              )}
            </Map>
          </div>
          : <div className='flex gap-8 flex-wrap justify-center'>
            {filteredProducts?.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        }
      </Layout>
    </>
  )
}

const Page = ({ fallback, kinds }: { fallback: Map<string, Product[]>, kinds: ProductKindLabel[] }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Experiences kinds={kinds} />
    </SWRConfig>
  )
}

export default Page
