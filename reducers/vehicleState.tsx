import type { Vehicle } from "../types/types"
import { defaultVehicle } from "../types/types"

export enum VehicleActions {
  EDITED = "edited",
  UPDATE = "update",
  ACTION_VALUE = "action_value",
  DESCRIPTION = "description",
  SKILLS = "skills",
  SUBMIT = "submit",
  VEHICLE = "vehicle",
  RESET = "reset"
}

interface ActionNoPayload {
  type: Extract<VehicleActions, VehicleActions.EDITED | VehicleActions.SUBMIT | VehicleActions.RESET>
}

interface UpdateAction {
  type: any | Extract<VehicleActions, VehicleActions.UPDATE | VehicleActions.ACTION_VALUE | VehicleActions.DESCRIPTION | VehicleActions.SKILLS>
  name: string
  value: string | boolean | number
}

interface PayloadAction {
  type: Extract<VehicleActions, VehicleActions.VEHICLE>
  payload: Vehicle
}

export interface VehicleStateType {
  edited: boolean
  saving: boolean
  vehicle: Vehicle
}

export type VehicleStateAction = ActionNoPayload | UpdateAction | PayloadAction | any

export const initialVehicleState:VehicleStateType = {
  edited: false,
  saving: false,
  vehicle: defaultVehicle
}

export function vehicleReducer(state: VehicleStateType, action: VehicleStateAction): VehicleStateType {
  switch(action.type) {
    case VehicleActions.EDITED:
      return {
        ...state,
        edited: true
      }
    case VehicleActions.UPDATE:
      return {
        ...state,
        edited: true,
        vehicle: {
          ...state.vehicle,
          [action.name as string]: action.value
        } as Vehicle
      }
    case VehicleActions.ACTION_VALUE:
      const value = action.value === "null" ? "" : action.value
      return {
        ...state,
        edited: true,
        vehicle: {
          ...state.vehicle,
          action_values: {
            ...state.vehicle.action_values,
            [action.name as string]: value
          }
        } as Vehicle
      }
    case VehicleActions.DESCRIPTION:
      return {
        ...state,
        edited: true,
        vehicle: {
          ...state.vehicle,
          description: {
            ...state.vehicle.description,
            [action.name as string]: action.value
          }
        } as Vehicle
      }
    case VehicleActions.SKILLS:
      return {
        ...state,
        edited: true,
        vehicle: {
          ...state.vehicle,
          skills: {
            ...state.vehicle.skills,
            [action.name as string]: action.value
          }
        } as Vehicle
      }
    case VehicleActions.SUBMIT:
      return {
        ...state,
        edited: false,
        saving: true,
      }
    case VehicleActions.VEHICLE:
      return {
        ...state,
        saving: false,
        edited: false,
        vehicle: action.payload as Vehicle
      }
    case VehicleActions.RESET:
      return {
        ...state,
        saving: false
      }
    default:
      return initialVehicleState
  }
}
