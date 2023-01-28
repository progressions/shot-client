import { createContext, useContext } from "react"

export interface LocalStorageContextType {
  saveLocally: (key: string, value: any) => any
  getLocally: (key: string) => any
}

const LocalStorageContext = createContext<LocalStorageContextType>({saveLocally: () => true, getLocally: () => true})

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

