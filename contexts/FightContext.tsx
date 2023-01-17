import { createContext, useContext, useState } from "react"

import type { Fight } from "../types/types"
import { defaultFight } from "../types/types"
import { useClient } from "./ClientContext"

export interface FightContextType {
  fight: Fight
  setFight: any
  reloadFight: any
  reloadFights: any
}

interface reloadFightsParams {
  setFights: React.Dispatch<React.SetStateAction<Fight[]>>
}

const FightContext = createContext<FightContextType>({
  fight: defaultFight,
  setFight: () => {},
  reloadFight: () => {},
  reloadFights: () => {}
})

export function FightProvider({ children }: any) {
  const { client } = useClient()
  const [fight, setFight] = useState<Fight>(defaultFight)

  async function reloadFight(fight: Fight) {
    const response = await client.getFight(fight)
    if (response.status === 200) {
      const data = await response.json()
      setFight(defaultFight)
      setFight(data)
    }
  }

  async function reloadFights({ setFights }: reloadFightsParams) {
    const response = await client.getFights()
    if (response.status === 200) {
      const data = await response.json()
      setFights([])
      setFights(data)
    }
  }

  return (
    <FightContext.Provider value={{ fight, setFight, reloadFight, reloadFights }}>
      {children}
    </FightContext.Provider>
  )
}

export function useFight() {
  return useContext(FightContext)
}
