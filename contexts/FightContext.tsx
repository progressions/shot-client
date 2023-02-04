import { useEffect, createContext, useContext, useReducer } from "react"
import { FightsActions, initialFightsState, fightsReducer } from "../components/fights/fightsState"
import type { FightsStateType, FightsActionType } from "../components/fights/fightsState"

import type { Fight } from "../types/types"
import { defaultFight } from "../types/types"
import { useClient } from "./ClientContext"

export interface FightContextType {
  fight: Fight
  state: FightsStateType
  dispatch: React.Dispatch<FightsActionType>
}

interface FightProviderProps {
  children: React.ReactNode
}

const FightContext = createContext<FightContextType>({
  fight: defaultFight,
  state: initialFightsState,
  dispatch: (action: FightsActionType) => {}
})

export function FightProvider({ children }: FightProviderProps) {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(fightsReducer, initialFightsState)
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
