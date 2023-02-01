export interface LoginStateType {
  error: boolean
  loading: boolean
  email: string
  password: string
}

interface ActionNoPayload {
  type: "login" | "error" | "success"
}

interface UpdateAction {
  type: "update"
  name: string
  value: string
}

export type LoginActionType = ActionNoPayload | UpdateAction

export const initialState: LoginStateType = {
  error: false,
  loading: false,
  email: "",
  password: ""
}

export const loginReducer = (state: LoginStateType, action: LoginActionType) => {
  switch (action.type) {
    case "update":
      return {
        ...state,
        [action.name]: action.value
      }
    case "login":
      return {
        ...state,
        loading: true,
        error: false
      }
    case "error":
      return {
        ...state,
        error: true,
        loading: false
      }
    case "success":
      return {
        error: false,
        loading: false,
        email: "",
        password: ""
      }
    default:
      return state
  }
}
