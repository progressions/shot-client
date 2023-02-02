import type { WeaponCategory, Juncture, PaginationMeta, Weapon } from "../../types/types"
import { defaultPaginationMeta, defaultWeapon } from "../../types/types"

export type PayloadType = WeaponCategory | Juncture | Weapon | WeaponsResponse | string

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

export interface ActionNoPayload {
  type: "reset" | "edit" | "saving" | "success" | "previous" | "next"
}

export interface PayloadAction {
  type: "juncture" | "category" | "weapon" | "weapons" | "name"
  payload: PayloadType
}

export interface UpdateAction {
  type: "update"
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
    case "edit":
      return {
        ...state,
        edited: true
      }
    case "previous":
      return {
        ...state,
        edited: true,
        page: state.meta["prev_page"] as number
      }
    case "next":
      return {
        ...state,
        edited: true,
        page: state.meta["next_page"] as number
      }
    case "saving":
      return {
        ...state,
        saving: true,
        edited: false
      }
    case "success":
      return {
        ...state,
        loading: false,
        saving: false,
        edited: false
      }
    case "juncture":
      return {
        ...state,
        edited: true,
        juncture: (action.payload || initialWeaponsState.juncture) as Juncture,
        weapon: initialWeaponsState.weapon
      }
    case "category":
      return {
        ...state,
        edited: true,
        category: (action.payload || initialWeaponsState.category) as WeaponCategory,
        weapon: initialWeaponsState.weapon
      }
    case "name":
      return {
        ...state,
        edited: true,
        name: (action.payload || initialWeaponsState.name) as string,
      }
    case "weapon":
      return {
        ...state,
        edited: true,
        weapon: (action.payload || initialWeaponsState.weapon) as Weapon,
      }
    case "weapons":
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
    case "reset":
      return initialWeaponsState
    default:
      return state
  }
}
