import { Character } from "@/types/types"
import { initialAttackState, AttackState } from "@/reducers/attackState"
import CS from "@/services/CharacterService"
import ARS from "@/services/AttackReducerService"
import { roll } from "@/__tests__/helpers/Helpers"

interface PartialAttackState {
  swerve: number
  actionValue?: number
  defense?: number
  damage?: number
  toughness?: number
  wounds?: number
  smackdown?: number
  outcome?: number
  mooks?: number
}

export function expectMookAttack(attacker: Character, target: Character, dieRolls: number[]) {
  let state = {
    ...initialAttackState,
  }
  state = ARS.setAttacker(state, attacker)
  state = ARS.setTarget(state, target)

  state.count = dieRolls.length
  state.edited = true

  const swerveSpy = jest.spyOn(ARS.AS, "swerve")
  dieRolls.forEach((dieRoll) => {
    swerveSpy.mockReturnValueOnce(roll(dieRoll))
  })

  const result = ARS.process(state)

  // write a reducer to set wounds to the accumulated result iterating over dieRolls
  const wounds = dieRolls.reduce((acc, dieRoll) => {
    const outcome = dieRoll + state.actionValue - state.defense
    const smackdown = outcome >= 0 ? outcome + state.damage : null
    const wounds = smackdown ? smackdown - state.toughness : null
    return acc + (wounds || 0)
  }, 0)

  expectAttackResults(state, result, {
    swerve: 0,
    outcome: 0,
    smackdown: 0,
    wounds: wounds
  })
}

export function expectAttack(attacker: Character, target: Character, dieRoll: number, stunt: boolean = false) {
  let state = {
    ...initialAttackState,
  }
  state = ARS.setAttacker(state, attacker)
  state = ARS.setTarget(state, target)

  state.swerve = roll(dieRoll)
  state.stunt = stunt
  state.edited = true
  const result = ARS.process(state)

  const outcome = dieRoll + state.actionValue - state.defense - (stunt ? 2 : 0)
  const smackdown = outcome >= 0 ? outcome + state.damage : null
  const wounds = smackdown ? smackdown - state.toughness : null

  expect(result.success).toEqual(outcome >= 0)

  expectAttackResults(state, result, {
    swerve: dieRoll,
    outcome: outcome,
    smackdown: smackdown as number,
    wounds: wounds as number,
  })
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
  const { swerve } = values

  const outcome = values.outcome
  const mooks = values.mooks

  // console.log(`Swerve ${swerve} + Action Value ${actionValue} - Defense ${defense} = Outcome ${swerve + actionValue - defense}`)
  // console.log(`Outcome ${swerve + actionValue - defense} + Damage ${damage} - Toughness ${toughness} = Wounds ${wounds}`)

  expect(result.swerve.result).toEqual(swerve)
  expect(result.outcome).toEqual(outcome)

  if (mooks) {
    expect(CS.mooks(result.target)).toEqual(CS.mooks(state.target) - mooks)
  } else {
    const wounds = values.wounds
    const smackdown = values.smackdown

    // defense values belong to the target
    const defense = values.defense || CS.defense(state.target)
    const toughness = values.toughness || CS.toughness(state.target)
    expect(result.defense).toEqual(defense)
    expect(result.toughness).toEqual(toughness)

    // attack values belong to the attacker
    const actionValue = values.actionValue || CS.mainAttackValue(state.attacker)
    const damage = values.damage || state.damage || CS.damage(state.attacker) || 7
    expect(result.actionValue).toEqual(actionValue)
    expect(result.damage).toEqual(damage)

    expect(result.smackdown).toEqual(smackdown)
    expect(result.wounds).toEqual(wounds)
    expect(CS.wounds(result.target)).toEqual(wounds || 0)
  }
  expectAttackerUnharmed(result, state)
}

