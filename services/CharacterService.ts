import type { Fight, Character, CharacterEffect } from "../types/types"

interface woundThresholdType {
  low: number,
  high: number,
}
interface woundThresholdsType {
  [key: string]: woundThresholdType,
}

const woundThresholds: woundThresholdsType = {
  "Boss": { "low": 40, "high": 45 },
  "Uber-Boss": { "low": 40, "high": 45 },
  "PC": { "low": 25, "high": 30 },
  "Ally": { "low": 25, "high": 30 },
  "Featured Foe": { "low": 25, "high": 30 },
}

const CharacterService = {
  name: (character: Character): string => {
    return character.name
  },

  type: (character: Character): string => {
    return "PC"
  },

  isType: (character: Character, type: string | string[]): boolean => {
    if (Array.isArray(type)) {
      return type.includes(character.action_values["Type"] as string)
    }

    return character.action_values["Type"] === type
  },

  actionValue: (character: Character, key: string): number => {
    return Math.max(0, character.action_values[key] as number - (character.impairments || 0))
  },

  mainAttack: (character: Character): string => {
    return character.action_values["MainAttack"] as string
  },

  mainAttackValue: (character: Character): number => {
    const impairments = character.impairments || 0
    return CharacterService.actionValue(character, CharacterService.mainAttack(character)) - impairments
  },

  isImpaired: (character: Character): boolean => {
    return character.impairments > 0
  },

  calculateImpairments: (character: Character, newWounds: number): number => {
    const originalWounds = character.action_values["Wounds"] as number
    const threshold = woundThresholds[CharacterService.type(character)]

    if (["Boss", "Uber-Boss"].includes(character.action_values["Type"] as string)) {
      // a Boss and an Uber-Boss gain 1 point of Impairment when their Wounds
      // goes from < 40 to between 40 and 44
      if (originalWounds < threshold.low && newWounds >= threshold.low && newWounds <= threshold.high) {
        return 1
      }
      // and gain 1 point of Impairment when their Wounds go from
      // between 40 and 44 to > 45
      if (originalWounds >= threshold.low && originalWounds <= threshold.high && newWounds > 45) {
        return 1
      }
      // and gain 2 points of Impairment when their Wounds go from
      // < 40 to >= 45
      if (originalWounds < threshold.low && newWounds >= threshold.high) {
        return 2
      }
    }

    // A PC, Ally, Featured Foe gain 1 point of Impairment when their Wounds
    // go from < 25 to between 25 and 30
    if (originalWounds < threshold.low && newWounds >= threshold.low && newWounds <= threshold.high) {
      return 1
    }
    // and gain 1 point of Impairment when their Wounds go from
    // between 25 and 29 to >= 30
    if (originalWounds >= threshold.low && originalWounds < threshold.high && newWounds >= 30) {
      return 1
    }
    // and gain 2 points of Impairment when their Wounds go from
    // < 25 to >= 35
    if (originalWounds < threshold.low && newWounds >= threshold.high) {
      return 2
    }

    return 0
  },

  calculateWounds: (character: Character, smackdown: number): number => {
    const toughness = CharacterService.actionValue(character, "Toughness")
    const wounds = Math.max(0, smackdown - toughness)

    return wounds
  },

  takeSmackdown: (character: Character, smackdown: number): Character => {
    const wounds = CharacterService.calculateWounds(character, smackdown)
    const originalWounds = character.action_values["Wounds"] as number
    const impairments = character.impairments + CharacterService.calculateImpairments(character, originalWounds + wounds)

    return {
      ...character,
      impairments: impairments,
      action_values: {
        ...character.action_values,
        "Wounds": Math.max(0, originalWounds + wounds),
      }
    } as Character
  },

  healWounds: (character: Character, wounds: number): Character => {
    const originalWounds = character.action_values["Wounds"] as number
    const impairments = character.impairments - CharacterService.calculateImpairments(character, originalWounds - wounds)

    return {
      ...character,
      impairments: impairments,
      action_values: {
        ...character.action_values,
        "Wounds": Math.max(0, originalWounds - wounds),
      }
    } as Character
  },

  addDeathMarks: (character: Character, value: number): Character => {
    const deathMarks = character.action_values["Marks of Death"] as number || 0
    return {
      ...character,
      action_values: {
        ...character.action_values,
        "Marks of Death": deathMarks + value
      }
    } as Character
  },

  updateActionValue: (character: Character, key: string, value: number | string): Character => {
    return {
      ...character,
      action_values: {
        ...character.action_values,
        [key]: value
      }
    } as Character
  },

  fullHeal: (character: Character): Character => {
    if (CharacterService.isType(character, "Mook")) return character

    const maxFortune = CharacterService.actionValue(character, "Max Fortune")
    let updatedCharacter = CharacterService.updateActionValue(character, "Wounds", 0)
    updatedCharacter = CharacterService.updateActionValue(updatedCharacter, "Marks of Death", 0)
    updatedCharacter = CharacterService.updateActionValue(updatedCharacter, "Fortune", maxFortune)
    updatedCharacter.impairments = 0

    return updatedCharacter
  },

  wounds: (character: Character): number => {
    if (CharacterService.isType(character, "Mook")) {
      return character.count || 0
    }
    return character.action_values["Wounds"] as number || 0
  },

  seriousWounds: (character: Character): boolean => {
    if (CharacterService.isType(character, ["Boss", "Uber-Boss"]) && CharacterService.wounds(character) > 50) {
      return true
    }
    if (!CharacterService.isType(character, "Mook") && CharacterService.wounds(character) > 35) {
      return true
    }
    return false
  }
}

export default CharacterService
