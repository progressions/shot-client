import type { Advancement } from "../types/types"
import { defaultAdvancement } from "../types/types"

export enum AdvancementActions {
  SAVING = "saving",
  RESET = "reset",
  UPDATE = "update"
}

export interface AdvancementStateType {
  error: boolean
  loading: boolean
  advancement: Advancement
}

interface ActionNoPayload {
  type: "saving" | "reset"
}

interface UpdateAction {
  type: "update"
  name: string
  value: string
}

export type AdvancementActionType = ActionNoPayload | UpdateAction

export const initialState: AdvancementStateType = {
  error: false,
  loading: false,
  advancement: defaultAdvancement
}

export function advancementReducer(state: AdvancementStateType, action: AdvancementActionType) {
  switch(action.type) {
    case "update":
      return {
        ...state,
        advancement: {
          ...state.advancement,
          [action.name]: action.value
        }
      }
    case "saving":
      return {
        ...state,
        loading: true
      }
    case "reset":
      return initialState
    default:
      return state
  }
}
