import { createContext, useContext } from "react"

export interface LocalStorageContextType {
}

const LocalStorageContext = createContext<LocalStorageContextType>()

export function LocalStorageProvider({ children }: any) {

  function saveLocally(key: string, value: any) {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value) as string)
    }
  }

  function getLocally(key: string) {
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

export function useLocalStorage() {
  return useContext(LocalStorageContext)
}

