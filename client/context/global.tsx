import React, { PropsWithChildren, useState } from 'react'

interface GlobalContextValue {
  menuOpen?: boolean
  setMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalContext = React.createContext<GlobalContextValue>({
  menuOpen: undefined,
  setMenuOpen: undefined,
})

export const GlobalProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <GlobalContext.Provider
      value={{
        menuOpen,
        setMenuOpen,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobal = (): GlobalContextValue =>
  React.useContext(GlobalContext)
