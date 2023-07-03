import { Party, PartiesResponse, PaginationMeta, defaultPaginationMeta } from "../types/types"

export enum PartiesActions {
  EDIT = "edit",
  OPEN = "open",
  PARTIES = "parties",
  PARTY = "party",
  RESET = "reset",
  SUCCESS = "success",
  UPDATE = "update"
}

export interface PartiesStateType {
  anchorEl: Element | null
  edited: boolean
  loading: boolean
  meta: PaginationMeta
  open: boolean
  party: Party | null
  parties: Party[]
  saving: boolean
  search: string
}

export type PayloadType = Party | PartiesResponse | string | Element | null

interface ActionNoPayload {
  type: Extract<PartiesActions, PartiesActions.RESET | PartiesActions.EDIT | PartiesActions.SUCCESS>
}

interface PayloadAction {
  type: Extract<PartiesActions, PartiesActions.PARTY | PartiesActions.PARTIES | PartiesActions.OPEN>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<PartiesActions, PartiesActions.UPDATE>
  name: string
  value: string | boolean
}

export type PartiesActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialPartiesState: PartiesStateType = {
  anchorEl: null,
  edited: true,
  loading: true,
  meta: defaultPaginationMeta,
  open: false,
  party: null,
  parties: [],
  search: "",
  saving: false,
}

export function partiesReducer(state: PartiesStateType, action: PartiesActionType): PartiesStateType {
  switch(action.type) {
    case PartiesActions.EDIT:
      return {
        ...state,
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
    case PartiesActions.UPDATE:
      return {
        ...state,
        edited: true,
        [action.name]: action.value
      }
    case PartiesActions.PARTY:
      return {
        ...state,
        edited: true,
        party: (action.payload || initialPartiesState.party) as Party,
      }
    case PartiesActions.PARTIES:
      const { parties, meta } = action.payload as PartiesResponse
      return {
        ...state,
        loading: false,
        parties: parties,
        meta: meta,
        edited: false,
      }
    case PartiesActions.RESET:
      return initialPartiesState
    default:
      return state
  }
}
