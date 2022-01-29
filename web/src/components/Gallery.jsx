import ImgsViewer from 'react-images-viewer'
import useSWR from 'swr'
import axios from 'axios'

const Gallery = ({ trip, setGallery }) => {
  const { data: images } = useSWR(`/trip/photos/${trip}`, async (url) => {
    const { data } = await axios.get(url)

    return data.map((img) => ({ src: `data:image/jpeg;base64,${img}` }))
  })

  if (!images) return null

  return <ImgsViewer imgs={images} onClose={() => setGallery(undefined)} />
}

export default Gallery
