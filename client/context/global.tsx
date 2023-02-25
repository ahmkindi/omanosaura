import React, { PropsWithChildren, useEffect, useState } from 'react'
import auth from '../config/firebase'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import axiosServer from '../utils/axiosServer'
import { AxiosResponse } from 'axios'
import { User } from '../types/requests'
import Cookies from 'js-cookie'

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
  isLoading: boolean
}

const GlobalContext = React.createContext<GlobalContextValue>({
  menuOpen: undefined,
  setMenuOpen: undefined,
  alert: undefined,
  setAlert: undefined,
  user: null,
  isLoading: false,
})

export const GlobalProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [alert, setAlert] = useState<Alert>()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

    auth.onIdTokenChanged(async (newUser) => {
      setIsLoading(true)
      try {
        if (!newUser) {
          setUser(null)
          Cookies.remove('token')
        } else {
          const token = await newUser.getIdToken()
          Cookies.set('token', token)
          const resp: AxiosResponse<User> = await axiosServer.get('user')
          setUser(resp.data)
        }
      } catch (error) {
        console.log('failed to get user', error)
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
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = (): GlobalContextValue =>
  React.useContext(GlobalContext)
