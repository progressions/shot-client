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

  attacks: function({ count, actionValue, defense, damage, toughness }: { count: number, actionValue: number, defense: number, damage: number, toughness: number }): AttackRollType[] {
    const attacks = []
    for (let i = 0; i < count; i++) {
      attacks.push(this.wounds({ actionValue, defense, damage, toughness }))
    }
    return attacks
  },

  wounds: function({ swerve, actionValue, defense, damage, toughness }: { swerve?: Swerve, actionValue: number, defense: number, damage: number, toughness: number }): AttackRollType {
    const smackdown = this.smackdown({ actionValue, defense, damage })
    const wounds = Math.max(0, (smackdown.smackdown || 0) - toughness)
    console.log(`Wounds ${wounds} : Smackdown ${smackdown.smackdown} - Toughness ${toughness}`)
    return {
      ...smackdown,
      wounds,
    }
  },

  smackdown: function({ swerve, actionValue, defense, damage }: { swerve?: Swerve, actionValue: number, defense: number, damage: number }): AttackRollType {
    const outcome = this.outcome({ actionValue, defense })
    const success = (outcome.outcome || 0) > 0
    const smackdown = success ? (outcome.outcome || 0) + damage : 0
    console.log(`Smackdown ${smackdown} : Outcome ${outcome.outcome} + Damage ${damage}`)
    return {
      ...outcome,
      success,
      smackdown,
    }
  },

  outcome: function({ swerve, actionValue, defense }: { swerve?: Swerve, actionValue: number, defense: number }): AttackRollType {
    const actionResult = this.actionResult({ actionValue })
    const outcome = Math.max(0, actionResult.actionResult - defense)
    console.log(`Outcome ${outcome} : ActionResult ${actionResult.actionResult} - Defense ${defense}`)
    return {
      ...actionResult,
      outcome,
    }
  },

  actionResult: function({ swerve, actionValue }: { swerve?: Swerve, actionValue: number }): AttackRollType {
    const rolledSwerve = swerve || this.swerve()
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
