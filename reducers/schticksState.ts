import type { SchtickCategory, SchtickPath, PaginationMeta, Schtick } from "../types/types"
import { defaultPaginationMeta, defaultSchtick } from "../types/types"

export enum SchticksActions {
  RESET = "reset",
  EDIT = "edit",
  SAVING = "saving",
  SUCCESS = "success",
  PREVIOUS = "previous",
  NEXT = "next",
  CATEGORY = "cateory",
  PATH = "path",
  TITLE = "title",
  SCHTICK = "schtick",
  SCHTICKS = "schticks",
  UPDATE = "update"
}

export interface ActionNoPayload {
  type: Extract<SchticksActions, SchticksActions.RESET | SchticksActions.EDIT | SchticksActions.SAVING | SchticksActions.SUCCESS | SchticksActions.PREVIOUS | SchticksActions.NEXT>
}

export type PayloadType = SchtickCategory | SchtickPath | Schtick | SchticksResponse | string

export interface PayloadAction {
  type: Extract<SchticksActions, SchticksActions.CATEGORY | SchticksActions.PATH | SchticksActions.TITLE | SchticksActions.SCHTICK | SchticksActions.SCHTICKS>
  payload: PayloadType
}

export interface UpdateAction {
  type: Extract<SchticksActions, SchticksActions.UPDATE>
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

export const initialSchticksState: SchticksStateType = {
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

export function schticksReducer(state: SchticksStateType, action: SchticksActionType) {
  switch(action.type) {
    case SchticksActions.PREVIOUS:
      const { prev_page } = state.meta
      return {
        ...state,
        page: prev_page as number
      }
    case SchticksActions.NEXT:
      return {
        ...state,
        page: state.meta.next_page as number
      }
    case SchticksActions.SAVING:
      return {
        ...state,
        saving: true
      }
    case SchticksActions.SUCCESS:
      return {
        ...state,
        loading: false,
        saving: false
      }
    case SchticksActions.CATEGORY:
      return {
        ...state,
        category: (action.payload || initialSchticksState.category) as SchtickCategory,
        path: initialSchticksState.path,
        schtick: initialSchticksState.schtick
      }
    case SchticksActions.PATH:
      return {
        ...state,
        path: (action.payload || initialSchticksState.path) as SchtickPath,
      }
    case SchticksActions.TITLE:
      return {
        ...state,
        title: (action.payload || initialSchticksState.title) as string,
      }
    case SchticksActions.SCHTICK:
      return {
        ...state,
        schtick: (action.payload || initialSchticksState.schtick) as Schtick,
      }
    case SchticksActions.SCHTICKS:
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
