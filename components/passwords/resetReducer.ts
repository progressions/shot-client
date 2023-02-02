export interface ResetPasswordStateType {
  loading: boolean
  error: boolean
  success: boolean
  email: string
}

interface ActionNoPayload {
  type: "submit" | "success" | "reset" | "error"
}

interface UpdateAction {
  type: "update"
  name: string
  value: string
}

export type ResetPasswordActionType = ActionNoPayload | UpdateAction

export const initialState: ResetPasswordStateType = {
  loading: false,
  error: false,
  success: false,
  email: ""
}

export function resetReducer(state: ResetPasswordStateType, action: ResetPasswordActionType) {
  switch (action.type) {
    case "submit":
      return {
        ...state,
        loading: true,
        error: false
      }
    case "update":
      return {
        ...state,
        [action.name]: action.value
      }
    case "success":
      return {
        ...initialState,
        success: true
      }
    case "error":
      return {
        ...initialState,
        error: true
      }
    case "reset":
      return initialState
    default:
      return state
  }
}
