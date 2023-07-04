import { useEffect, useReducer, createContext, useContext } from "react"

import { defaultVehicle } from "../types/types"
import type { Vehicle, User } from "../types/types"
import { useClient } from "./ClientContext"
import { useToast } from "./ToastContext"

import { VehicleActions, VehicleStateAction, VehicleStateType, initialVehicleState, vehicleReducer } from "../reducers/vehicleState"

interface VehicleContextType {
  state: VehicleStateType
  dispatch: React.Dispatch<VehicleStateAction>
  vehicle: Vehicle
  updateVehicle: () => Promise<void>
  reloadVehicle: () => Promise<void>
}

const defaultVehicleContext: VehicleContextType = {
  state: initialVehicleState,
  dispatch: () => {},
  updateVehicle: () => { return new Promise(() => {})},
  reloadVehicle: () => { return new Promise(() => {})},
  vehicle: defaultVehicle
}

const VehicleContext = createContext<VehicleContextType>(defaultVehicleContext)

interface VehicleProviderProps {
  vehicle: Vehicle
  children: React.ReactNode
}

export function VehicleProvider({ vehicle, children }: VehicleProviderProps) {
  const { client } = useClient()
  const [state, dispatch] = useReducer(vehicleReducer, {...initialVehicleState, vehicle: vehicle})
  const { edited, saving } = state
  const { toastError, toastSuccess } = useToast()

  useEffect(() => {
    if (edited) {
      const saveVehicle = async (): Promise<void> => {
        dispatch({ type: VehicleActions.SUBMIT })

        try {
          const data = await client.updateVehicle(state.vehicle)
          dispatch({ type: VehicleActions.VEHICLE, payload: data })
          toastSuccess("Vehicle updated.")
        } catch(error) {
          dispatch({ type: VehicleActions.RESET })
          toastError()
        }
      }

      const timer = setTimeout(() => {
        saveVehicle().catch(console.error)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [edited, state.vehicle, dispatch, toastSuccess, toastError, client])

  async function updateVehicle():Promise<void> {
    dispatch({ type: VehicleActions.SUBMIT })

    try {
      const data = await client.updateVehicle(state.vehicle)
      dispatch({ type: VehicleActions.VEHICLE, payload: data })
      toastSuccess("Vehicle updated.")
    } catch(error) {
      dispatch({ type: VehicleActions.RESET })
      toastError()
    }
  }

  async function reloadVehicle():Promise<void> {
    dispatch({ type: VehicleActions.SUBMIT })

    try {
      const data = await client.getVehicle(state.vehicle)
      dispatch({ type: VehicleActions.VEHICLE, payload: data })
      toastSuccess("Vehicle updated.")
    } catch(error) {
      dispatch({ type: VehicleActions.RESET })
      toastError()
    }
  }

  return (
    <VehicleContext.Provider value={{state, vehicle, dispatch, updateVehicle, reloadVehicle}}>
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicle(): VehicleContextType {
  return useContext(VehicleContext)
}
