export enum FormActions {
  EDIT = "edit",
  OPEN = "open",
  SUBMIT = "submit",
  DISABLE = "disable",
  UPDATE = "update",
  RESET = "reset",
}

interface ActionNoPayload {
  type: Extract<FormActions, FormActions.EDIT | FormActions.SUBMIT>
}

interface UpdateAction {
  type: Extract<FormActions, FormActions.UPDATE>
  name: string
  value: string | boolean | number
}

interface PayloadAction {
  type: Extract<FormActions, FormActions.OPEN | FormActions.RESET | FormActions.DISABLE>
  payload: any
}

export interface FormStateType {
  edited: boolean
  saving: boolean
  disabled: boolean
  open: boolean
  formData: Record<string, any>
}

export type FormStateAction = ActionNoPayload | UpdateAction | PayloadAction

export function initializeFormState(formData: any = null): FormStateType {
  return {
    edited: false,
    saving: false,
    disabled: true,
    open: false,
    formData: formData || {},
  }
}

export function formReducer(state: FormStateType, action: FormStateAction): FormStateType {
  switch (action.type) {
    case FormActions.EDIT:
      return {
        ...state,
        edited: true,
      }
    case FormActions.UPDATE:
      return {
        ...state,
        edited: true,
        formData: {
          ...state.formData,
          [action.name]: action.value,
        },
      }
    case FormActions.OPEN:
      return {
        ...state,
        open: true,
      }
    case FormActions.DISABLE:
      return {
        ...state,
        disabled: !!action.payload
      }
    case FormActions.SUBMIT:
      return {
        ...state,
        edited: false,
        saving: true,
      }
    case FormActions.RESET:
      return action.payload
    default:
      return state
  }
}
