import type { NextPage } from 'next'
import Layout from '../components/Layout'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import Smartphone from '../components/Smartphone'

const geoUrl =
  'https://res.cloudinary.com/dl093kbg1/raw/upload/v1665340389/omn_admbnd_1_ly0tcy.json'

const Home: NextPage = () => {
  return (
    <Layout>
      <Smartphone />
      <ComposableMap
        projectionConfig={{
          scale: 900,
          rotate: [-15, 5, -15],
        }}
        width={800}
        height={400}
        style={{
          width: '100%',
          height: 'auto',
          background: '#e1eced',
          cursor: 'grab',
        }}
      >
        <ZoomableGroup center={[56, 21.5]} zoom={4} maxZoom={20}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#043c6c"
                  stroke="#e1eced"
                  strokeWidth={0.05}
                  width={'100vw'}
                  height={'100vh'}
                  transform={'0.5'}
                />
              ))
            }
          </Geographies>
          <Marker coordinates={[58.54, 23.61]}>
            <circle r={1} fill="#F53" />
          </Marker>
        </ZoomableGroup>
      </ComposableMap>
    </Layout>
  )
}

export default Home
