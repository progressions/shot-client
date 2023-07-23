import { rollDie, rollExplodingDie, rollSwerve } from "../components/dice/DiceRoller"
import type { Swerve } from "../components/dice/DiceRoller"
import type { AttackState } from "../reducers/attackState"

export interface AttackRollType {
  boxcars: boolean
  wayAwfulFailure: boolean
  swerve: number
  actionResult: number
  outcome?: number
  success?: boolean
  smackdown?: number
  wounds?: number
}

const ActionService = {
  totalWounds: function({ attackRolls, toughness }: { attackRolls: any[], toughness: number }): number {
    return attackRolls.reduce((total: number, attackRoll: any) => {
      return total + (attackRoll.wounds || 0)
    }, 0)
  },

  totalChasePoints: function({ attackRolls, toughness }: { attackRolls: any[], toughness: number }): number {
    return attackRolls.reduce((total: number, attackRoll: any) => {
      return total + (attackRoll.chasePoints || 0)
    }, 0)
  },

  totalConditionPoints: function({ attackRolls, toughness }: { attackRolls: any[], toughness: number }): number {
    return attackRolls.reduce((total: number, attackRoll: any) => {
      return total + (attackRoll.conditionPoints || 0)
    }, 0)
  },

  attacks: function({ count, actionValue, defense, stunt, damage, toughness }: { count: number, actionValue: number, defense: number, stunt?: boolean, damage: number, toughness: number }): AttackRollType[] {
    const attacks = []
    for (let i = 0; i < count; i++) {
      attacks.push(this.wounds({ actionValue, defense, stunt, damage, toughness }))
    }
    return attacks
  },

  wounds: function({ swerve, actionValue, defense, stunt, damage, toughness }: { swerve?: Swerve, actionValue: number, defense: number, stunt?: boolean, damage: number, toughness: number }): AttackRollType {
    const smackdown = this.smackdown({ swerve, actionValue, defense, stunt, damage })
    const wounds = Math.max(0, (smackdown.smackdown || 0) - toughness)
    console.log(`Wounds ${wounds} : Smackdown ${smackdown.smackdown} - Toughness ${toughness}`)
    return {
      ...smackdown,
      wounds,
    }
  },

  smackdown: function({ swerve, actionValue, defense, stunt, damage }: { swerve?: Swerve, actionValue: number, defense: number, stunt?: boolean, damage: number }): AttackRollType {
    const outcome = this.outcome({ swerve, actionValue, defense, stunt })
    const smackdown = outcome.success ? (outcome.outcome || 0) + (damage || 0) : 0
    console.log(`Smackdown ${smackdown} : Outcome ${outcome.outcome} + Damage ${damage || 0}`)
    return {
      ...outcome,
      smackdown,
    }
  },

  outcome: function({ swerve, actionValue, defense, stunt }: { swerve?: Swerve, actionValue: number, defense: number, stunt?: boolean }): AttackRollType {
    const actionResult = this.actionResult({ swerve, actionValue })
    const modifiedDefense = stunt ? defense + 2 : defense
    const outcome = actionResult.actionResult - modifiedDefense
    const success = outcome >= 0
    console.log(`Outcome ${outcome} : ActionResult ${actionResult.actionResult} - Defense ${modifiedDefense}${stunt ? "*" : ""}`)
    return {
      ...actionResult,
      outcome,
      success,
      wayAwfulFailure: actionResult.wayAwfulFailure || (actionResult.boxcars && outcome < 0)
    }
  },

  actionResult: function({ swerve, actionValue }: { swerve?: Swerve, actionValue: number }): AttackRollType {
    const rolledSwerve = swerve === undefined ? this.swerve() : swerve
    const result = actionValue + rolledSwerve.result
    console.log(`ActionResult ${result} : Swerve ${rolledSwerve.result} + ActionValue ${actionValue}`)
    return {
      boxcars: rolledSwerve.boxcars,
      swerve: rolledSwerve.result,
      actionResult: result,
      wayAwfulFailure: result < 0
    }
  },

  // { result, positiveRolls, negativeRolls, positive, negative, boxcars }
  swerve: function(): Swerve {
    const swerve = rollSwerve()
    console.log("Rolling swerve", swerve)
    return swerve
  }
}

export default ActionService
