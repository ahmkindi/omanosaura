import AuthContext from '../../AuthContext'
import { Table, Button } from 'react-bootstrap'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { BiImageAdd } from 'react-icons/bi'
import useSWR from 'swr'
import axios from 'axios'
import { useContext, useState } from 'react'
import EditTrip from './EditTrip'
import { useNavigate } from 'react-router-dom'
export const emptyTrip = {
  title: '',
  title_ar: '',
  subtitle: '',
  subtitle_ar: '',
  description: '',
  description_ar: '',
  front_photo: '',
}

const AdminTrips = () => {
  const { data: trips, mutate } = useSWR('/api/trips', async (url) => {
    const { data } = await axios.get(url)
    return data
  })
  const { username, password } = useContext(AuthContext)
  const [activeTrip, setActiveTrip] = useState()
  const navigate = useNavigate()

  const handleDelete = async (tripId) => {
    await axios.post(
      `/api/admin/trips/delete/${tripId}`,
      {},
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    mutate(trips)
  }

  if (activeTrip)
    return <EditTrip activeTrip={activeTrip} setActiveTrip={setActiveTrip} />
  return (
    <>
      <Button onClick={() => setActiveTrip(emptyTrip)}>New Trip</Button>
      <Table striped bordered hover style={{ margin: '2rem' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>AR Title</th>
            <th>Gallery</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {trips?.map((trip, index) => (
            <tr key={trip.id}>
              <td>{index + 1}</td>
              <td>{trip.title}</td>
              <td>{trip.title_ar}</td>
              <td>
                <Button variant="primary">
                  <BiImageAdd
                    onClick={() => navigate(`/admin/trip/photos/${trip.id}`)}
                  />
                </Button>
              </td>
              <td>
                <Button variant="primary" onClick={() => setActiveTrip(trip)}>
                  <AiOutlineEdit />
                </Button>
              </td>
              <td>
                <Button
                  variant="danger"
                  onClick={async () => await handleDelete(trip.id)}
                >
                  <AiOutlineDelete />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default AdminTrips
