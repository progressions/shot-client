import type { Fight, Character, CharacterEffect } from "../types/types"
import CharacterService from "./CharacterService"

const valueChange = (original: number, newValue: number): number => {
  if (newValue > original) return 1
  if (newValue < original) return -1

  return 0
}

const adjustedReturnValue = (original: number, newValue: number): [number, number] => {
  return [valueChange(original, newValue), newValue]
}

const CharacterEffectService = {
  effectForCharacter: (character: Character, effects: CharacterEffect[], name: string): CharacterEffect | undefined => {
    const effect = effects.find((e: CharacterEffect) => {
      if (e.action_value === name) {
        return true
      }
      return (e.action_value === "MainAttack" && name === CharacterService.mainAttack(character))
    })

    return effect
  },

  adjustedActionValue: (character: Character, name: string, fight: Fight, ignoreImpairments: boolean): [number, number] => {
    const impairments = ignoreImpairments ? 0 : character.impairments
    const effects = fight.character_effects[character.shot_id as string] || []
    const effect = CharacterEffectService.effectForCharacter(character, effects, name)
    const original = (character.action_values[name] || 0) as number
    const originalWithImpairments = original - impairments

    if (effect) {
      if (["+", "-"].includes(effect.change?.[0] as string)) {
        const newValue = originalWithImpairments + parseInt(effect.change as string)
        return adjustedReturnValue(originalWithImpairments, newValue)
      }
      const newValue = (effect.change || 0) as number
      return adjustedReturnValue(originalWithImpairments, newValue)
    }

    return adjustedReturnValue(original, originalWithImpairments)
  },
}

export default CharacterEffectService
