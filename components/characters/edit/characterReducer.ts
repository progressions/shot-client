import { defaultCharacter } from "../../../types/types"

export const initialState = {
  edited: false,
  saving: false,
  character: defaultCharacter
}

export const characterReducer = (state: any, action: any) => {
  switch(action.type) {
    case "update":
      return {
        ...state,
        edited: true,
        character: {
          ...state.character,
          [action.name]: action.value
        }
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
            [action.name]: value
          }
        }
      }
    case "description":
      return {
        ...state,
        edited: true,
        character: {
          ...state.character,
          description: {
            ...state.character.description,
            [action.name]: action.value
          }
        }
      }
    case "skills":
      return {
        ...state,
        edited: true,
        character: {
          ...state.character,
          skills: {
            ...state.character.skills,
            [action.name]: action.value
          }
        }
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
        character: action.character
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
