import React, { PropsWithChildren, useEffect, useState } from 'react'
import auth from '../config/firebase'
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth'
import axiosServer from '../utils/axiosServer'
import { AxiosResponse } from 'axios'
import { Purchase, PurchaseProduct, User } from '../types/requests'
import Cookies from 'js-cookie'
import useTranslation from 'next-translate/useTranslation'

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
  purchase?: PurchaseProduct
  setPurchase?: React.Dispatch<
    React.SetStateAction<PurchaseProduct | undefined>
  >
}

const GlobalContext = React.createContext<GlobalContextValue>({
  menuOpen: undefined,
  setMenuOpen: undefined,
  alert: undefined,
  setAlert: undefined,
  user: null,
  isLoading: false,
  purchase: undefined,
  setPurchase: undefined,
})

export const GlobalProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const { t } = useTranslation('common')
  const [menuOpen, setMenuOpen] = useState(false)
  const [alert, setAlert] = useState<Alert>()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [purchase, setPurchase] = useState<PurchaseProduct>()

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) {
        email = window.prompt(t('confirmEmail'))
      }

      signInWithEmailLink(auth, email ?? '', window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn')
          setAlert?.({
            type: 'success',
            message: t('successLogin', { name: result.user.displayName }),
          })
        })
        .catch((error) => {
          setAlert?.({
            type: 'success',
            message: t('failedToSocialLogin', { msg: error.message }),
          })
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
  }, [t])

  return (
    <GlobalContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        alert,
        setAlert,
        user,
        isLoading,
        purchase,
        setPurchase,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = (): GlobalContextValue =>
  React.useContext(GlobalContext)
