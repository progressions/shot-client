import type { SchticksResponse, SchtickCategory, SchtickPath, PaginationMeta, Schtick } from "@/types/types"
import { defaultPaginationMeta, defaultSchtick } from "@/types/types"

export enum SchticksActions {
  RESET = "reset",
  EDIT = "edit",
  SAVING = "saving",
  SUCCESS = "success",
  PREVIOUS = "previous",
  NEXT = "next",
  PAGE = "page",
  CATEGORY = "cateory",
  PATH = "path",
  NAME = "name",
  SCHTICK = "schtick",
  SCHTICKS = "schticks",
  UPDATE = "update"
}

export interface ActionNoPayload {
  type: Extract<SchticksActions, SchticksActions.RESET | SchticksActions.EDIT | SchticksActions.SAVING | SchticksActions.SUCCESS | SchticksActions.PREVIOUS | SchticksActions.NEXT>
}

export type PayloadType = SchtickCategory | SchtickPath | Schtick | SchticksResponse | string

export interface PayloadAction {
  type: Extract<SchticksActions, SchticksActions.CATEGORY | SchticksActions.PATH | SchticksActions.NAME | SchticksActions.SCHTICK | SchticksActions.SCHTICKS | SchticksActions.PAGE>
  payload: PayloadType
}

export interface UpdateAction {
  type: Extract<SchticksActions, SchticksActions.UPDATE>
  name: string
  value: string | boolean | number
}

export interface SchticksStateType {
  edited: boolean
  loading: boolean
  saving: boolean
  page: number
  path: SchtickPath
  paths: SchtickPath[]
  category: SchtickCategory
  categories: SchtickCategory[]
  name: string
  schtick: Schtick
  schticks: Schtick[]
  meta: PaginationMeta
}

export type SchticksActionType = ActionNoPayload | UpdateAction | PayloadAction

export const initialSchticksState: SchticksStateType = {
  edited: true,
  loading: true,
  saving: false,
  page: 1,
  path: "",
  paths: [],
  category: "",
  categories: [],
  name: "",
  schtick: defaultSchtick,
  schticks: [],
  meta: defaultPaginationMeta
}

export function schticksReducer(state: SchticksStateType, action: SchticksActionType) {
  switch(action.type) {
    case SchticksActions.EDIT:
      return {
        ...state,
        edited: true,
        loading: true
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
        saving: false,
        edited: false
      }
    case SchticksActions.CATEGORY:
      return {
        ...state,
        edited: true,
        loading: true,
        page: 1,
        category: (action.payload || initialSchticksState.category) as SchtickCategory,
        name: initialSchticksState.name,
        path: initialSchticksState.path,
        schtick: initialSchticksState.schtick
      }
    case SchticksActions.PATH:
      return {
        ...state,
        page: 1,
        edited: true,
        loading: true,
        name: initialSchticksState.name,
        path: (action.payload || initialSchticksState.path) as SchtickPath,
      }
    case SchticksActions.NAME:
      return {
        ...state,
        page: 1,
        edited: true,
        loading: true,
        name: (action.payload || initialSchticksState.name) as string,
      }
    case SchticksActions.PAGE:
      return {
        ...state,
        edited: true,
        loading: true,
        page: action.payload as number
      }
    case SchticksActions.UPDATE:
      return {
        ...state,
        edited: true,
        loading: true,
        page: initialSchticksState.page,
        [action.name]: action.value,
      }
    case SchticksActions.SCHTICK:
      return {
        ...state,
        // edited: false,
        loading: false,
        schtick: (action.payload || initialSchticksState.schtick) as Schtick,
      }
    case SchticksActions.SCHTICKS:
      const { schticks, meta, paths, categories } = action.payload as SchticksResponse
      return {
        ...state,
        loading: false,
        edited: false,
        saving: false,
        schticks: schticks,
        meta: meta,
        paths: paths,
        categories: categories
      }
    case SchticksActions.RESET:
      return {
        ...state,
        page: 1,
        loading: false,
        edited: false,
        saving: false,
        schtick: initialSchticksState.schtick
      }
    default:
      return state
  }
}
