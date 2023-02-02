import type { Character } from "../../../types/types"
import { defaultCharacter } from "../../../types/types"

export enum CharacterActions {
  EDITED = "edited",
  UPDATE = "update",
  ACTION_VALUE = "action_value",
  DESCRIPTION = "description",
  SKILLS = "skills",
  SUBMIT = "submit",
  CHARACTER = "character",
  RESET = "reset"
}

interface ActionNoPayload {
  type: Extract<CharacterActions, CharacterActions.EDITED | CharacterActions.SUBMIT | CharacterActions.RESET>
}

interface UpdateAction {
  type: Extract<CharacterActions, CharacterActions.UPDATE | CharacterActions.ACTION_VALUE | CharacterActions.DESCRIPTION | CharacterActions.SKILLS>
  name: string
  value: string | boolean | number
}

interface PayloadAction {
  type: Extract<CharacterActions, CharacterActions.CHARACTER>
  payload: Character
}

export interface CharacterStateType {
  edited: boolean
  saving: boolean
  character: Character
}

export type CharacterStateAction = ActionNoPayload | UpdateAction | PayloadAction

export const initialCharacterState:CharacterStateType = {
  edited: false,
  saving: false,
  character: defaultCharacter
}

export function characterReducer(state: CharacterStateType, action: CharacterStateAction): CharacterStateType {
  switch(action.type) {
    case CharacterActions.EDITED:
      return {
        ...state,
        edited: true
      }
    case CharacterActions.UPDATE:
      return {
        ...state,
        edited: true,
        character: {
          ...state.character,
          [action.name as string]: action.value
        } as Character
      }
    case CharacterActions.ACTION_VALUE:
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
    case CharacterActions.DESCRIPTION:
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
    case CharacterActions.SKILLS:
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
    case CharacterActions.SUBMIT:
      return {
        ...state,
        edited: false,
        saving: true,
      }
    case CharacterActions.CHARACTER:
      return {
        ...state,
        saving: false,
        edited: false,
        character: action.payload as Character
      }
    case CharacterActions.RESET:
      return {
        ...state,
        saving: false
      }
    default:
      return initialCharacterState
  }
}
