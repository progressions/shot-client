import { Faction, defaultFaction, defaultJuncture, Juncture, JuncturesResponse, PaginationMeta, defaultPaginationMeta } from "@/types/types"

export enum JuncturesActions {
  EDIT = "edit",
  OPEN = "open",
  JUNCTURES = "junctures",
  JUNCTURE = "juncture",
  PAGE = "page",
  RESET = "reset",
  SUCCESS = "success",
  UPDATE = "update",
  SAVING = "saving"
}

export interface JuncturesStateType {
  anchorEl: Element | null
  edited: boolean
  loading: boolean
  meta: PaginationMeta
  open: boolean
  hidden: boolean
  juncture: Juncture
  junctures: Juncture[]
  faction: Faction
  factions: Faction[]
  saving: boolean
  search: string
  page: number
}

export type PayloadType = Juncture | JuncturesResponse | string | Element | null | boolean | number

interface ActionNoPayload {
  type: Extract<JuncturesActions, JuncturesActions.RESET | JuncturesActions.SUCCESS | JuncturesActions.SAVING>
}

interface PayloadAction {
  type: Extract<JuncturesActions, JuncturesActions.JUNCTURE | JuncturesActions.JUNCTURES | JuncturesActions.OPEN | JuncturesActions.PAGE>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<JuncturesActions, JuncturesActions.UPDATE | JuncturesActions.EDIT>
  name?: string
  value?: string | boolean | number
}

export type JuncturesActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialJuncturesState: JuncturesStateType = {
  anchorEl: null,
  edited: true,
  faction: defaultFaction,
  factions: [],
  loading: false,
  meta: defaultPaginationMeta,
  open: false,
  hidden: false,
  juncture: defaultJuncture,
  junctures: [],
  search: "",
  saving: false,
  page: 1
}

export function juncturesReducer(state: JuncturesStateType, action: JuncturesActionType): JuncturesStateType {
  switch(action.type) {
    case JuncturesActions.EDIT:
      return {
        ...state,
        [action.name as string]: action.value,
        edited: true,
        loading: false
      }
    case JuncturesActions.SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
      }
    case JuncturesActions.PAGE:
      return {
        ...state,
        edited: true,
        loading: true,
        page: action.payload as number,
      }
    case JuncturesActions.UPDATE:
      return {
        ...state,
        edited: true,
        loading: false,
        juncture: {
          ...state.juncture,
          [action.name as string]: action.value
        }
      }
    case JuncturesActions.JUNCTURE:
      return {
        ...state,
        edited: true,
        page: 1,
        juncture: (action.payload || initialJuncturesState.juncture) as Juncture,
      }
    case JuncturesActions.JUNCTURES:
      const { junctures, factions, meta } = action.payload as JuncturesResponse
      return {
        ...state,
        loading: false,
        edited: false,
        page: meta?.current_page || 1,
        junctures,
        factions,
        meta,
      }
    case JuncturesActions.RESET:
      return initialJuncturesState
    default:
      return state
  }
}

