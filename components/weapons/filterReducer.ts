import type { PaginationMeta, Weapon } from "../../types/types"
import { defaultPaginationMeta, defaultWeapon } from "../../types/types"

export interface WeaponsStateType {
  edited: boolean
  loading: boolean
  saving: boolean
  page: number
  juncture: string
  junctures: string[]
  category: string
  categories: string[]
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
  payload: any
}

export interface UpdateAction {
  type: "update"
  name: string
  value: string
}

export interface WeaponsResponse {
  weapons: Weapon[]
  meta: PaginationMeta
  junctures: string[]
  categories: string[]
}

export type WeaponsActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialFilter:WeaponsStateType = {
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

export function filterReducer (state: WeaponsStateType, action: WeaponsActionType) {
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
        juncture: action.payload || initialFilter.juncture,
        weapon: initialFilter.weapon
      }
    case "category":
      return {
        ...state,
        edited: true,
        category: action.payload || initialFilter.category,
        weapon: initialFilter.weapon
      }
    case "name":
      return {
        ...state,
        edited: true,
        name: action.payload || initialFilter.name,
      }
    case "weapon":
      return {
        ...state,
        edited: true,
        weapon: action.payload || initialFilter.weapon,
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
      return initialFilter
    default:
      return state
  }
}
