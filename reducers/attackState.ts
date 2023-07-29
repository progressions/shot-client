import type { Swerve, Fight, Character, Weapon } from "../types/types"
import { defaultSwerve, defaultFight, defaultWeapon, defaultCharacter } from "../types/types"
import AS from "../services/ActionService"
import CS from "../services/CharacterService"
import CES from "../services/CharacterEffectService"
import ARS from "../services/AttackReducerService"

export enum AttackActions {
  ATTACKER = "attacker",
  TARGET = "target",
  WEAPON = "weapon",
  UPDATE = "update",
  RESET = "reset",
  EDIT = "edit"
}

export interface MookResult {
  actionResult: number
  success: boolean
  smackdown: number
  wounds: number
}

export interface AttackState {
  // edited means don't show the results yet!
  edited: boolean
  fight: Fight
  attacker: Character
  target: Character
  typedSwerve: string
  swerve: Swerve
  stunt: boolean
  actionValueName: string | null
  actionValue: number
  actionResult: number
  defense: number
  weapon: Weapon
  count: number
  damage: number
  toughness: number
  outcome: number | null
  success: boolean
  smackdown: number | null
  wounds: number | null
  mookDefense: number
  modifiedDefense: string
  modifiedActionValue: string
  modifiedToughness: string
  boxcars: boolean
  wayAwfulFailure: boolean
  mookResults: MookResult[]
}

export const initialAttackState: AttackState = {
  edited: false,
  // values you add
  fight: defaultFight,
  attacker: defaultCharacter,
  target: defaultCharacter,
  typedSwerve: "",
  swerve: defaultSwerve,
  stunt: false,
  actionValueName: null,
  actionValue: 7,
  defense: 0,
  weapon: defaultWeapon,
  damage: defaultWeapon.damage,
  toughness: 0,
  count: 1,

  // calculated values
  actionResult: 0,
  outcome: 0,
  success: false,
  smackdown: 0,
  wounds: 0,
  mookDefense: 0,
  modifiedDefense: "",
  modifiedActionValue: "",
  modifiedToughness: "",
  boxcars: false,
  wayAwfulFailure: false,
  mookResults: []
}


export function attackReducer(state: AttackState, action: { type: AttackActions, payload?: Partial<AttackState> }): AttackState {
  switch (action.type) {
    case AttackActions.ATTACKER:
      const { attacker } = action.payload as AttackState
      return ARS.setAttacker(state, attacker)
    case AttackActions.TARGET:
      const { target } = action.payload as AttackState
      return ARS.setTarget(state, target)
    case AttackActions.EDIT:
      return ARS.process({
        ...state,
        ...action.payload,
        edited: true,
      })
    case AttackActions.WEAPON:
      const { weapon } = action.payload as AttackState
      return ARS.setWeapon(state, weapon)
    case AttackActions.UPDATE:
      return ARS.process({
        ...state,
        ...action.payload,
      })
    case AttackActions.RESET:
      return ARS.process(initialAttackState)
    default:
      return ARS.process(state)
  }
}
