import type { Position, Fight, Vehicle, Weapon } from "../types/types"
import { defaultFight, defaultWeapon, defaultVehicle } from "../types/types"
import type { Swerve } from "../components/dice/DiceRoller"
import AS from "../services/ActionService"
import VS from "../services/VehicleService"
import CES from "../services/CharacterEffectService"

export enum ChaseActions {
  UPDATE = "update",
  ATTACKER = "attacker",
  TARGET = "target",
  RESET = "reset",
  EDIT = "edit"
}

// a pursuer who is near the target can use the "Ram/Sideswipe" method
// a pursuer who is far from the target can use the "Narrow the Gap" method
// an evader who is near the target can choose the "Widen the Gap" or "Ram/Sideswipe" method
// an evader who is far from the target can use the "Evade" method
export enum ChaseMethod {
  RAM_SIDESWIPE = "Ram/Sideswipe",
  NARROW_THE_GAP = "Narrow the Gap",
  WIDEN_THE_GAP = "Widen the Gap",
  EVADE = "Evade",
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
  outcome: number | null
  success: boolean
  smackdown: number | null
  chasePoints: number | null
  conditionPoints: number | null
  position: Position
  mookDefense: number
  modifiedDefense: string
  modifiedActionValue: string
  boxcars: boolean
  wayAwfulFailure: boolean
  mookResults: ChaseState[]
}

export const defaultSwerve:Swerve = {
  result: 0,
  positiveRolls: [],
  negativeRolls: [],
  positive: 0,
  negative: 0,
  boxcars: false,
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
  mookResults: []
}

function convertToNumber(state: ChaseState): ChaseState {
  return {
    ...state,
    swerve: {
      ...state.swerve,
      result: parseToNumber(state.swerve.result),
    },
    actionValue: parseToNumber(state.actionValue),
    handling: parseToNumber(state.handling),
    squeal: parseToNumber(state.squeal),
    frame: parseToNumber(state.frame),
    crunch: parseToNumber(state.crunch),
    count: parseToNumber(state.count),
    defense: parseToNumber(state.defense),
  }
}

function calculateDefense(st: ChaseState): string {
  const [_defenseAdjustment, adjustedDefense] = CES.adjustedActionValue(st.target, "Defense", st.fight, false)
  if (st.stunt) {
    return `${st.defense + 2}*`
  } else if (VS.impairments(st.target) > 0 || adjustedDefense != VS.defense(st.target)) {
    return `${st.defense}*`
  }
  return `${st.defense}`
}

function calculateMainAttack(st: ChaseState): string {
  return `${st.actionValue}`
}

function targetMookDefense(st: ChaseState): number {
  if (VS.isMook(st.target) && st.count > 1) {
    return st.defense + st.count + (st.stunt ? 2 : 0)
  }
  return st.defense
}

function makeAttack(st: ChaseState): ChaseState {
  if (VS.isMook(st.attacker) && st.count > 1) {
    return calculateMookAttackValues(st)
  }
  return calculateAttackValues(st)
}

