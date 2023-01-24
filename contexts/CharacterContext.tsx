import { useEffect, useReducer, createContext, useContext } from "react"

import { useSession } from 'next-auth/react'
import Character from "../components/Character"

import { defaultUser } from "../types/types"
import type { User } from "../types/types"

import { characterReducer } from "../components/characters/edit/characterReducer"
import { defaultCharacter } from "../types/types"

interface CharacterContextParams {
  character: Character
  session: any
  jwt: string
  user: User
}

export const initialState = {
  edited: false,
  saving: false,
  character: defaultCharacter
}

const CharacterContext = createContext<CharacterContextParams>({state: {}, dispatch: () => {}})

export function CharacterProvider({ character, children }: any) {
  const [state, dispatch] = useReducer(characterReducer, {...initialState, character: character})

  return (
    <CharacterContext.Provider value={{state, dispatch}}>
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacter() {
  return useContext(CharacterContext)
}
