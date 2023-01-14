import { createContext, useContext, useState } from "react"

import type { Fight } from "../types/types"
import { defaultFight } from "../types/types"

export type FightContextType = [
  Fight,
  any
]

const FightContext = createContext<FightContextType>([defaultFight, ()=>{}])

export function FightProvider({ children }: any) {
  const [fight, setFight] = useState<Fight>(defaultFight)

  return (
    <FightContext.Provider value={[fight, setFight]}>
      {children}
    </FightContext.Provider>
  )
}

export function useFight() {
  return useContext(FightContext)
}
