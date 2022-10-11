import type { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import Layout from '../components/Layout'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'

const geoUrl =
  'https://res.cloudinary.com/dl093kbg1/raw/upload/v1665340389/omn_admbnd_1_ly0tcy.json'

const Home: NextPage = () => {
  return (
    <Layout>
      <ComposableMap
        projectionConfig={{
          scale: 900,
          rotate: [-15, 5, -15],
        }}
        width={800}
        height={400}
        style={{ width: '100%', height: 'auto', cursor: 'grab' }}
      >
        <ZoomableGroup center={[56, 21.5]} zoom={4} maxZoom={20}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#043c6c"
                  stroke="white"
                  strokeWidth={0.05}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </Layout>
  )
}

export default Home
