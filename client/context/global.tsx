import React, { PropsWithChildren, useEffect, useState } from 'react'
import auth from '../config/firebase'
import { User } from 'firebase/auth'

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
}

const GlobalContext = React.createContext<GlobalContextValue>({
  menuOpen: undefined,
  setMenuOpen: undefined,
  alert: undefined,
  setAlert: undefined,
  user: null,
})

export const GlobalProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [alert, setAlert] = useState<Alert>()

  const [user, setUser] = React.useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser)
    return unsubscribe
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        alert,
        setAlert,
        user,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = (): GlobalContextValue =>
  React.useContext(GlobalContext)
