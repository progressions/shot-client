import type { Position, Fight, Vehicle, Weapon } from "@/types/types"
import { Swerve, defaultSwerve, defaultFight, defaultWeapon, defaultVehicle } from "@/types/types"
import AS from "@/services/ActionService"
import VS from "@/services/VehicleService"
import CES from "@/services/CharacterEffectService"
import CRS from "@/services/ChaseReducerService"

export enum ChaseActions {
  UPDATE = "update",
  ATTACKER = "attacker",
  TARGET = "target",
  RESET = "reset",
  EDIT = "edit"
}

// a pursuer who is near the target must use the "Ram/Sideswipe" method
// a pursuer who is far from the target must use the "Narrow the Gap" method
// an evader who is near the target can choose the "Widen the Gap" or "Ram/Sideswipe" method
// an evader who is far from the target must use the "Evade" method
export enum ChaseMethod {
  RAM_SIDESWIPE = "Ram/Sideswipe",
  NARROW_THE_GAP = "Narrow the Gap",
  WIDEN_THE_GAP = "Widen the Gap",
  EVADE = "Evade",
}

export interface ChaseMookResult {
  actionResult: number
  success: boolean
  smackdown: number
  chasePoints: number
  conditionPoints: number
}

export interface ChaseState {
  // edited means don't show the results yet!
  edited: boolean
  fight: Fight
  attacker: Vehicle
  target: Vehicle
  method: ChaseMethod | ""
  typedSwerve: string
  swerve: Swerve
  stunt: boolean
  actionValue: number
  actionResult: number
  defense: number
  count: number
  handling: number
  squeal: number
  frame: number
  crunch: number
  outcome: number | null | undefined
  success: boolean
  smackdown: number | null | undefined
  chasePoints: number | null | undefined
  conditionPoints: number | null | undefined
  position: Position
  mookDefense: number
  modifiedDefense: string
  modifiedActionValue: string
  boxcars: boolean
  wayAwfulFailure: boolean
  mookResults: ChaseMookResult[]
  mookRolls: number[]
  shots: number
}

export const initialChaseState: ChaseState = {
  edited: false,
  // values you add
  fight: defaultFight,
  attacker: defaultVehicle,
  target: defaultVehicle,
  method: "",
  typedSwerve: "",
  swerve: defaultSwerve,
  stunt: false,
  actionValue: 7,
  defense: 0,
  handling: 0,
  squeal: 0,
  frame: 0,
  crunch: 0,
  count: 1,
  position: "far",
  shots: 3,

  // calculated values
  actionResult: 0,
  outcome: 0,
  success: false,
  smackdown: 0,
  chasePoints: 0,
  conditionPoints: 0,
  mookDefense: 0,
  modifiedDefense: "",
  modifiedActionValue: "",
  boxcars: false,
  wayAwfulFailure: false,
  mookResults: [],
  mookRolls: []
}

export function chaseReducer(state: ChaseState, action: { type: ChaseActions, payload?: Partial<ChaseState> }): ChaseState {
  switch (action.type) {
    case ChaseActions.EDIT:
      return CRS.process({
        ...state,
        ...action.payload,
        edited: true,
      })
    case ChaseActions.TARGET:
      const { target } = action.payload as ChaseState
      return CRS.setTarget(state, target)
    case ChaseActions.ATTACKER:
      const { attacker } = action.payload as ChaseState
      return CRS.setAttacker(state, attacker)
    case ChaseActions.UPDATE:
      return CRS.process({
        ...state,
        ...action.payload,
      })
    case ChaseActions.RESET:
      return CRS.process(initialChaseState)
    default:
      return CRS.process(state)
  }
}
