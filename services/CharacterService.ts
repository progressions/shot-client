import type { Fight, Character, CharacterEffect } from "../types/types"

interface woundThresholdType {
  low: number,
  high: number,
}
interface woundThresholdsType {
  [key: string]: woundThresholdType,
}

export const woundThresholds: woundThresholdsType = {
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

  isCharacter: (character: Character): boolean => {
    return (character.category === "character")
  },

  isVehicle: (character: Character): boolean => {
    return (character.category === "vehicle")
  },

  isType: (character: Character, type: string | string[]): boolean => {
    if (Array.isArray(type)) {
      return type.includes(character.action_values["Type"] as string)
    }

    return character.action_values["Type"] === type
  },

  skill: (character: Character, key: string): number => {
    return character.skills[key] as number || 7
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

  marksOfDeath: (character: Character): number => {
    return character.action_values["Marks of Death"] as number || 0
  },

  isImpaired: (character: Character): boolean => {
    return character.impairments > 0
  },

  calculateImpairments: (character: Character, originalWounds:number, newWounds: number): number => {
    if (CharacterService.isType(character, "Mook")) return 0

    const threshold = woundThresholds[CharacterService.type(character)]

    // a Boss and an Uber-Boss gain 1 point of Impairment when their Wounds
    // goes from < 40 to between 40 and 44
    // A PC, Ally, Featured Foe gain 1 point of Impairment when their Wounds
    // go from < 25 to between 25 and 30
    if (originalWounds < threshold.low && newWounds >= threshold.low && newWounds <= threshold.high) {
      return 1
    }
    // Boss and Uber-Boss gain 1 point of Impairment when their Wounds go from
    // between 40 and 44 to > 45
    // PC, Ally, Featured Foe gain 1 point of Impairment when their Wounds go from
    // between 25 and 29 to >= 30
    if (originalWounds >= threshold.low && originalWounds < threshold.high && newWounds >= 30) {
      return 1
    }
    // Boss and Uber-Boss gain 2 points of Impairment when their Wounds go from
    // < 40 to >= 45
    // PC, Ally, Featured Foe gain 2 points of Impairment when their Wounds go from
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
    const impairments = CharacterService.calculateImpairments(character, originalWounds, originalWounds + wounds)
    const updatedCharacter = CharacterService.addImpairments(character, impairments)
    return CharacterService.updateActionValue(updatedCharacter, "Wounds", Math.max(0, originalWounds + wounds))
  },

  addImpairments: (character: Character, value: number): Character => {
    console.log("addImpairments", value)
    return {
      ...character,
      impairments: character.impairments + value
    } as Character
  },

  healWounds: (character: Character, wounds: number): Character => {
    const originalWounds = CharacterService.wounds(character)
    const impairments = CharacterService.calculateImpairments(character, originalWounds - wounds, originalWounds)
    let updatedCharacter = CharacterService.addImpairments(character, -impairments)
    return CharacterService.updateActionValue(updatedCharacter, "Wounds", Math.max(0, originalWounds - wounds))
  },

  addDeathMarks: (character: Character, value: number): Character => {
    const deathMarks = character.action_values["Marks of Death"] as number || 0
    return CharacterService.updateActionValue(updatedCharacter, "Marks of Death", Math.max(0, deathMarks + value))
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
