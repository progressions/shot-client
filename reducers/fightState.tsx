import { Fight, PaginationMeta, defaultPaginationMeta, defaultFight } from "../types/types"

export enum FightActions {
  RESET = "reset",
  EDIT = "edit",
  SAVING = "saving",
  SUCCESS = "success",
  PREVIOUS = "previous",
  NEXT = "next",
  FIGHT = "fight",
  UPDATE = "update",
  UPDATE_FIGHT = "update_fight",
  OPEN = "open",
  CLOSE = "close"
}

export interface FightStateType {
  edited: boolean
  loading: boolean
  saving: boolean
  showHidden: boolean
  page: number
  fight: Fight
  search: string
  open: boolean
  anchorEl: Element | null
}

export type PayloadType = Fight | string | Element | null

interface ActionNoPayload {
  type: Extract<FightActions, FightActions.RESET | FightActions.EDIT | FightActions.SAVING | FightActions.SUCCESS | FightActions.PREVIOUS | FightActions.NEXT | FightActions.CLOSE>
}

interface PayloadAction {
  type: Extract<FightActions, FightActions.FIGHT | FightActions.OPEN>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<FightActions, FightActions.UPDATE | FightActions.UPDATE_FIGHT>
  name: string
  value: string | boolean
}

export type FightActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialFightState:FightStateType = {
  edited: true,
  loading: true,
  saving: false,
  page: 1,
  fight: defaultFight,
  search: "",
  showHidden: false,
  open: false,
  anchorEl: null
}

export function fightReducer(state: FightStateType, action: FightActionType): FightStateType {
  switch(action.type) {
    case FightActions.EDIT:
      return {
        ...state,
        edited: true
      }
    case FightActions.OPEN:
      return {
        ...state,
        edited: true,
        open: true,
        anchorEl: action.payload as Element
      }
    case FightActions.CLOSE:
      return {
        ...state,
        edited: true,
        open: false,
        anchorEl: null
      }
    case FightActions.SAVING:
      return {
        ...state,
        saving: true,
        edited: false
      }
    case FightActions.SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
      }
    case FightActions.UPDATE:
      return {
        ...state,
        edited: true,
        [action.name]: action.value
      }
    case FightActions.UPDATE_FIGHT:
      console.log(action)
      return {
        ...state,
        edited: true,
        fight: {
          ...state.fight,
          [action.name]: action.value
        }
      }
    case FightActions.FIGHT:
      return {
        ...state,
        edited: true,
        fight: (action.payload || initialFightState.fight) as Fight,
      }
    case FightActions.RESET:
      return initialFightState
    default:
      return state
  }
}
