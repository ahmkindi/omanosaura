import ImageViewer from 'react-simple-image-viewer'
import useSWR from 'swr'
import axios from 'axios'

const Gallery = ({ trip, setGallery }) => {
  const { data } = useSWR(`/trips/photos/${trip}`, async (url) => {
    const { data } = await axios.get(url)
    return data
  })

  if (!data) return null

  return (
    <div style={{ direction: 'ltr' }}>
      <ImageViewer
        src={data.map((gallery) => `data:image/jpeg;base64,${gallery.photo}`)}
        currentIndex={0}
        disableScroll={false}
        closeOnClickOutside={false}
        onClose={() => setGallery(undefined)}
      />
    </div>
  )
}

export default Gallery
