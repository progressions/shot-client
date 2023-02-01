import { createContext, useContext } from "react"

export interface LocalStorageContextType {
  saveLocally: (key: string, value: unknown) => void
  getLocally: (key: string) => unknown | null
}

interface LocalStorageProviderProps {
  children: React.ReactNode
}

const LocalStorageContext = createContext<LocalStorageContextType>({saveLocally: () => true, getLocally: () => true})

export function LocalStorageProvider({ children }: LocalStorageProviderProps) {

  function saveLocally(key: string, value: unknown) {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value) as string)
    }
  }

  function getLocally(key: string):unknown | null {
    if (typeof localStorage !== "undefined") {
      return JSON.parse(localStorage.getItem(key) as string)
    }
    return null
  }

  return (
    <LocalStorageContext.Provider value={{saveLocally, getLocally}}>
      {children}
    </LocalStorageContext.Provider>
  )
}

export function useLocalStorage(): LocalStorageContextType {
  return useContext(LocalStorageContext)
}
