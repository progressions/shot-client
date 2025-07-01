import { defaultFaction, Faction, FactionsResponse, PaginationMeta, defaultPaginationMeta } from "@/types/types"

export enum FactionsActions {
  EDIT = "edit",
  OPEN = "open",
  FACTIONS = "factions",
  FACTION = "faction",
  PAGE = "page",
  RESET = "reset",
  SUCCESS = "success",
  UPDATE = "update",
  SAVING = "saving"
}

export interface FactionsStateType {
  anchorEl: Element | null
  edited: boolean
  loading: boolean
  meta: PaginationMeta
  open: boolean
  secret: boolean
  faction: Faction
  factions: Faction[]
  saving: boolean
  search: string
  page: number
}

export type PayloadType = Faction | FactionsResponse | string | Element | null | boolean | number

interface ActionNoPayload {
  type: Extract<FactionsActions, FactionsActions.RESET | FactionsActions.SUCCESS | FactionsActions.SAVING>
}

interface PayloadAction {
  type: Extract<FactionsActions, FactionsActions.FACTION | FactionsActions.FACTIONS | FactionsActions.OPEN | FactionsActions.PAGE>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<FactionsActions, FactionsActions.UPDATE | FactionsActions.EDIT>
  name?: string
  value?: string | boolean | number
}

export type FactionsActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialFactionsState: FactionsStateType = {
  anchorEl: null,
  edited: true,
  loading: true,
  meta: defaultPaginationMeta,
  open: false,
  secret: false,
  faction: defaultFaction,
  factions: [],
  search: "",
  saving: false,
  page: 1
}

export function factionsReducer(state: FactionsStateType, action: FactionsActionType): FactionsStateType {
  switch(action.type) {
    case FactionsActions.EDIT:
      return {
        ...state,
        [action.name as string]: action.value,
        edited: true,
        loading: true
      }
    case FactionsActions.SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
      }
    case FactionsActions.PAGE:
      return {
        ...state,
        edited: true,
        loading: true,
        page: action.payload as number,
      }
    case FactionsActions.UPDATE:
      if (action.name === "faction") {
        const faction = state.factions.find(faction => faction.id === action.value) || defaultFaction
        return {
          ...state,
          edited: true,
          loading: true,
          page: 1,
          faction: defaultFaction,
          [action.name as string]: faction
        }
      }

      return {
        ...state,
        edited: true,
        loading: true,
        faction: {
          ...state.faction,
          [action.name as string]: action.value
        }
      }
    case FactionsActions.FACTION:
      return {
        ...state,
        edited: true,
        page: 1,
        faction: (action.payload || initialFactionsState.faction) as Faction,
      }
    case FactionsActions.FACTIONS:
      const { factions, meta } = action.payload as FactionsResponse
      return {
        ...state,
        loading: false,
        edited: false,
        page: meta?.current_page || 1,
        factions,
        meta,
      }
    case FactionsActions.RESET:
      return initialFactionsState
    default:
      return state
  }
}

