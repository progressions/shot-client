import type { Position, Fight, Character, Vehicle } from "../types/types"
import AS from "./ActionService"
import CES from "./CharacterEffectService"
import VS from "./VehicleService"
import { ChaseMethod, ChaseState } from "../reducers/chaseState"
import { parseToNumber } from "../utils/parseToNumber"

const ChaseReducerService = {
  convertToNumber: function(state: ChaseState): ChaseState {
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
  },

  calculateDefense: function(st: ChaseState): string {
    if (st.stunt) {
      return `${st.defense + 2}*`
    } else if (this.VS.impairments(st.target) > 0) {
      return `${st.defense}*`
    }
    return `${st.defense}`
  },

  calculateMainAttack: function(st: ChaseState): string {
    return `${st.actionValue}`
  },

  targetMookDefense: function(st: ChaseState): number {
    if (this.VS.isMook(st.target) && st.count > 1) {
      return st.defense + st.count + (st.stunt ? 2 : 0)
    }
    return st.defense
  },

  makeAttack: function(st: ChaseState): ChaseState {
    if (this.VS.isMook(st.attacker) && st.count > 1) {
      return this.calculateMookAttackValues(st)
    }
    return this.calculateAttackValues(st)
  },

  calculateMookAttackValues: function(st: ChaseState): ChaseState {
    const results = []
    for (let i = 0; i < st.count; i++) {
      const swerve = this.AS.swerve()
      const result = this.calculateAttackValues({
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
  },

  closeGapPosition: function(st: ChaseState, success: boolean): string {
    if (success && !this.VS.isNear(st.attacker)) {
      return "near"
    }
    return st.position
  },

  widenGapPosition: function(st: ChaseState, success: boolean): string {
    if (success && this.VS.isNear(st.attacker)) {
      return "far"
    }
    return st.position
  },

  pursue: function(st: ChaseState): ChaseState {
    const { success, actionResult, outcome, smackdown, wounds, wayAwfulFailure } = this.AS.wounds({
      swerve: st.swerve,
      actionValue: st.actionValue,
      defense: st.mookDefense,
      stunt: st.stunt,
      toughness: this.calculateToughness(st),
      damage: this.calculateDamage(st),
    })

    const position = this.closeGapPosition(st, success as boolean)

    return {
      ...st,
      // calculated values
      actionResult: actionResult,
      outcome: outcome || null,
      success: success as boolean,
      smackdown: smackdown || null,
      position: position as Position,
      chasePoints: wounds || null,
      conditionPoints: this.VS.isNear(st.attacker) ? wounds as number : null,
      boxcars: st.swerve.boxcars,
      wayAwfulFailure: wayAwfulFailure,
    }
  },

  calculateToughness: function(st: ChaseState): number {
    switch (st.method) {
      case ChaseMethod.RAM_SIDESWIPE:
        return st.frame
      default:
        return st.handling
    }
  },

  calculateDamage: function(st: ChaseState): number {
    switch (st.method) {
      case ChaseMethod.RAM_SIDESWIPE:
        return st.crunch
      default:
        return st.squeal
    }
  },

  evade: function(st: ChaseState): ChaseState {
    const { success, actionResult, outcome, smackdown, wounds, wayAwfulFailure } = AS.wounds({
      swerve: st.swerve,
      actionValue: st.actionValue,
      defense: st.mookDefense,
      stunt: st.stunt,
      toughness: this.calculateToughness(st),
      damage: this.calculateDamage(st),
    })

    const position = this.widenGapPosition(st, success as boolean)

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
  },

  calculateAttackValues: function(st: ChaseState): ChaseState {
    if (st.typedSwerve !== "") {
      st.swerve = { ...st.swerve, result: parseToNumber(st.typedSwerve) }
    }

    st.modifiedDefense = this.calculateDefense(st)
    st.modifiedActionValue = this.calculateMainAttack(st)
    st.mookDefense = this.targetMookDefense(st)

    if (this.VS.isPursuer(st.attacker)) {
      return this.pursue(st)
    }

    return this.evade(st)
  },

  process: function(state: ChaseState): ChaseState {
    let st = this.convertToNumber(state)

    if (st.edited) {
      st = this.makeAttack(st)
      if (this.VS.isMook(st.attacker)) return this.resolveMookAttack(st)
      return this.resolveAttack(st)
    }

    return st
  },

  // resolve attacks by mooks
  resolveMookAttack: function(st: ChaseState): ChaseState {
    const updatedState = st.mookResults.reduce((acc, result) => {
      result.target = acc.target
      result.attacker = acc.attacker

      const upState = this.resolveAttack(result)

      return {
        ...acc,
        chasePoints: (acc.chasePoints || 0) + (upState.chasePoints || 0),
        conditionPoints: (acc.conditionPoints || 0) + (upState.conditionPoints || 0),
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
  },

  killMooks: function(st: ChaseState): ChaseState {
    if (!st.success) return st

    let updatedAttacker = st.attacker
    let updatedTarget = st.target

    const { method, attacker, count, target } = st

    switch (method) {
      case ChaseMethod.RAM_SIDESWIPE:
        [updatedAttacker, updatedTarget] = this.VS.ramSideswipe(attacker, count, target)
        break
      case ChaseMethod.WIDEN_THE_GAP:
        [updatedAttacker, updatedTarget] = this.VS.widenTheGap(attacker, count, target)
        break
      case ChaseMethod.NARROW_THE_GAP:
        [updatedAttacker, updatedTarget] = this.VS.narrowTheGap(attacker, count, target)
        break
      case ChaseMethod.EVADE:
        [updatedAttacker, updatedTarget] = this.VS.evade(attacker, count, target)
        break
    }

    return {
      ...st,
      attacker: updatedAttacker,
      target: updatedTarget
    }
  },

  resolveAttack: function(st: ChaseState): ChaseState {
    if (this.VS.isMook(st.target) && st.count > 1) return this.killMooks(st)

    let updatedAttacker = st.attacker
    let updatedTarget = st.target

    const { method, attacker, smackdown, target } = st
    const beforeChasePoints = this.VS.chasePoints(target)
    const beforeConditionPoints = this.VS.conditionPoints(target)

    switch (method) {
      case ChaseMethod.RAM_SIDESWIPE:
        [updatedAttacker, updatedTarget] = this.VS.ramSideswipe(attacker, smackdown as number, target)
        break
      case ChaseMethod.WIDEN_THE_GAP:
        [updatedAttacker, updatedTarget] = this.VS.widenTheGap(attacker, smackdown as number, target)
        break
      case ChaseMethod.NARROW_THE_GAP:
        [updatedAttacker, updatedTarget] = this.VS.narrowTheGap(attacker, smackdown as number, target)
        break
      case ChaseMethod.EVADE:
        [updatedAttacker, updatedTarget] = this.VS.evade(attacker, smackdown as number, target)
        break
    }

    const afterChasePoints = this.VS.chasePoints(updatedTarget)
    const afterConditionPoints = this.VS.conditionPoints(updatedTarget)
    const chasePointsDifference = afterChasePoints - beforeChasePoints
    const conditionPointsDifference = afterConditionPoints - beforeConditionPoints

    return {
      ...st,
      chasePoints: chasePointsDifference,
      conditionPoints: conditionPointsDifference,
      attacker: updatedAttacker,
      target: updatedTarget,
    }
  },

  defaultMethod: function(attacker: Vehicle): string {
    if (this.VS.isPursuer(attacker) && VS.isNear(attacker)) return ChaseMethod.RAM_SIDESWIPE
    if (this.VS.isPursuer(attacker) && VS.isFar(attacker)) return ChaseMethod.NARROW_THE_GAP
    if (this.VS.isEvader(attacker) && VS.isNear(attacker)) return ChaseMethod.WIDEN_THE_GAP
    return ChaseMethod.EVADE
  },

  AS: AS,
  VS: VS,
}

export default ChaseReducerService
