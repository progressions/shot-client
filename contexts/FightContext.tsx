import { createContext, useContext, useState } from "react"

import type { Fight } from "../types/types"
import { defaultFight } from "../types/types"
import { useClient } from "./ClientContext"

export interface FightContextType {
  fight: Fight
  setFight: React.Dispatch<React.SetStateAction<Fight>> | undefined
  reloadFight: (fight: Fight) => Promise<void>
  reloadFights: (arg: ReloadFightsParams) => Promise<void>
}

interface ReloadFightsParams {
  setFights: React.Dispatch<React.SetStateAction<Fight[]>>
}

interface FightProviderProps {
  children: React.ReactNode
}

const FightContext = createContext<FightContextType>({
  fight: defaultFight,
  setFight: undefined,
  reloadFight: (fight: Fight) => { return new Promise(() => {}) },
  reloadFights: (arg: ReloadFightsParams) => { return new Promise(() => {}) }
})

export function FightProvider({ children }: FightProviderProps) {
  const { client } = useClient()
  const [fight, setFight] = useState<Fight>(defaultFight)

  async function reloadFight(fight: Fight): Promise<void> {
    const response = await client.getFight(fight)
    if (response.status === 200) {
      const data = await response.json()
      setFight(defaultFight)
      setFight(data)
    }
  }

  async function reloadFights({ setFights }: ReloadFightsParams): Promise<void> {
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

export function useFight(): FightContextType {
  return useContext(FightContext)
}
