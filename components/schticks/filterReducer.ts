import type { SchtickCategory, SchtickPath, PaginationMeta, Schtick } from "../../types/types"
import { defaultPaginationMeta, defaultSchtick } from "../../types/types"

export interface ActionNoPayload {
  type: "reset" | "edit" | "saving" | "success" | "previous" | "next"
}

export interface PayloadAction {
  type: "category" | "path" | "title" | "schtick" | "schticks"
  payload: any
}

export interface UpdateAction {
  type: "update"
  name: string
  value: string
}

export interface SchticksStateType {
  loading: boolean
  saving: boolean
  page: number
  path: SchtickPath
  paths: SchtickPath[]
  category: SchtickCategory
  categories: SchtickCategory[]
  title: string
  schtick: Schtick
  schticks: Schtick[]
  meta: PaginationMeta
}

export interface SchticksResponse {
  schticks: Schtick[]
  meta: PaginationMeta
  paths: SchtickPath[]
  categories: SchtickCategory[]
}

export type SchticksActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialFilter: SchticksStateType = {
  loading: true,
  saving: false,
  page: 1,
  path: "",
  paths: [],
  category: "",
  categories: [],
  title: "",
  schtick: defaultSchtick,
  schticks: [],
  meta: defaultPaginationMeta
}

export function filterReducer(state: SchticksStateType, action: SchticksActionType) {
  switch(action.type) {
    case "previous":
      const { prev_page } = state.meta
      return {
        ...state,
        page: prev_page as number
      }
    case "next":
      return {
        ...state,
        page: state.meta.next_page as number
      }
    case "saving":
      return {
        ...state,
        saving: true
      }
    case "success":
      return {
        ...state,
        loading: false,
        saving: false
      }
    case "category":
      return {
        ...state,
        category: action.payload || initialFilter.category,
        path: initialFilter.path,
        schtick: initialFilter.schtick
      }
    case "path":
      return {
        ...state,
        path: action.payload || initialFilter.path,
      }
    case "title":
      return {
        ...state,
        title: action.payload || initialFilter.title,
      }
    case "schtick":
      return {
        ...state,
        schtick: action.payload || initialFilter.schtick,
      }
    case "schticks":
      const { schticks, meta, paths, categories } = action.payload as SchticksResponse
      return {
        ...state,
        loading: false,
        schticks: schticks,
        meta: meta,
        paths: paths,
        categories: categories
      }
    default:
      return state
  }
}
