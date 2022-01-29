import AuthContext from '../../AuthContext'
import { AiOutlineDelete } from 'react-icons/ai'
import { BiImageAdd } from 'react-icons/bi'
import useSWR from 'swr'
import axios from 'axios'
import { useContext } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { getBase64 } from '../helpers/files'
import { useNavigate } from 'react-router-dom'

const emptyEvent = {
  expiry: new Date(),
  photo: '',
}

const AdminEvents = () => {
  const { username, password } = useContext(AuthContext)
  const { data: events, mutate } = useSWR('/api/admin/events', async (url) => {
    const { data } = await axios.get(url, {
      auth: { username: username, password: password },
    })
    return data
  })
  const navigate = useNavigate()

  const handleDelete = async (eventId) => {
    await axios.post(
      `/api/admin/events/delete/${eventId}`,
      {},
      {
        auth: {
          username: username,
          password: password,
        },
      }
    )
    await mutate()
  }

  const handleEdit = async (event) => {
    await axios.post(`/api/admin/events`, event, {
      auth: {
        username: username,
        password: password,
      },
    })
    await mutate()
  }

  const handlePhotoChange = (e, index) => {
    if (e.target.files.length > 0) {
      getBase64(e.target.files[0], (result) => {
        events[index].photo = result.substring(result.indexOf(',') + 1)
        mutate(events, false)
        handleEdit(events[index])
      })
    }
  }

  const handleExpiryChange = (e, index) => {
    events[index].expiry = new Date(e.target.value)
    mutate(events, false)
    handleEdit(events[index])
  }

  return (
    <>
      <Button onClick={() => handleEdit(emptyEvent)}>
        New Event <BiImageAdd />
      </Button>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          margin: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {events?.map((event, index) => (
          <Card key={event.id}>
            <Card.Img
              variant="top"
              src={`data:image/jpeg;base64,${event.photo}`}
            />
            <Card.Body>
              <Card.Text>
                <Form>
                  <Form.Group controlId="expiry">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="expiry"
                      placeholder="Expiry Date"
                      value={event.expiry.substring(0, 10)}
                      onChange={(e) => handleExpiryChange(e, index)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Photo (.jpg)</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => handlePhotoChange(e, index)}
                    />
                  </Form.Group>
                  <div style={{ display: 'flex' }}>
                    <Button
                      onClick={() => navigate(`/admin/users/${event.id}`)}
                    >
                      Interested Users
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(event.id)}
                      style={{ marginLeft: 'auto' }}
                    >
                      <AiOutlineDelete />
                    </Button>
                  </div>
                </Form>
              </Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  )
}

export default AdminEvents
