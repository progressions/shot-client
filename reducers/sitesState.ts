import type { SitesResponse, PaginationMeta, Site } from "../types/types"
import { defaultFaction, defaultPaginationMeta, defaultSite } from "../types/types"

export enum SitesActions {
  RESET = "reset",
  SAVING = "saving",
  UPDATE = "update",
  SITE = "site",
  SITES = "sites",
  NAME = "name",
}

export interface SitesStateType {
  edited: boolean
  faction: Faction
  factions: Faction[]
  loading: boolean
  saving: boolean
  name: string
  sites: Site[]
  site: Site
  meta: PaginationMeta
}

export type PayloadType = Site | SitesResponse | string

interface ActionNoPayload {
  type: Extract<SitesActions, SitesActions.RESET | SitesActions.SAVING>
}

interface PayloadAction {
  type: Extract<SitesActions, SitesActions.SITE | SitesActions.SITES | SitesActions.NAME>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<SitesActions, SitesActions.UPDATE>
  name: string
  value: string
}

export type SitesActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialSitesState: SitesStateType = {
  edited: true,
  faction: defaultFaction,
  factions: [],
  loading: false,
  saving: false,
  name: "",
  sites: [],
  site: defaultSite,
  meta: defaultPaginationMeta,
}

export function sitesReducer(state: SitesStateType, action: SitesActionType): SitesStateType {
  switch(action.type) {
    case SitesActions.RESET:
      return initialSitesState
    case SitesActions.SAVING:
      return {
        ...state,
        saving: true
      }
    case SitesActions.NAME:
      return {
        ...state,
        edited: true,
        name: (action.payload || initialSitesState.name) as string,
      }
    case SitesActions.UPDATE:
      if (action.name === "faction") {
        const faction = state.factions.find(faction => faction.id === action.value) || defaultFaction
        return {
          ...state,
          edited: true,
          [action.name]: faction
        }
      }
      return {
        ...state,
        edited: true,
        site: {
          ...state.site,
          [action.name]: action.value
        }
      }
    case SitesActions.SITE:
      return {
        ...state,
        edited: true,
        site: (action.payload || initialSitesState.site) as Site,
      }
    case SitesActions.SITES:
      const { sites, factions, meta } = action.payload as SitesResponse
      return {
        ...state,
        edited: false,
        loading: false,
        sites,
        factions,
        meta,
      }
    default:
      return state
  }
}
