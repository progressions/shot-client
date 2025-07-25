import { useEffect, useReducer, createContext, useContext } from "react"

import { defaultCharacter } from "@/types/types"
import type { Character } from "@/types/types"
import { useClient, useToast } from "@/contexts"

import { CharacterActions, CharacterStateAction, CharacterStateType, initialCharacterState, characterReducer } from "@/reducers/characterState"

interface CharacterContextType {
  state: CharacterStateType
  dispatch: React.Dispatch<CharacterStateAction>
  character: Character
  updateCharacter: () => Promise<void>
  reloadCharacter: () => Promise<void>
  syncCharacter: () => Promise<void>
}

const defaultCharacterContext: CharacterContextType = {
  state: initialCharacterState,
  dispatch: () => {},
  updateCharacter: () => { return new Promise(() => {})},
  reloadCharacter: () => { return new Promise(() => {})},
  syncCharacter: () => { return new Promise(() => {})},
  character: defaultCharacter
}

const CharacterContext = createContext<CharacterContextType>(defaultCharacterContext)

interface CharacterProviderProps {
  character: Character
  children: React.ReactNode
}

export function CharacterProvider({ character:initialCharacter, children }: CharacterProviderProps) {
  const { client } = useClient()
  const [state, dispatch] = useReducer(characterReducer, {...initialCharacterState, character: initialCharacter})
  const { reload, character, edited, saving } = state
  const { toastError, toastSuccess } = useToast()

  useEffect(() => {
    if (edited) {
      const saveCharacter = async (): Promise<void> => {
        dispatch({ type: CharacterActions.SUBMIT })

        try {
          const data = await client.updateCharacter(character)
          dispatch({ type: CharacterActions.CHARACTER, payload: data })
          toastSuccess("Character updated.")
        } catch(error) {
          dispatch({ type: CharacterActions.RESET })
          toastError()
        }
      }

      const timer = setTimeout(() => {
        saveCharacter().catch(console.error)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [edited, character, dispatch, toastSuccess, toastError, client])

  async function updateCharacter():Promise<void> {
    dispatch({ type: CharacterActions.SUBMIT })

    try {
      const data = await client.updateCharacter(character)
      dispatch({ type: CharacterActions.CHARACTER, payload: data })
      toastSuccess("Character updated.")
    } catch(error) {
      dispatch({ type: CharacterActions.RESET })
      toastError()
    }
  }

  async function reloadCharacter():Promise<void> {
    dispatch({ type: CharacterActions.SUBMIT })

    try {
      const data = await client.getCharacter(character)
      dispatch({ type: CharacterActions.CHARACTER, payload: data })
      toastSuccess("Character updated.")
    } catch(error) {
      dispatch({ type: CharacterActions.RESET })
      toastError()
    }
  }

  async function syncCharacter():Promise<void> {
    dispatch({ type: CharacterActions.SUBMIT })

    try {
      const data = await client.syncCharacter(character)
      dispatch({ type: CharacterActions.CHARACTER, payload: data })
      toastSuccess("Character updated.")
    } catch(error) {
      dispatch({ type: CharacterActions.RESET })
      toastError()
    }
  }

  return (
    <CharacterContext.Provider value={{state, character, dispatch, updateCharacter, reloadCharacter, syncCharacter}}>
      {children}
    </CharacterContext.Provider>
  )
}

export function useCharacter(): CharacterContextType {
  return useContext(CharacterContext)
}
