import AuthContext from '../../AuthContext'
import { Form, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import { useContext, useState } from 'react'
import { getBase64 } from '../helpers/files'
import { useSWRConfig } from 'swr'

const EditTrip = ({ activeTrip, setActiveTrip }) => {
  const { username, password } = useContext(AuthContext)
  const { mutate } = useSWRConfig()
  const [invalid, setInvalid] = useState(false)
  console.log(invalid)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/admin/trips', activeTrip, {
        auth: { username: username, password: password },
      })
      response.status === 200 ? setActiveTrip(undefined) : setInvalid(true)
      await mutate('/api/trips')
    } catch {
      setInvalid(true)
    }
  }

  const handlePhotoChange = (e) => {
    if (e.target.files.length > 0) {
      getBase64(e.target.files[0], (result) => {
        setActiveTrip((prev) => ({
          ...prev,
          front_photo: result.substring(result.indexOf(',') + 1),
        }))
      })
    }
  }

  return (
    <Form onSubmit={(e) => handleSubmit(e)} className="mt-3">
      <div>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalTitle">
          <Form.Label column sm={2}>
            Title
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={activeTrip.title}
              onChange={(e) =>
                setActiveTrip((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalSubtitle"
        >
          <Form.Label column sm={2}>
            Subtitle
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={activeTrip.subtitle}
              onChange={(e) =>
                setActiveTrip((prev) => ({ ...prev, subtitle: e.target.value }))
              }
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalSubtitle"
        >
          <Form.Label column sm={2}>
            Description
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              style={{ height: '100px' }}
              value={activeTrip.description}
              onChange={(e) =>
                setActiveTrip((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Col>
        </Form.Group>
      </div>
      <div style={{ direction: 'rtl', marginTop: '2rem' }}>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalARTitle">
          <Form.Label column sm={2}>
            AR Title
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={activeTrip.title_ar}
              onChange={(e) =>
                setActiveTrip((prev) => ({ ...prev, title_ar: e.target.value }))
              }
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalARSubtitle"
        >
          <Form.Label column sm={2}>
            AR Subtitle
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={activeTrip.subtitle_ar}
              onChange={(e) =>
                setActiveTrip((prev) => ({
                  ...prev,
                  subtitle_ar: e.target.value,
                }))
              }
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalSubtitle"
        >
          <Form.Label column sm={2}>
            AR Description
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              style={{ height: '100px' }}
              value={activeTrip.description_ar}
              onChange={(e) =>
                setActiveTrip((prev) => ({
                  ...prev,
                  description_ar: e.target.value,
                }))
              }
            />
          </Col>
        </Form.Group>
      </div>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Front Photo (.jpg)</Form.Label>
        <Form.Control type="file" onChange={(e) => handlePhotoChange(e)} />
      </Form.Group>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Button onClick={() => setActiveTrip(undefined)} variant="warning">
          Cancel
        </Button>
        <Button type="submit" variant="success">
          Done
        </Button>
      </div>
    </Form>
  )
}

export default EditTrip
