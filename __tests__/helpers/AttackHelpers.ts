import { AttackState } from "../../reducers/attackState"
import CS from "../../services/CharacterService"

interface PartialAttackState {
  swerve: number
  actionValue?: number
  defense?: number
  damage?: number
  toughness?: number
  wounds: number
  smackdown: number
  outcome: number
  mooks?: number
}

export function expectNoChanges(state: AttackState, result: AttackState) {
  expectAttackerUnharmed(state, result)
  expectTargetUnharmed(state, result)
}

export function expectAttackerUnharmed(state: AttackState, result: AttackState) {
  expect(CS.wounds(result.attacker)).toEqual(CS.wounds(state.attacker))
}

export function expectTargetUnharmed(state: AttackState, result: AttackState) {
  expect(CS.wounds(result.target)).toEqual(CS.wounds(state.target))
}

export function expectAttackResults(state: AttackState, result: AttackState, values: PartialAttackState) {
  const { swerve, outcome, wounds } = values

  // console.log(`Swerve ${swerve} + Action Value ${actionValue} - Defense ${defense} = Outcome ${swerve + actionValue - defense}`)
  // console.log(`Outcome ${swerve + actionValue - defense} + Damage ${damage} - Toughness ${toughness} = Wounds ${wounds}`)

  const smackdown = values.smackdown

  expect(result.swerve.result).toEqual(swerve)

  const mooks = values.mooks

  if (mooks) {
    expect(CS.mooks(result.target)).toEqual(CS.mooks(state.target) - mooks)
  } else {
    // defense values belong to the target
    const defense = values.defense || CS.defense(state.target)
    const toughness = values.toughness || CS.toughness(state.target)
    expect(result.defense).toEqual(defense)
    expect(result.toughness).toEqual(toughness)

    // attack values belong to the attacker
    const actionValue = values.actionValue || CS.mainAttackValue(state.attacker)
    const damage = values.damage || CS.damage(state.attacker) || 7
    expect(result.actionValue).toEqual(actionValue)
    expect(result.damage).toEqual(damage)

    expect(result.smackdown).toEqual(smackdown)
    expect(result.wounds).toEqual(wounds)
    expect(CS.wounds(result.target)).toEqual(wounds)
  }
  expectAttackerUnharmed(result, state)
}

