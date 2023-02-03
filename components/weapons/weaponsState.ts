import type { WeaponCategory, Juncture, PaginationMeta, Weapon } from "../../types/types"
import { defaultPaginationMeta, defaultWeapon } from "../../types/types"

export enum WeaponsActions {
  RESET = "reset",
  EDIT = "edit",
  SAVING = "saving",
  SUCCESS = "success",
  PREVIOUS = "previous",
  NEXT = "next",
  CATEGORY = "cateory",
  JUNCTURE = "juncture",
  WEAPON = "weapon",
  WEAPONS = "weapons",
  NAME = "name",
  UPDATE = "update"
}

export interface WeaponsStateType {
  edited: boolean
  loading: boolean
  saving: boolean
  page: number
  juncture: Juncture
  junctures: Juncture[]
  category: WeaponCategory
  categories: WeaponCategory[]
  name: string
  weapon: Weapon
  weapons: Weapon[]
  meta: PaginationMeta
}

export type PayloadType = WeaponCategory | Juncture | Weapon | WeaponsResponse | string

interface ActionNoPayload {
  type: Extract<WeaponsActions, WeaponsActions.RESET | WeaponsActions.EDIT | WeaponsActions.SAVING | WeaponsActions.SUCCESS | WeaponsActions.PREVIOUS | WeaponsActions.NEXT>
}

interface PayloadAction {
  type: Extract<WeaponsActions, WeaponsActions.JUNCTURE | WeaponsActions.CATEGORY | WeaponsActions.WEAPON | WeaponsActions.WEAPONS | WeaponsActions.NAME>
  payload: PayloadType
}

interface UpdateAction {
  type: Extract<WeaponsActions, WeaponsActions.UPDATE>
  name: string
  value: string
}

export interface WeaponsResponse {
  weapons: Weapon[]
  meta: PaginationMeta
  junctures: Juncture[]
  categories: WeaponCategory[]
}

export type WeaponsActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialWeaponsState:WeaponsStateType = {
  edited: true,
  loading: true,
  saving: false,
  page: 1,
  juncture: "",
  junctures: [],
  category: "",
  categories: [],
  name: "",
  weapon: defaultWeapon,
  weapons: [],
  meta: defaultPaginationMeta
}

export function weaponsReducer(state: WeaponsStateType, action: WeaponsActionType): WeaponsStateType {
  switch(action.type) {
    case WeaponsActions.EDIT:
      return {
        ...state,
        edited: true
      }
    case WeaponsActions.PREVIOUS:
      return {
        ...state,
        edited: true,
        page: state.meta["prev_page"] as number
      }
    case WeaponsActions.NEXT:
      return {
        ...state,
        edited: true,
        page: state.meta["next_page"] as number
      }
    case WeaponsActions.SAVING:
      return {
        ...state,
        saving: true,
        edited: false
      }
    case WeaponsActions.SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
      }
    case WeaponsActions.JUNCTURE:
      return {
        ...state,
        edited: true,
        juncture: (action.payload || initialWeaponsState.juncture) as Juncture,
        weapon: initialWeaponsState.weapon
      }
    case WeaponsActions.CATEGORY:
      return {
        ...state,
        edited: true,
        category: (action.payload || initialWeaponsState.category) as WeaponCategory,
        weapon: initialWeaponsState.weapon
      }
    case WeaponsActions.NAME:
      return {
        ...state,
        edited: true,
        name: (action.payload || initialWeaponsState.name) as string,
      }
    case WeaponsActions.UPDATE:
      return {
        ...state,
        edited: true,
        weapon: {
          ...state.weapon,
          [action.name]: action.value
        }
      }
    case WeaponsActions.WEAPON:
      return {
        ...state,
        edited: true,
        weapon: (action.payload || initialWeaponsState.weapon) as Weapon,
      }
    case WeaponsActions.WEAPONS:
      const { weapons, meta, junctures, categories } = action.payload as WeaponsResponse
      return {
        ...state,
        loading: false,
        weapons: weapons,
        meta: meta,
        edited: false,
        junctures: junctures,
        categories: categories
      }
    case WeaponsActions.RESET:
      return initialWeaponsState
    default:
      return state
  }
}
