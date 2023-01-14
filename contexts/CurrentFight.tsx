import { createContext, useContext, useState } from "react"

const CurrentFight = createContext([{}, ()=>{}])

export function CurrentFightProvider({ children }: any) {
  const [currentFight, setCurrentFight] = useState({})

  return (
    <CurrentFight.Provider value={[currentFight, setCurrentFight]}>
      {children}
    </CurrentFight.Provider>
  )
}

export function useCurrentFight() {
  return useContext(CurrentFight)
}
