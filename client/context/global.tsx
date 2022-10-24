import React, { PropsWithChildren, useState } from 'react'

export interface Alert {
  type: 'light' | 'warning' | 'success'
  message: string
}

interface GlobalContextValue {
  menuOpen?: boolean
  setMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>
  alert?: Alert
  setAlert?: React.Dispatch<React.SetStateAction<Alert | undefined>>
}

const GlobalContext = React.createContext<GlobalContextValue>({
  menuOpen: undefined,
  setMenuOpen: undefined,
  alert: undefined,
  setAlert: undefined,
})

export const GlobalProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [alert, setAlert] = useState<Alert>()
  return (
    <GlobalContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
        alert,
        setAlert,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = (): GlobalContextValue =>
  React.useContext(GlobalContext)
