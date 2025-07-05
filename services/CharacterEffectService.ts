import type { Fight, Character, CharacterEffect } from "@/types/types"
import CS from "@/services/CharacterService"
import FS from "@/services/FightService"

const CharacterEffectService = {
  adjustedMainAttack: function(character: Character, fight: Fight): [number, number] {
    const mainAttack = CS.mainAttack(character)
    return this.adjustedActionValue(character, mainAttack, fight, false)
  },

  effectsForCharacter: function(character: Character, effects: CharacterEffect[], name: string): CharacterEffect[] {
    return effects.filter((e: CharacterEffect) => {
      if (e.action_value === name) {
        return true
      }
      return (e.action_value === "MainAttack" && name === CS.mainAttack(character))
    })
  },

  adjustedDamage: function(character: Character, fight: Fight): [number, number] {
    return this.adjustedActionValue(character, "Damage", fight, true)
  },

  adjustedActionValue: function(character: Character, name: string, fight: Fight, ignoreImpairments: boolean = false): [number, number] {
    const effects = FS.characterEffects(fight, character)
    const matchingEffects = this.effectsForCharacter(character, effects, name)
    const value1 = CS.rawActionValue(character, name)
    const value2 = value1 - (ignoreImpairments ? 0 : CS.impairments(character))

    return this.actionValueAdjustedByEffects(character, matchingEffects, value1, value2)
  },

  adjustedValue: function(character: Character, value: number, name: string, fight: Fight, ignoreImpairments: boolean = false): [number, number] {
    const effects = FS.characterEffects(fight, character)
    const matchingEffects = this.effectsForCharacter(character, effects, name)
    const value1 = value
    const value2 = value1 - (ignoreImpairments ? 0 : CS.impairments(character))

    return this.actionValueAdjustedByEffects(character, matchingEffects, value1, value2)
  },

  actionValueAdjustedByEffects: function(character: Character, effects: CharacterEffect[], value1: number, value2: number): [number, number] {
    const effect = effects[0]

    if (effect) {
      if (["+", "-"].includes(effect.change?.[0] as string)) {
        const newValue2 = value2 + parseInt(effect.change as string)
        return this.actionValueAdjustedByEffects(character, effects.slice(1), value1, newValue2)
      }
      const newValue2 = (effect.change || 0) as number
      return this.actionValueAdjustedByEffects(character, effects.slice(1), value1, newValue2)
    }

    return this.adjustedReturnValue(value1, value2)
  },

  adjustedReturnValue: function(original: number, newValue: number): [number, number] {
    return [this.valueChange(original, newValue), newValue]
  },

  valueChange: function(original: number, newValue: number): number {
    return (newValue - original)

    if (newValue > original) return 1
    if (newValue < original) return -1

    return 0
  },

}

export default CharacterEffectService
