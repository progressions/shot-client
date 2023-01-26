import { useEffect, useReducer, createContext, useContext } from "react"

import { useSession } from 'next-auth/react'

import { defaultUser } from "../types/types"
import type { User } from "../types/types"

import { initialState, characterReducer } from "../components/characters/edit/characterReducer"

interface CharacterContextParams {
  state: any
  dispatch: any
}

const CharacterContext = createContext<CharacterContextParams>({state: {}, dispatch: () => {}})

export function CharacterProvider({ character, children }: any) {
  const [state, dispatch] = useReducer(characterReducer, {...initialState, character: character})

  return (
    <CharacterContext.Provider value={{state, character, dispatch}}>
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacter() {
  return useContext(CharacterContext)
}
