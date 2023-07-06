import { Faction, defaultFaction, defaultSite, Site, SitesResponse, PaginationMeta, defaultPaginationMeta } from "../types/types"

export enum SitesActions {
  EDIT = "edit",
  OPEN = "open",
  SITES = "sites",
  SITE = "site",
  RESET = "reset",
  SEARCH = "search",
  SUCCESS = "success",
  UPDATE = "update",
  SAVING = "saving"
}

export interface SitesStateType {
  anchorEl: Element | null
  edited: boolean
  loading: boolean
  meta: PaginationMeta
  open: boolean
  site: Site
  sites: Site[]
  faction: Faction
  factions: Faction[]
  saving: boolean
  search: string
  page?: number
}

export type PayloadType = Site | SitesResponse | string | Element | null

interface ActionNoPayload {
  type: Extract<SitesActions, SitesActions.RESET | SitesActions.EDIT | SitesActions.SUCCESS | SitesActions.SAVING>
}

interface PayloadAction {
  type: Extract<SitesActions, SitesActions.SITE | SitesActions.SITES | SitesActions.OPEN | SitesActions.SEARCH>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<SitesActions, SitesActions.UPDATE>
  name: string
  value: string | boolean
}

export type SitesActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialSitesState: SitesStateType = {
  anchorEl: null,
  edited: true,
  faction: defaultFaction,
  factions: [],
  loading: true,
  meta: defaultPaginationMeta,
  open: false,
  site: defaultSite,
  sites: [],
  search: "",
  saving: false,
}

export function sitesReducer(state: SitesStateType, action: SitesActionType): SitesStateType {
  switch(action.type) {
    case SitesActions.EDIT:
      return {
        ...state,
        edited: true
      }
    case SitesActions.SEARCH:
      return {
        ...state,
        edited: true,
        search: (action.payload || initialSitesState.search) as string,
      }
    case SitesActions.SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
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
        loading: false,
        edited: false,
        sites,
        factions,
        meta,
      }
    case SitesActions.RESET:
      return initialSitesState
    default:
      return state
  }
}
