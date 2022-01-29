import { useContext, useEffect, useRef, useState } from 'react'
import AuthContext from '../../AuthContext'
import { Form, Button, Alert } from 'react-bootstrap'
import axios from 'axios'
import CryptoJS from 'crypto-js'

const secretKey = 'iamasecretkey'

const AdminHome = () => {
  const auth = useContext(AuthContext)
  const [incorrect, setIncorrect] = useState(false)
  const username = useRef(null)
  const password = useRef(null)

  const correctLogin = async (user, pass) => {
    try {
      const response = await axios.post(
        '/admin/',
        {},
        {
          auth: {
            username: user,
            password: pass,
          },
        }
      )
      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    const user = localStorage.getItem('username')
    const encPass = localStorage.getItem('password')
    if (encPass) {
      const bytes = CryptoJS.AES.decrypt(encPass, secretKey)
      const pass = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      if (correctLogin(user, pass)) {
        auth.setUsername(user)
        auth.setPassword(pass)
        auth.setSignedIn(true)
        return
      }
    }
    auth.setSignedIn(false)
  }, [auth])

  const handleLogin = (e) => {
    e.preventDefault()
    const pass = password.current.value
    if (correctLogin(username.current.value, pass)) {
      auth.setUsername(username.current.value)
      auth.setPassword(pass)
      auth.setSignedIn(true)
      var algo = CryptoJS.algo.SHA256.create()
      algo.update(pass, 'utf-8')
      localStorage.setItem('username', username.current.value)
      localStorage.setItem(
        'password',
        CryptoJS.AES.encrypt(JSON.stringify(pass), 'iamasecretkey').toString()
      )
      setIncorrect(false)
    } else {
      setIncorrect(true)
    }
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
    </div>
  )
}

export default AdminHome
