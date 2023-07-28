import { AttackState } from "../../reducers/attackState"
import CS from "../../services/CharacterService"

interface PartialAttackState {
  success: boolean
  swerve: number
  actionValue: number
  defense: number
  damage: number
  toughness: number
  wounds: number
  smackdown: number
  outcome: number
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
  const { success, swerve, actionValue, defense, outcome, damage, smackdown, toughness, wounds } = values

  // console.log(`Swerve ${swerve} + Action Value ${actionValue} - Defense ${defense} = Outcome ${swerve + actionValue - defense}`)
  // console.log(`Outcome ${swerve + actionValue - defense} + Damage ${damage} - Toughness ${toughness} = Wounds ${wounds}`)

  expect(result.success).toEqual(success)
  expect(result.swerve.result).toEqual(swerve)
  expect(result.actionValue).toEqual(actionValue)
  expect(result.defense).toEqual(defense)
  expect(result.damage).toEqual(damage)
  expect(result.smackdown).toEqual(smackdown)
  expect(result.toughness).toEqual(toughness)
  expect(result.wounds).toEqual(wounds)

  expect(CS.wounds(result.target)).toEqual(wounds)
  expectAttackerUnharmed(result, state)
}

