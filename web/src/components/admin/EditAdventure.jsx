import AuthContext from '../../AuthContext'
import { Form, Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'
import { useContext, useState } from 'react'
import { getBase64 } from '../helpers/files'
import { useSWRConfig } from 'swr'
import LoadingContext from '../../LoadingContext'
import styles from './admin.module.scss'

const EditAdventure = ({ activeAdv, setActiveAdv }) => {
  const { username, password } = useContext(AuthContext)
  const { setIsLoading } = useContext(LoadingContext)
  const { mutate } = useSWRConfig()
  const [invalid, setInvalid] = useState(false)
  console.log(invalid)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const response = await axios.post('/api/admin/adventures', activeAdv, {
        auth: { username: username, password: password },
      })
      response.status === 200 ? setActiveAdv(undefined) : setInvalid(true)
      await mutate('/api/adventures')
    } catch {
      setInvalid(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoChange = (e) => {
    if (e.target.files.length > 0) {
      getBase64(e.target.files[0], (result) => {
        setActiveAdv((prev) => ({
          ...prev,
          photo: result.substring(result.indexOf(',') + 1),
        }))
      })
    }
  }

  return (
    <Form onSubmit={(e) => handleSubmit(e)} className={styles.adminPage}>
      <div>
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalTitle">
          <Form.Label column sm={2}>
            Title
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              value={activeAdv.title}
              onChange={(e) =>
                setActiveAdv((prev) => ({ ...prev, title: e.target.value }))
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
              value={activeAdv.description}
              onChange={(e) =>
                setActiveAdv((prev) => ({
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
              value={activeAdv.title_ar}
              onChange={(e) =>
                setActiveAdv((prev) => ({ ...prev, title_ar: e.target.value }))
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
              value={activeAdv.description_ar}
              onChange={(e) =>
                setActiveAdv((prev) => ({
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
        <Button onClick={() => setActiveAdv(undefined)} variant="warning">
          Cancel
        </Button>
        <Button type="submit" variant="success">
          Done
        </Button>
      </div>
    </Form>
  )
}

export default EditAdventure
