import { createContext, useContext, useState } from "react"

import type { Fight } from "../types/types"
import { defaultFight } from "../types/types"

const FightContext = createContext([{}, ()=>{}])

export function FightProvider({ children }: any) {
  const [fight, setFight] = useState(defaultFight)

  return (
    <FightContext.Provider value={[fight, setFight]}>
      {children}
    </FightContext.Provider>
  )
}

export function useFight() {
  return useContext(FightContext)
}
