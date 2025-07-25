import { Fight, PaginationMeta, defaultPaginationMeta, defaultFight, FightsResponse } from "@/types/types"

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
}

export type PayloadType = Fight | FightsResponse | string | Element | null

interface ActionNoPayload {
  type: Extract<FightsActions, FightsActions.RESET | FightsActions.EDIT | FightsActions.SAVING | FightsActions.SUCCESS | FightsActions.PREVIOUS | FightsActions.NEXT | FightsActions.RESET_FIGHT>
}

interface PayloadAction {
  type: Extract<FightsActions, FightsActions.FIGHT | FightsActions.FIGHTS>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<FightsActions, FightsActions.UPDATE | FightsActions.UPDATE_FIGHT>
  name: string
  value: string | boolean | number
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
      if (action.name === "page" ) {
        return {
          ...state,
          edited: true,
          loading: true,
          page: action.value as number,
        }
      }
      return {
        ...state,
        edited: true,
        loading: true,
        page: 1,
        [action.name]: action.value
      }
    case FightsActions.UPDATE_FIGHT:
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
