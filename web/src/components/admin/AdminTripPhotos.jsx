import AuthContext from '../../AuthContext'
import { BiImageAdd } from 'react-icons/bi'
import { AiOutlineDelete } from 'react-icons/ai'
import useSWR from 'swr'
import axios from 'axios'
import { useContext, useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { getBase64 } from '../helpers/files'
import { useParams } from 'react-router-dom'
import LoadingContext from '../../LoadingContext'
import styles from './admin.module.scss'

const AdminTripPhotos = () => {
  const { username, password } = useContext(AuthContext)
  const { setIsLoading } = useContext(LoadingContext)
  const { id } = useParams()
  const { data: photos, mutate } = useSWR(
    `/api/trips/photos/${id}`,
    async (url) => {
      const { data } = await axios.get(url, {
        auth: { username: username, password: password },
      })
      return data
    }
  )
  const [newPhotos, setNewPhotos] = useState([])

  const handleDelete = async (photoId) => {
    setIsLoading(true)
    await axios.post(
      `/api/admin/trips/photos/${photoId}`,
      {},
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    await mutate()
    setIsLoading(false)
  }

  const handleAddPhotos = async () => {
    if (newPhotos.length === 0) return
    setIsLoading(true)
    await axios.post(
      `/api/admin/trips/photos`,
      newPhotos.map((p) => ({ trip_id: id, photo: p })),
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    setNewPhotos([])
    await mutate()
    setIsLoading(false)
  }

  const handlePhotoChange = (e) => {
    setNewPhotos([])
    for (let i = 0; i < e.target.files.length; i++) {
      getBase64(e.target.files[i], (result) => {
        setNewPhotos((prev) => [
          ...prev,
          result.substring(result.indexOf(',') + 1),
        ])
      })
    }
  }
  return (
    <div className={styles.adminPage}>
      <Form.Control
        type="file"
        onChange={(e) => handlePhotoChange(e)}
        multiple
      />
      <Button onClick={() => handleAddPhotos()}>
        Add Photos <BiImageAdd />
      </Button>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          margin: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {photos?.map((photo) => (
          <Card key={photo.id}>
            <Card.Img
              variant="top"
              src={`data:image/jpeg;base64,${photo.photo}`}
            />
            <Card.Body>
              <Card.Text>
                <Button variant="danger" onClick={() => handleDelete(photo.id)}>
                  <AiOutlineDelete />
                </Button>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AdminTripPhotos
