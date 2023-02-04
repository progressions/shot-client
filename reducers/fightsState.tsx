import { Fight, PaginationMeta, defaultPaginationMeta, defaultFight, FightsResponse } from "../types/types"

export enum FightsActions {
  RESET = "reset",
  EDIT = "edit",
  SAVING = "saving",
  SUCCESS = "success",
  PREVIOUS = "previous",
  NEXT = "next",
  FIGHT = "fight",
  RESET_FIGHT = "reset_fight",
  FIGHTS = "fights",
  UPDATE = "update",
  UPDATE_FIGHT = "update_fight",
  OPEN = "open",
  CLOSE = "close"
}

export interface FightsStateType {
  edited: boolean
  loading: boolean
  saving: boolean
  showHidden: boolean
  page: number
  fights: Fight[]
  fight: Fight
  search: string
  meta: PaginationMeta
  open: boolean
  anchorEl: Element | null
}

export type PayloadType = Fight | FightsResponse | string | Element | null

interface ActionNoPayload {
  type: Extract<FightsActions, FightsActions.RESET | FightsActions.EDIT | FightsActions.SAVING | FightsActions.SUCCESS | FightsActions.PREVIOUS | FightsActions.NEXT | FightsActions.RESET_FIGHT | FightsActions.CLOSE>
}

interface PayloadAction {
  type: Extract<FightsActions, FightsActions.FIGHT | FightsActions.FIGHTS | FightsActions.OPEN>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<FightsActions, FightsActions.UPDATE | FightsActions.UPDATE_FIGHT>
  name: string
  value: string | boolean
}

export type FightsActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialFightsState:FightsStateType = {
  edited: true,
  loading: true,
  saving: false,
  page: 1,
  fight: defaultFight,
  fights: [],
  search: "",
  meta: defaultPaginationMeta,
  showHidden: false,
  open: false,
  anchorEl: null
}

export function fightsReducer(state: FightsStateType, action: FightsActionType): FightsStateType {
  switch(action.type) {
    case FightsActions.EDIT:
      return {
        ...state,
        edited: true
      }
    case FightsActions.PREVIOUS:
      return {
        ...state,
        edited: true,
        page: state.meta["prev_page"] as number
      }
    case FightsActions.NEXT:
      return {
        ...state,
        edited: true,
        page: state.meta["next_page"] as number
      }
    case FightsActions.OPEN:
      return {
        ...state,
        edited: true,
        open: true,
        anchorEl: action.payload as Element
      }
    case FightsActions.CLOSE:
      return {
        ...state,
        edited: true,
        open: false,
        anchorEl: null
      }
    case FightsActions.SAVING:
      return {
        ...state,
        saving: true,
        edited: false
      }
    case FightsActions.SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
      }
    case FightsActions.UPDATE:
      return {
        ...state,
        edited: true,
        [action.name]: action.value
      }
    case FightsActions.UPDATE_FIGHT:
      console.log(action)
      return {
        ...state,
        edited: true,
        fight: {
          ...state.fight,
          [action.name]: action.value
        }
      }
    case FightsActions.FIGHT:
      return {
        ...state,
        edited: true,
        fight: (action.payload || initialFightsState.fight) as Fight,
      }
    case FightsActions.FIGHTS:
      const { fights, meta } = action.payload as FightsResponse
      return {
        ...state,
        loading: false,
        fights: fights,
        meta: meta,
        edited: false,
      }
    case FightsActions.RESET_FIGHT:
      return {
        ...state,
        edited: true,
        fight: defaultFight
      }
    case FightsActions.RESET:
      return initialFightsState
    default:
      return state
  }
}
