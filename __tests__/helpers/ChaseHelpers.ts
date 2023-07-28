import { ChaseMethod, initialChaseState, ChaseState } from "../../reducers/chaseState"
import VS from "../../services/VehicleService"

interface PartialChaseState {
  swerve: number
  actionValue?: number
  defense?: number
  handling?: number
  squeal?: number
  frame?: number
  crunch?: number
  chasePoints?: number
  conditionPoints?: number
  smackdown?: number
  outcome: number
  position?: string
  bump?: number
  mooks?: number
}

export function expectTargetUnharmed(state: ChaseState, result: ChaseState) {
  // the target has taken no damage
  expect(VS.chasePoints(result.target)).toEqual(VS.chasePoints(state.target))
  expect(VS.conditionPoints(result.target)).toEqual(VS.conditionPoints(state.target))
}

export function expectAttackerUnharmed(state: ChaseState, result: ChaseState) {
  if (VS.isMook(result.attacker)) {
    expect(VS.mooks(result.attacker)).toEqual(VS.mooks(state.attacker))
  }
  // the attacker has taken no damage
  expect(VS.chasePoints(result.attacker)).toEqual(VS.chasePoints(state.attacker))
  expect(VS.conditionPoints(result.attacker)).toEqual(VS.conditionPoints(state.attacker))
}

export function expectPositionsUnchanged(state: ChaseState, result: ChaseState) {
  // their positions haven't changed
  expect(VS.position(result.attacker)).toEqual(VS.position(state.attacker))
  expect(VS.position(result.target)).toEqual(VS.position(state.target))
}

export function expectNoChanges(state: ChaseState, result: ChaseState) {
  expectAttackerUnharmed(state, result)
  expectTargetUnharmed(state, result)
  expectPositionsUnchanged(state, result)
}

export function expectChaseResults(state: ChaseState, result: ChaseState, values: PartialChaseState) {
  const { swerve, outcome } = values

  const smackdown = values.smackdown
  const chasePoints = values.chasePoints
  const conditionPoints = values.conditionPoints

  // attack values belong to the attacker
  const actionValue = values.actionValue || VS.mainAttackValue(state.attacker)
  const squeal = values.squeal || VS.squeal(state.attacker)
  const crunch = values.crunch || VS.crunch(state.attacker)

  // defense values belong to the target
  const defense = values.defense || VS.defense(state.target)
  const handling = values.handling || VS.handling(state.target)
  const frame = values.frame || VS.frame(state.target)

  const position = values.position || VS.position(state.attacker)

  // bump only applies on a sideswipe if the target's frame is higher than the attacker's
  const bump = values.bump || 0

  const mooks = values.mooks

  // console.log(`Swerve ${swerve} + Action Value ${actionValue} - Defense ${defense} = Outcome ${swerve + actionValue - defense}`)
  // console.log(`Outcome ${swerve + actionValue - defense} + Damage ${damage} - Toughness ${toughness} = Chase Points ${chasePoints}`)
  // console/log(`And Condition Points ${conditionPoints}`)

  expect(result.swerve.result).toEqual(swerve)
  expect(result.actionValue).toEqual(actionValue)
  expect(result.defense).toEqual(defense)

  if (mooks) {
    expect(VS.mooks(result.target)).toEqual(VS.mooks(state.target) - mooks)
  } else {
    expect(result.smackdown).toEqual(smackdown)

    expect(result.handling).toEqual(handling)
    expect(result.squeal).toEqual(squeal)
    expect(result.frame).toEqual(frame)
    expect(result.crunch).toEqual(crunch)

    // the state knows how much damage was dealt
    expect(result.chasePoints).toEqual(chasePoints)
    expect(result.conditionPoints).toEqual(conditionPoints)

    expect(VS.chasePoints(result.target)).toEqual(chasePoints)
    expect(VS.conditionPoints(result.target)).toEqual(conditionPoints)
  }

  expect(VS.position(result.attacker)).toEqual(position)
  expect(VS.position(result.target)).toEqual(position)

  expect(VS.chasePoints(result.attacker)).toEqual(bump)
  expect(VS.conditionPoints(result.attacker)).toEqual(bump)
}