function calculateMookAttackValues(st: ChaseState): ChaseState {
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

function closeGapPosition(st: ChaseState, success: boolean): string {
  if (success && !VS.isNear(st.attacker)) {
    return "near"
  }
  return st.position
}

function widenGapPosition(st: ChaseState, success: boolean): string {
  if (success && VS.isNear(st.attacker)) {
    return "far"
  }
  return st.position
}

function pursue(st: ChaseState): ChaseState {
  const { success, actionResult, outcome, smackdown, wounds, wayAwfulFailure } = AS.wounds({
    swerve: st.swerve,
    actionValue: st.actionValue,
    defense: st.mookDefense,
    stunt: st.stunt,
    toughness: calculateToughness(st),
    damage: calculateDamage(st),
  })

  const position = closeGapPosition(st, success as boolean)

  return {
    ...st,
    // calculated values
    actionResult: actionResult,
    outcome: outcome || null,
    success: success as boolean,
    smackdown: smackdown || null,
    position: position as Position,
    chasePoints: wounds || null,
    conditionPoints: VS.isNear(st.attacker) ? wounds as number : null,
    boxcars: st.swerve.boxcars,
    wayAwfulFailure: wayAwfulFailure,
  }
}

function calculateToughness(st: ChaseState): number {
  switch (st.method) {
    case ChaseMethod.RAM_SIDESWIPE:
      return st.frame
    default:
      return st.handling
  }
}

function calculateDamage(st: ChaseState): number {
  switch (st.method) {
    case ChaseMethod.RAM_SIDESWIPE:
      return st.crunch
    default:
      return st.squeal
  }
}

function evade(st: ChaseState): ChaseState {
  const { success, actionResult, outcome, smackdown, wounds, wayAwfulFailure } = AS.wounds({
    swerve: st.swerve,
    actionValue: st.actionValue,
    defense: st.mookDefense,
    stunt: st.stunt,
    toughness: calculateToughness(st),
    damage: calculateDamage(st),
  })

  const position = widenGapPosition(st, success as boolean)

  return {
    ...st,
    // calculated values
    actionResult: actionResult,
    outcome: outcome || null,
    success: success as boolean,
    smackdown: smackdown || null,
    position: position as Position,
    chasePoints: wounds || null,
    conditionPoints: null,
    boxcars: st.swerve.boxcars,
    wayAwfulFailure: wayAwfulFailure,
  }
}

function calculateAttackValues(st: ChaseState): ChaseState {
  if (st.typedSwerve !== "") {
    st.swerve = { ...st.swerve, result: parseToNumber(st.typedSwerve) }
  }

  st.modifiedDefense = calculateDefense(st)
  st.modifiedActionValue = calculateMainAttack(st)
  st.mookDefense = targetMookDefense(st)

  if (VS.isPursuer(st.attacker)) {
    return pursue(st)
  }

  return evade(st)
}

function process(state: ChaseState): ChaseState {
  let st = convertToNumber(state)

  if (st.edited) {
    st = makeAttack(st)
    if (VS.isMook(st.attacker)) return resolveMookAttack(st)
    return resolveAttack(st)
  }

  return st
}

// resolve attacks by mooks
function resolveMookAttack(st: ChaseState): ChaseState {
  const updatedState = st.mookResults.reduce((acc, result) => {
    result.target = acc.target
    result.attacker = acc.attacker

    const upState = resolveAttack(result)

    return {
      ...acc,
      chasePoints: acc.chasePoints + upState.chasePoints,
      conditionPoints: acc.conditionPoints + upState.conditionPoints,
      attacker: upState.attacker,
      target: upState.target,
    }
  }, st)

  return {
    ...st,
    attacker: updatedState.attacker,
    target: updatedState.target,
    chasePoints: updatedState.chasePoints,
    conditionPoints: updatedState.conditionPoints,
  }
}

function killMooks(st: ChaseState): ChaseState {
  if (!st.success) return st

  let updatedAttacker = st.attacker
  let updatedTarget = st.target

  const { method, attacker, count, target } = st

  switch (method) {
    case ChaseMethod.RAM_SIDESWIPE:
      [updatedAttacker, updatedTarget] = VS.ramSideswipe(attacker, count, target)
      break
    case ChaseMethod.WIDEN_THE_GAP:
      [updatedAttacker, updatedTarget] = VS.widenTheGap(attacker, count, target)
      break
    case ChaseMethod.NARROW_THE_GAP:
      [updatedAttacker, updatedTarget] = VS.narrowTheGap(attacker, count, target)
      break
    case ChaseMethod.EVADE:
      [updatedAttacker, updatedTarget] = VS.evade(attacker, count, target)
      break
  }

  return {
    ...st,
    attacker: updatedAttacker,
    target: updatedTarget
  }
}

function resolveAttack(st: ChaseState): ChaseState {
  if (VS.isMook(st.target) && st.count > 1) return killMooks(st)

  let updatedAttacker = st.attacker
  let updatedTarget = st.target

  const { method, attacker, smackdown, target } = st
  const beforeChasePoints = VS.chasePoints(target)
  const beforeConditionPoints = VS.conditionPoints(target)

  switch (method) {
    case ChaseMethod.RAM_SIDESWIPE:
      [updatedAttacker, updatedTarget] = VS.ramSideswipe(attacker, smackdown as number, target)
      break
    case ChaseMethod.WIDEN_THE_GAP:
      [updatedAttacker, updatedTarget] = VS.widenTheGap(attacker, smackdown as number, target)
      break
    case ChaseMethod.NARROW_THE_GAP:
      [updatedAttacker, updatedTarget] = VS.narrowTheGap(attacker, smackdown as number, target)
      break
    case ChaseMethod.EVADE:
      [updatedAttacker, updatedTarget] = VS.evade(attacker, smackdown as number, target)
      break
  }

  const afterChasePoints = VS.chasePoints(updatedTarget)
  const afterConditionPoints = VS.conditionPoints(updatedTarget)
  const chasePointsDifference = afterChasePoints - beforeChasePoints
  const conditionPointsDifference = afterConditionPoints - beforeConditionPoints

  return {
    ...st,
    chasePoints: chasePointsDifference,
    conditionPoints: conditionPointsDifference,
    attacker: updatedAttacker,
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

function defaultMethod(attacker: Vehicle): string {
  if (VS.isPursuer(attacker) && VS.isNear(attacker)) return ChaseMethod.RAM_SIDESWIPE
  if (VS.isPursuer(attacker) && VS.isFar(attacker)) return ChaseMethod.NARROW_THE_GAP
  if (VS.isEvader(attacker) && VS.isNear(attacker)) return ChaseMethod.WIDEN_THE_GAP
  return ChaseMethod.EVADE
}

export function chaseReducer(state: ChaseState, action: { type: ChaseActions, payload?: Partial<ChaseState> }): ChaseState {
  switch (action.type) {
    case ChaseActions.EDIT:
      return process({
        ...state,
        ...action.payload,
        edited: true,
      })
    case ChaseActions.TARGET:
      const { target } = action.payload as ChaseState
      return process({
        ...state,
        target: target,
        defense: VS.defense(target),
        handling: VS.isMook(target) ? 0 : VS.handling(target),
        frame: VS.isMook(target) ? 0 : VS.frame(target),
      })
    case ChaseActions.ATTACKER:
      const { attacker } = action.payload as ChaseState
      return process({
        ...state,
        attacker: attacker,
        actionValue: VS.mainAttackValue(attacker),
        handling: VS.handling(attacker),
        squeal: VS.squeal(attacker),
        frame: VS.frame(attacker),
        crunch: VS.crunch(attacker),
        count: VS.isMook(attacker) ? VS.mooks(attacker) : 1,
        position: VS.position(attacker),
        method: defaultMethod(attacker) as ChaseMethod,
      })
    case ChaseActions.UPDATE:
      return process({
        ...state,
        ...action.payload,
      })
    case ChaseActions.RESET:
      return process(initialChaseState)
    default:
      return process(state)
  }
}
