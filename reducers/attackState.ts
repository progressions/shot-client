import type { Fight, Character, Weapon } from "../types/types"
import { defaultFight, defaultWeapon, defaultCharacter } from "../types/types"
import type { Swerve } from "../components/dice/DiceRoller"
import AS from "../services/ActionService"
import CS from "../services/CharacterService"
import CES from "../services/CharacterEffectService"

export enum AttackActions {
  ATTACKER = "attacker",
  TARGET = "target",
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
  mookResults: AttackState[]
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

function convertToNumber(state: AttackState): AttackState {
  return {
    ...state,
    swerve: {
      ...state.swerve,
      result: parseToNumber(state.swerve.result),
    },
    actionValue: parseToNumber(state.actionValue),
    toughness: parseToNumber(state.toughness),
    defense: parseToNumber(state.defense),
    damage: parseToNumber(state.damage),
    count: parseToNumber(state.count),
  }
}

function calculateDefense(st: AttackState): string {
  const [_defenseAdjustment, adjustedDefense] = CES.adjustedActionValue(st.target, "Defense", st.fight, false)
  if (st.stunt) {
    return `${st.defense + 2}*`
  } else if (CS.impairments(st.target) > 0 || adjustedDefense != CS.defense(st.target)) {
    return `${st.defense}*`
  }
  return `${st.defense}`
}

function calculateMainAttack(st: AttackState): string {
  const [_adjustment, adjustedMainAttack] = CES.adjustedMainAttack(st.attacker, st.fight)
  if (st.actionValueName && (adjustedMainAttack != CS.mainAttackValue(st.attacker) || CS.impairments(st.attacker) > 0)) {
    return `${st.actionValue}*`
  }
  return `${st.actionValue}`
}

function calculateToughness(st: AttackState): string {
  const [toughnessAdjustment, adjustedToughness] = CES.adjustedActionValue(st.target, "Toughness", st.fight, true)
  if (CS.toughness(st.target) != adjustedToughness && toughnessAdjustment != 0) {
    return `${adjustedToughness}*`
  }
  return `${st.toughness}`
}

function targetMookDefense(st: AttackState): number {
  if (CS.isMook(st.target) && st.count > 1) {
    return st.defense + st.count + (st.stunt ? 2 : 0)
  }
  return st.defense
}

function makeAttack(st: AttackState): AttackState {
  if (CS.isMook(st.attacker) && st.count > 1) {
    return calculateMookAttackValues(st)
  }
  return calculateAttackValues(st)
}

function calculateMookAttackValues(st: AttackState): AttackState {
  const results = []
  for (let i = 0; i < st.count; i++) {
    const swerve = AS.swerve()
    const result = calculateAttackValues({
      ...st,
      swerve: swerve,
      typedSwerve: "",
    })
    results.push(result)
  }

  return {
    ...st,
    mookResults: results,
  }
}

function calculateAttackValues(st: AttackState): AttackState {
  if (st.typedSwerve !== "") {
    st.swerve = { ...st.swerve, result: parseToNumber(st.typedSwerve) }
  }

  st.modifiedDefense = calculateDefense(st)
  st.modifiedActionValue = calculateMainAttack(st)
  st.modifiedToughness = calculateToughness(st)
  st.mookDefense = targetMookDefense(st)

  const { actionResult, outcome, smackdown, wounds, wayAwfulFailure } = AS.wounds({
    swerve: st.swerve,
    actionValue: st.actionValue,
    defense: st.mookDefense,
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
    boxcars: st.swerve.boxcars,
    wayAwfulFailure: wayAwfulFailure,
  }
}

function process(state: AttackState): AttackState {
  let st = convertToNumber(state)

  if (st.edited) {
    st = makeAttack(st)
    return resolveAttack(st)
  }

  return st
}

function resolveAttack(st: AttackState): AttackState {
  const { target, smackdown } = st
  const updatedTarget = CS.takeSmackdown(target, smackdown as number)

  return {
    ...st,
    target: updatedTarget,
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
    case AttackActions.ATTACKER:
      const { attacker } = action.payload as AttackState
      const [_adjustment, adjustedMainAttack] = CES.adjustedMainAttack(attacker, state.fight)
      const mookCount = CS.isMook(attacker) ? CS.mooks(attacker) : 1

      return process({
        ...state,
        attacker: attacker,
        actionValueName: CS.mainAttack(attacker) || "",
        actionValue: adjustedMainAttack,
        weapon: defaultWeapon,
        damage: CS.damage(attacker) || 7,
        count: mookCount,
      })
    case AttackActions.TARGET:
      const { target } = action.payload as AttackState
      const { fight } = state
      const [_defenseAdjustment, adjustedDefense] = CES.adjustedActionValue(target, "Defense", state.fight, false)
      const [_toughnessAdjustment, adjustedToughness] = CES.adjustedActionValue(target, "Toughness", state.fight, true)

      return process({
        ...state,
        target: target,
        defense: adjustedDefense,
        toughness: CS.isMook(target) ? 0 : adjustedToughness,
      })
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
