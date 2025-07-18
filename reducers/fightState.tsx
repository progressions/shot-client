import { Fight, PaginationMeta, defaultPaginationMeta, defaultFight } from "@/types/types"

export enum FightActions {
  RESET = "reset",
  EDIT = "edit",
  SAVING = "saving",
  SUCCESS = "success",
  ERROR = "error",
  ATTACK = "attack",
  CHASE = "chase",
  INITIATIVE = "initiative",
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
  notFound: boolean
  showHidden: boolean
  attacking: boolean
  chasing: boolean
  initiative: boolean
  error: string
  fight: Fight
  search: string
  open: boolean
  anchorEl: Element | null
}

export type PayloadType = Fight | string | Element | Error | boolean | null

interface ActionNoPayload {
  type: Extract<FightActions, FightActions.RESET | FightActions.EDIT | FightActions.SAVING | FightActions.SUCCESS | FightActions.CLOSE>
}

interface PayloadAction {
  type: Extract<FightActions, FightActions.FIGHT | FightActions.OPEN | FightActions.ERROR | FightActions.ATTACK | FightActions.CHASE | FightActions.INITIATIVE>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<FightActions, FightActions.UPDATE | FightActions.UPDATE_FIGHT>
  name: string
  value: string | boolean | number
}

export type FightActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialFightState:FightStateType = {
  edited: true,
  loading: true,
  saving: false,
  notFound: false,
  attacking: false,
  chasing: false,
  initiative: false,
  error: "",
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
    case FightActions.ATTACK:
      return {
        ...state,
        attacking: action.payload as boolean,
        chasing: false,
        edited: false
      }
    case FightActions.CHASE:
      return {
        ...state,
        attacking: false,
        chasing: action.payload as boolean,
        edited: false
      }
    case FightActions.INITIATIVE:
      return {
        ...state,
        initiative: action.payload as boolean,
        edited: false
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
    case FightActions.ERROR:
      const { message } = action.payload as Error
      return {
        ...state,
        error: message as string,
        loading: false,
        saving: false,
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
