import { Faction, defaultFaction, defaultParty, Party, PartiesResponse, PaginationMeta, defaultPaginationMeta } from "@/types/types"

export enum PartiesActions {
  EDIT = "edit",
  OPEN = "open",
  PARTIES = "parties",
  PARTY = "party",
  PAGE = "page",
  RESET = "reset",
  SUCCESS = "success",
  UPDATE = "update",
  SAVING = "saving"
}

export interface PartiesStateType {
  anchorEl: Element | null
  edited: boolean
  faction: Faction
  factions: Faction[]
  loading: boolean
  meta: PaginationMeta
  open: boolean
  party: Party
  parties: Party[]
  search: string
  secret: boolean
  saving: boolean
  page?: number
}

export type PayloadType = Party | PartiesResponse | string | Element | number | null

interface ActionNoPayload {
  type: Extract<PartiesActions, PartiesActions.RESET | PartiesActions.SUCCESS | PartiesActions.SAVING>
}

interface PayloadAction {
  type: Extract<PartiesActions, PartiesActions.PARTY | PartiesActions.PARTIES | PartiesActions.OPEN | PartiesActions.PAGE>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<PartiesActions, PartiesActions.UPDATE | PartiesActions.EDIT>
  name?: string
  value?: string | boolean | number
}

export type PartiesActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialPartiesState: PartiesStateType = {
  anchorEl: null,
  edited: true,
  faction: defaultFaction,
  factions: [],
  loading: true,
  meta: defaultPaginationMeta,
  open: false,
  party: defaultParty,
  parties: [],
  secret: false,
  search: "",
  saving: false,
  page: 1
}

export function partiesReducer(state: PartiesStateType, action: PartiesActionType): PartiesStateType {
  switch(action.type) {
    case PartiesActions.EDIT:
      return {
        ...state,
        [action.name as string]: action.value,
        edited: true
      }
    case PartiesActions.OPEN:
      return {
        ...state,
        edited: true,
        open: true,
        anchorEl: action.payload as Element
      }
    case PartiesActions.SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
      }
    case PartiesActions.PAGE:
      return {
        ...state,
        edited: true,
        loading: true,
        page: action.payload as number,
      }
    case PartiesActions.UPDATE:
      if (action.name === "faction") {
        const faction = state.factions.find(faction => faction.id === action.value) || defaultFaction
        return {
          ...state,
          edited: true,
          page: initialPartiesState.page,
          [action.name as string]: faction
        }
      }
      return {
        ...state,
        edited: true,
        loading: true,
        page: initialPartiesState.page,
        party: {
          ...state.party,
          [action.name as string]: action.value
        }
      }
    case PartiesActions.PARTY:
      return {
        ...state,
        edited: true,
        loading: true,
        page: 1,
        party: (action.payload || initialPartiesState.party) as Party,
      }
    case PartiesActions.PARTIES:
      const { parties, factions, meta } = action.payload as PartiesResponse
      return {
        ...state,
        loading: false,
        edited: false,
        parties,
        factions,
        meta,
        page: meta?.current_page || 1,
      }
    case PartiesActions.RESET:
      return initialPartiesState
    default:
      return state
  }
}
