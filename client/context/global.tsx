import React, { PropsWithChildren, useEffect, useState } from 'react'
import auth from '../config/firebase'
import { isSignInWithEmailLink, User, signInWithEmailLink } from 'firebase/auth'
import axiosServer from '../utils/axiosServer'
import { AxiosResponse } from 'axios'
import { Role, UserRole } from '../types/requests'

export interface Alert {
  type: 'light' | 'warning' | 'success'
  message: string
}

interface GlobalContextValue {
  menuOpen?: boolean
  setMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>
  alert?: Alert
  setAlert?: React.Dispatch<React.SetStateAction<Alert | undefined>>
  user: User | null
  role: UserRole | null
  isLoading: boolean
}

const GlobalContext = React.createContext<GlobalContextValue>({
  menuOpen: undefined,
  setMenuOpen: undefined,
  alert: undefined,
  setAlert: undefined,
  user: null,
  role: null,
  isLoading: false,
})

export const GlobalProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [alert, setAlert] = useState<Alert>()

  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt('Please provide your email for confirmation')
      }

      signInWithEmailLink(auth, email ?? '', window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn')
          console.log(result)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    auth.onAuthStateChanged(async (newUser) => {
      setIsLoading(true)
      setUser(newUser)
      try {
        const resp: AxiosResponse<Role> = await axiosServer.get('user/role')
        setRole(resp.data.role)
      } catch (error) {
        console.log('failed to get user role', error)
      } finally {
        setIsLoading(false)
      }
    })
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        alert,
        setAlert,
        user,
        role,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = (): GlobalContextValue =>
  React.useContext(GlobalContext)
