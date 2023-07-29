import type { Weapon, Fight, Character, Vehicle } from "../types/types"
import { defaultWeapon, defaultCharacter } from "../types/types"
import CS from "./CharacterService"
import AS from "./ActionService"
import CES from "./CharacterEffectService"
import { parseToNumber } from "../utils/parseToNumber"
import { MookResult, AttackState } from "../reducers/attackState"

const AttackReducerService = {
  process: function(state: AttackState): AttackState {
    let st = this.convertToNumber(state)

    if (st.edited) {
      // roll attacks for all mooks
      if (this.CS.isMook(st.attacker)) return this.resolveMookAttacks(st)

      // roll attack and apply the attack results
      return this.resolveAttack(st)
    }

    return st
  },

  // Resolve the attack roll from a single attack, and apply the
  // results to the target and the attacker.
  //
  // If the attacker is a Mook, call resolveMookAttacks instead.
  //
  resolveAttack: function(state: AttackState): AttackState {
    const st = this.calculateAttackValues(state)

    if (!st.success) return st

    const { target, smackdown, count } = st
    const dmg = this.CS.isMook(target) ? count : smackdown
    const updatedTarget = this.CS.takeSmackdown(target, dmg as number)

    return {
      ...st,
      target: updatedTarget,
    }
  },

  resolveMookAttacks: function(st: AttackState): AttackState {
    const results:MookResult[] = []
    let wounds = 0
    let success = st.success

    for (let i = 0; i < st.count; i++) {
      const swerve = this.AS.swerve()
      const result = this.calculateAttackValues({
        ...st,
        swerve: swerve,
        typedSwerve: "",
      })

      wounds += result.wounds as number
      success ||= result.success

      results.push({
        actionResult: result.actionResult,
        success: result.success,
        smackdown: result.smackdown as number,
        wounds: result.wounds as number,
      })
    }

    // apply the wounds to the target
    const target = CS.takeRawWounds(st.target, wounds)

    return {
      ...st,
      target: target,
      success: success,
      mookResults: results,
      wounds: wounds,
    }
  },

  calculateAttackValues: function(st: AttackState): AttackState {
    if (st.typedSwerve !== "") {
      st.swerve = { ...st.swerve, result: parseToNumber(st.typedSwerve) }
    }

    st.modifiedDefense = this.R.calculateDefense(st)
    st.modifiedActionValue = this.R.calculateMainAttack(st)
    st.modifiedToughness = this.R.calculateToughness(st)
    st.mookDefense = this.R.targetMookDefense(st)

    const { actionResult, outcome, smackdown, wounds, wayAwfulFailure } = this.AS.wounds({
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
  },

  convertToNumber: function(state: AttackState): AttackState {
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
  },

  setAttacker: function(state: AttackState, attacker: Character | Vehicle): AttackState {
    const [_adjustment, adjustedMainAttack] = this.CES.adjustedMainAttack(attacker, state.fight)
    const mookCount = this.CS.isMook(attacker) ? this.CS.mooks(attacker) : 1
    const weapon = CS.weapons(attacker)[0] || defaultWeapon

    const st = this.setWeapon(state, weapon)

    return this.process({
      ...st,
      attacker: attacker,
      actionValueName: CS.mainAttack(attacker) || "",
      actionValue: adjustedMainAttack,
      count: mookCount,
    })
  },

  setTarget: function(state: AttackState, target: Character | Vehicle): AttackState {
    const [_defenseAdjustment, adjustedDefense] = this.CES.adjustedActionValue(target, "Defense", state.fight, false)
    const [_toughnessAdjustment, adjustedToughness] = this.CES.adjustedActionValue(target, "Toughness", state.fight, true)

    return this.process({
      ...state,
      target: target,
      defense: adjustedDefense,
      toughness: this.CS.isMook(target) ? 0 : adjustedToughness,
    })
  },

  setWeapon: function(state: AttackState, weapon: Weapon): AttackState {
    return this.process({
      ...state,
      weapon: weapon,
      damage: weapon?.damage || 7,
    })
  },

  R: {
    calculateDefense: function(st: AttackState): string {
      const [_defenseAdjustment, adjustedDefense] = this.CES.adjustedActionValue(st.target, "Defense", st.fight, false)
      if (st.stunt) {
        return `${st.defense + 2}*`
      } else if (this.CS.impairments(st.target) > 0 || adjustedDefense != CS.defense(st.target)) {
        return `${st.defense}*`
      }
      return `${st.defense}`
    },

    calculateMainAttack: function(st: AttackState): string {
      const [_adjustment, adjustedMainAttack] = this.CES.adjustedMainAttack(st.attacker, st.fight)
      if (st.actionValueName && (adjustedMainAttack != this.CS.mainAttackValue(st.attacker) || CS.impairments(st.attacker) > 0)) {
        return `${st.actionValue}*`
      }
      return `${st.actionValue}`
    },

    calculateToughness: function(st: AttackState): string {
      const [toughnessAdjustment, adjustedToughness] = this.CES.adjustedActionValue(st.target, "Toughness", st.fight, true)
      if (this.CS.toughness(st.target) != adjustedToughness && toughnessAdjustment != 0) {
        return `${adjustedToughness}*`
      }
      return `${st.toughness}`
    },

    targetMookDefense: function(st: AttackState): number {
      if (this.CS.isMook(st.target) && st.count > 1) {
        return st.defense + st.count
      }
      return st.defense
    },

    AS: AS,
    CS: CS,
    CES: CES,
  },

  AS: AS,
  CS: CS,
  CES: CES,
}

export default AttackReducerService
