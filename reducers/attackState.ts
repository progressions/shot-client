import type { Fight, Character, Weapon } from "../types/types"
import { defaultFight, defaultWeapon, defaultCharacter } from "../types/types"
import type { Swerve } from "../components/dice/DiceRoller"
import AS from "../services/ActionService"
import CS from "../services/CharacterService"
import CES from "../services/CharacterEffectService"

export enum AttackActions {
  UPDATE = "update",
  RESET = "reset",
  EDIT = "edit"
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
  damage: number
  toughness: number
  outcome: number | null
  success: boolean
  smackdown: number | null
  wounds: number | null
  modifiedDefense: string
  modifiedActionValue: string
  modifiedToughness: string
}

export const defaultSwerve:Swerve = {
  result: 0,
  positiveRolls: [],
  negativeRolls: [],
  positive: 0,
  negative: 0,
  boxcars: false,
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

  // calculated values
  actionResult: 0,
  outcome: 0,
  success: false,
  smackdown: 0,
  wounds: 0,
  modifiedDefense: "",
  modifiedActionValue: "",
  modifiedToughness: ""
}

function process(state: AttackState): AttackState {
  const st = {
    ...state,
    swerve: {
      ...state.swerve,
      result: parseToNumber(state.swerve.result),
    },
    actionValue: parseToNumber(state.actionValue),
    toughness: parseToNumber(state.toughness),
    defense: parseToNumber(state.defense),
    damage: parseToNumber(state.damage),
  }

  if (st.typedSwerve !== "") {
    st.swerve = { ...st.swerve, result: parseToNumber(st.typedSwerve) }
  }
  const [_defenseAdjustment, adjustedDefense] = CES.adjustedActionValue(st.target, "Defense", st.fight, false)

  if (st.stunt) {
    st.modifiedDefense = `${st.defense + 2}*`
  } else if (CS.impairments(st.target) > 0 || adjustedDefense != CS.defense(st.target)) {
    st.modifiedDefense = `${st.defense}*`
  } else {
    st.modifiedDefense = `${st.defense}`
  }

  const [_adjustment, adjustedMainAttack] = CES.adjustedMainAttack(st.attacker, st.fight)
  if (st.actionValueName && (adjustedMainAttack != CS.mainAttackValue(st.attacker) || CS.impairments(st.attacker) > 0)) {
    st.modifiedActionValue = `${st.actionValue}*`
  } else {
    st.modifiedActionValue = `${st.actionValue}`
  }

  const [toughnessAdjustment, adjustedToughness] = CES.adjustedActionValue(st.target, "Toughness", st.fight, true)
  if (CS.toughness(st.target) != adjustedToughness && toughnessAdjustment != 0) {
    st.modifiedToughness = `${adjustedToughness}*`
  } else {
    st.modifiedToughness = `${st.toughness}`
  }

  const { actionResult, outcome, smackdown, wounds } = AS.wounds({
    swerve: st.swerve,
    actionValue: st.actionValue,
    defense: st.defense,
    stunt: st.stunt,
    toughness: st.toughness,
    damage: st.damage,
  })

  return {
    ...st,
    // calculated values
    actionResult: actionResult,
    outcome: outcome || null,
    success: (outcome || 0) >= 0,
    smackdown: smackdown || null,
    wounds: wounds || null,
  }
}

function parseToNumber(value: string | number): number {
  if (typeof value === "number") {
    // If the value is already a number, simply return it
    return value;
  } else if (typeof value === "string") {
    // If the value is a string, parse it using parseInt
    const parsedValue = parseInt(value, 10);
    // Check if the parsing was successful (not NaN)
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  // If the value is neither a number nor a valid parsable string, return a default value (e.g., 0)
  return 0;
}

export function attackReducer(state: AttackState, action: { type: AttackActions, payload?: Partial<AttackState> }): AttackState {
  switch (action.type) {
    case AttackActions.EDIT:
      return process({
        ...state,
        ...action.payload,
        edited: true,
      })
    case AttackActions.UPDATE:
      return process({
        ...state,
        ...action.payload,
      })
    case AttackActions.RESET:
      return process(initialAttackState)
    default:
      return process(state)
  }
}
