import type { Character } from "../../../types/types"
import { defaultCharacter } from "../../../types/types"

export interface CharacterStateType {
  edited: boolean
  saving: boolean
  character: Character
}

export interface CharacterStateAction {
  type: string
  name?: string
  value?: unknown
  character?: Character
}

export const initialState = {
  edited: false,
  saving: false,
  character: defaultCharacter
}

export function characterReducer(state: CharacterStateType, action: CharacterStateAction): CharacterStateType {
  switch(action.type) {
    case "edited":
      return {
        ...state,
        edited: true
      }
    case "update":
      return {
        ...state,
        edited: true,
        character: {
          ...state.character,
          [action.name as string]: action.value
        } as Character
      }
    case "action_value":
      const value = action.value === "null" ? null : action.value
      return {
        ...state,
        edited: true,
        character: {
          ...state.character,
          action_values: {
            ...state.character.action_values,
            [action.name as string]: value
          }
        } as Character
      }
    case "description":
      return {
        ...state,
        edited: true,
        character: {
          ...state.character,
          description: {
            ...state.character.description,
            [action.name as string]: action.value
          }
        } as Character
      }
    case "skills":
      return {
        ...state,
        edited: true,
        character: {
          ...state.character,
          skills: {
            ...state.character.skills,
            [action.name as string]: action.value
          }
        } as Character
      }
    case "submit":
      return {
        ...state,
        edited: false,
        saving: true,
      }
    case "replace":
      return {
        ...state,
        saving: false,
        edited: false,
        character: action.character as Character
      }
    case "reset":
      return {
        ...state,
        saving: false
      }
    default:
      return initialState
  }
}
