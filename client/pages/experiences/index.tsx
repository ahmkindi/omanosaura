import useTranslation from 'next-translate/useTranslation'
import Layout from '../../components/Layout'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import useWindowDimensions from '../../hooks/useWindowDimentions'
import { Product } from '../../types/requests'
import { useMemo, useState } from 'react'
import ProductCard from '../../components/ProductCard'
import { useRouter } from 'next/router'
import axiosStatic, { AxiosInstance, AxiosResponse } from 'axios'
import applyConverters from 'axios-case-converter'
import useSWR, { SWRConfig } from 'swr'
import { fetcher } from '../../utils/axiosServer'
import SearchBar from '../../components/SearchBar'

export async function getServerSideProps() {
  const axios = applyConverters(axiosStatic as any) as AxiosInstance
  const { data: products }: AxiosResponse<Product[]> = await axios.get(
    'http://localhost:3000/server/products'
  )
  return {
    props: {
      fallback: {
        'products': products,
      },
    },
  }
}

const geoUrl =
  'https://res.cloudinary.com/dl093kbg1/raw/upload/v1665340389/omn_admbnd_1_ly0tcy.json'

const Experiences = () => {
  const { t } = useTranslation('experiences')
  const { width, height } = useWindowDimensions()
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

  return (
    <Layout title={t('title')}>
      <SearchBar />
      {view === "list" ? <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
        {filteredProducts?.map(p => <ProductCard key={p.id} product={p} />)}
      </div> : 
      <ComposableMap
        projectionConfig={{
          scale: 10000,
          rotate: [-15, 5, -15],
        }}
        height={
          height && width
            ? width < 900
              ? 500
              : Math.max(height - 330, 500)
            : undefined
        }
        width={width ? Math.min(width, 900) : undefined}
        style={{
          margin: '4px',
          marginBottom: '3rem',
          background: '#e1eced',
          boxShadow:
            'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
          cursor: 'grab',
        }}
      >
        <ZoomableGroup
          center={[56, 21.5]}
          zoom={0.7}
          maxZoom={20}
          minZoom={0.3}
          onClick={() => setOpenProduct(undefined)}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#043c6c"
                  stroke="#e1eced"
                  strokeWidth={0.05}
                />
              ))
            }
          </Geographies>
          {filteredProducts?.map((p) => (
            <Marker
              key={p.id}
              coordinates={[p.longitude, p.latitude]}
              onClick={(e: React.MouseEvent<SVGPathElement>) => {
                e.stopPropagation()
                setOpenProduct(p)
              }}
              viewBox="0 0 50 50"
              cursor={'pointer'}
            >
              <g
                fill="none"
                stroke="var(--orange)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <circle cx="12" cy="10" r="3" fill="var(--orange)" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
              </g>
              {openProduct?.id === p.id && (
                    <foreignObject width={350} height={500} y={5} x={-175}>
              <ProductCard product={openProduct} />
                    </foreignObject>
              )}
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    }
        </Layout>
  )
}

const Page = ({ fallback }: { fallback: Map<string, Product[]>}) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Experiences />
    </SWRConfig>
  ) 
}

export default Page
