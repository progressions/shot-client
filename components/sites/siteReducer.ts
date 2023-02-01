import { defaultSite } from "../../types/types"
import type { Site } from "../../types/types"

export interface SiteStateType {
  error: boolean
  loading: boolean
  site: Site
}

export interface NoPayloadType {
  type: "saving" | "reset"
}

export interface UpdateType {
  type: "update"
  name: string
  value: string
}

export type SiteActionType = NoPayloadType | UpdateType

export const initialState: SiteStateType = {
  error: false,
  loading: false,
  site: defaultSite
}

export function siteReducer(state: SiteStateType, action: SiteActionType) {
  switch(action.type) {
    case "update":
      return {
        ...state,
        site: {
          ...state.site,
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
