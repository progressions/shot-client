import { useEffect, createContext, useContext, useReducer } from "react"
import { FightActions, initialFightState, fightReducer } from "../reducers/fightState"
import type { FightStateType, FightActionType } from "../reducers/fightState"

import type { Fight } from "../types/types"
import { defaultFight } from "../types/types"
import { useClient } from "./ClientContext"

export interface FightContextType {
  fight: Fight
  state: FightStateType
  dispatch: React.Dispatch<FightActionType>
}

interface FightProviderProps {
  children: React.ReactNode
}

const FightContext = createContext<FightContextType>({
  fight: defaultFight,
  state: initialFightState,
  dispatch: (action: FightActionType) => {}
})

export function FightProvider({ children }: FightProviderProps) {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(fightReducer, initialFightState)
  const { fight, edited } = state

  return (
    <FightContext.Provider value={{ fight, state, dispatch }}>
      {children}
    </FightContext.Provider>
  )
}

export function useFight(): FightContextType {
  return useContext(FightContext)
}
