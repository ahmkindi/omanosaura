import AuthContext from '../../AuthContext'
import { Table, Button } from 'react-bootstrap'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { BiImageAdd } from 'react-icons/bi'
import useSWR from 'swr'
import axios from 'axios'
import { useContext } from 'react'

const AdminTrips = () => {
  const { data: trips, mutate } = useSWR('/trips', async (url) => {
    const { data } = await axios.get(url)
    return data
  })
  const { username, password } = useContext(AuthContext)

  const handleDelete = async (tripId) => {
    await axios.post(
      `/admin/trips/delete/${tripId}`,
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

  return (
    <Table striped bordered hover style={{ margin: '2rem' }}>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>AR Title</th>
          <th>Add Photo</th>
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
                <BiImageAdd />
              </Button>
            </td>
            <td>
              <Button variant="primary">
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
  )
}

export default AdminTrips
