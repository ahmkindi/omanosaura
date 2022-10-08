import React from 'react'
import useUser from '../hooks/useUser'

const NavBar = () => {
  const { user, isLoading, login, logout } = useUser()
  if (isLoading) {
    return null
  }
  if (user) {
    return <div onClick={() => logout()}>{user.email}</div>
  }
  return <div onClick={() => login()}>Login</div>
}

export default NavBar
