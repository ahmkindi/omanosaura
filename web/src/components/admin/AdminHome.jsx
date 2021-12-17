import { useContext, useRef, useState } from 'react'
import AuthContext from '../../AuthContext'
import { Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'

const AdminHome = () => {
  const auth = useContext(AuthContext)
  const [incorrect, setIncorrect] = useState(false)
  const username = useRef(null)
  const password = useRef(null)

  const handleLogin = (e) => {
    e.preventDefault()
    axios
      .post(
        'admin/',
        {},
        {
          auth: {
            username: username.current.value,
            password: password.current.value,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          auth.setUsername(username.current.value)
          auth.setPassword(password.current.value)
          auth.setSignedIn(true)
        } else {
          setIncorrect(true)
        }
      })
      .catch(() => setIncorrect(true))
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        margin: '2rem',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {!auth.signedIn && (
        <>
          <Form onSubmit={(e) => handleLogin(e)}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control ref={username} type="text" placeholder="Username" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                ref={password}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          {incorrect && (
            <Alert variant="warning">incorrect login details</Alert>
          )}
        </>
      )}
      {auth.signedIn && (
        <>
          <Link to="/admin/trips">trips</Link>
          <Link to="/admin/adventures">adventures</Link>
        </>
      )}
    </div>
  )
}

export default AdminHome
