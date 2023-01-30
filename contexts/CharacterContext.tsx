import { useEffect, useReducer, createContext, useContext } from "react"

import { useSession } from 'next-auth/react'

import { defaultCharacter } from "../types/types"
import type { Character, User } from "../types/types"
import { useClient } from "./ClientContext"
import { useToast } from "./ToastContext"

import { initialState, characterReducer } from "../components/characters/edit/characterReducer"

interface CharacterContextParams {
  state: any
  dispatch: any
  character: Character
  updateCharacter: any
  reloadCharacter: any
}

const CharacterContext = createContext<CharacterContextParams>({state: {}, dispatch: () => {}, updateCharacter: () => {}, reloadCharacter: () => {}, character: defaultCharacter})

export function CharacterProvider({ character, children }: any) {
  const { client } = useClient()
  const [state, dispatch] = useReducer(characterReducer, {...initialState, character: character})
  const { edited, saving } = state
  const { toastError, toastSuccess } = useToast()

  useEffect(() => {
    if (edited) {
      const saveCharacter = async () => {
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

  async function updateCharacter() {
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

  async function reloadCharacter() {
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

export function useCharacter() {
  return useContext(CharacterContext)
}
