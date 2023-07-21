import { rollDie, rollExplodingDie, rollSwerve } from "../components/dice/DiceRoller"
import type { Swerve } from "../components/dice/DiceRoller"

export interface AttackRollType {
  boxcars: boolean
  swerve: number
  actionResult: number
  outcome?: number
  success?: boolean
  smackdown?: number
  wounds?: number
}

const ActionService = {
  totalWounds: function({ attackRolls, toughness }: { attackRolls: AttackRollType[], toughness: number }): number {
    return attackRolls.reduce((total: number, attackRoll: AttackRollType) => {
      return total + (attackRoll.wounds || 0)
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
    const success = (outcome.outcome || 0) > 0
    const smackdown = success ? (outcome.outcome || 0) + (damage || 0) : 0
    console.log(`Smackdown ${smackdown} : Outcome ${outcome.outcome} + Damage ${damage || 0}`)
    return {
      ...outcome,
      success,
      smackdown,
    }
  },

  outcome: function({ swerve, actionValue, defense, stunt }: { swerve?: Swerve, actionValue: number, defense: number, stunt?: boolean }): AttackRollType {
    const actionResult = this.actionResult({ swerve, actionValue })
    const modifiedDefense = stunt ? defense + 2 : defense
    const outcome = actionResult.actionResult - modifiedDefense
    console.log(`Outcome ${outcome} : ActionResult ${actionResult.actionResult} - Defense ${modifiedDefense}${stunt ? "*" : ""}`)
    return {
      ...actionResult,
      outcome,
    }
  },

  actionResult: function({ swerve, actionValue }: { swerve?: Swerve, actionValue: number }): AttackRollType {
    const rolledSwerve = swerve === undefined ? this.swerve() : swerve
    const result = actionValue + rolledSwerve.result
    console.log(`ActionResult ${result} : Swerve $rolledSwerve.result} + ActionValue ${actionValue}`)
    return {
      boxcars: rolledSwerve.boxcars,
      swerve: rolledSwerve.result,
      actionResult: result,
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
