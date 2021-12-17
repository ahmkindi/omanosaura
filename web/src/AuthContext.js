import React from 'react'

const auth = {
  signedIn: false,
  setSignedIn: () => {},
  username: '',
  setUsername: () => {},
  password: '',
  setPassword: () => {},
}

export default React.createContext(auth)
