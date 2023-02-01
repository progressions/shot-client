import { useEffect, useReducer, createContext, useContext } from "react"

import { useSession } from 'next-auth/react'

import { defaultCharacter } from "../types/types"
import type { Character, User } from "../types/types"
import { useClient } from "./ClientContext"
import { useToast } from "./ToastContext"

import { CharacterStateAction, CharacterStateType, initialState, characterReducer } from "../components/characters/edit/characterReducer"

interface CharacterContextType {
  state: CharacterStateType
  dispatch: React.Dispatch<CharacterStateAction>
  character: Character
  updateCharacter: () => Promise<void>
  reloadCharacter: () => Promise<void>
}

const defaultCharacterContext: CharacterContextType = {
  state: initialState,
  dispatch: () => {},
  updateCharacter: () => { return new Promise(() => {})},
  reloadCharacter: () => { return new Promise(() => {})},
  character: defaultCharacter
}

const CharacterContext = createContext<CharacterContextType>(defaultCharacterContext)

interface CharacterProviderProps {
  character: Character
  children: React.ReactNode
}

export function CharacterProvider({ character, children }: CharacterProviderProps) {
  const { client } = useClient()
  const [state, dispatch] = useReducer(characterReducer, {...initialState, character: character})
  const { edited, saving } = state
  const { toastError, toastSuccess } = useToast()

  useEffect(() => {
    if (edited) {
      const saveCharacter = async (): Promise<void> => {
        dispatch({ type: "submit" })

        const response = await client.updateCharacter(state.character)
        if (response.status === 200) {
          const data = await response.json()
          dispatch({ type: "replace", character: data })
          toastSuccess("Character updated.")
        } else {
          dispatch({ type: "reset" })
          toastError()
        }
      }

      const timer = setTimeout(() => {
        saveCharacter().catch(console.error)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [edited, state.character, dispatch, toastSuccess, toastError, client])

  async function updateCharacter():Promise<void> {
    dispatch({ type: "submit" })

    const response = await client.updateCharacter(state.character)
    if (response.status === 200) {
      const data = await response.json()
      dispatch({ type: "replace", character: data })
      toastSuccess("Character updated.")
    } else {
      dispatch({ type: "reset" })
      toastError()
    }
  }

  async function reloadCharacter():Promise<void> {
    dispatch({ type: "submit" })

    const response = await client.getCharacter(state.character)
    if (response.status === 200) {
      const data = await response.json()
      dispatch({ type: "replace", character: data })
      toastSuccess("Character updated.")
    } else {
      dispatch({ type: "reset" })
      toastError()
    }
  }

  return (
    <CharacterContext.Provider value={{state, character, dispatch, updateCharacter, reloadCharacter}}>
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacter(): CharacterContextType {
  return useContext(CharacterContext)
}
