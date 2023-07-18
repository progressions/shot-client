import type { SkillValue, Character, CharacterEffect } from "../types/types"

interface woundThresholdType {
  low: number,
  high: number,
}
interface woundThresholdsType {
  [key: string]: woundThresholdType,
}

export const woundThresholds: woundThresholdsType = {
  "Boss": { low: 40, high: 45, serious: 50 },
  "Uber-Boss": { low: 40, high: 45, serious: 50 },
  "PC": { low: 25, high: 30, serious: 35 },
  "Ally": { low: 25, high: 30, serious: 35 },
  "Featured Foe": { low: 25, high: 30, serious: 35 },
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

  // Adjusted for Impairment
  skill: (character: Character, key: string): number => {
    const value = character.skills[key] as number || 7
    return Math.max(0, value - CharacterService.impairments(character))
  },

  // Adjusted for Impairment
  // Attacks, Defense and skill checks
  actionValue: (character: Character, key: string): number => {
    const value = CharacterService.rawActionValue(character, key)
    return Math.max(0, value - CharacterService.impairments(character))
  },

  // Unadjusted for Impairment
  rawActionValue: (character: Character, key: string): number => {
    return character.action_values[key] as number || 0
  },

  // Use when fetching action values other than numbers.
  otherActionValue: (character: Character, key: string): string => {
    return character.action_values[key] as string || ""
  },

  mainAttack: (character: Character): string => {
    return CharacterService.otherActionValue(character, "MainAttack")
  },

  mainAttackValue: (character: Character): number => {
    return CharacterService.actionValue(character, CharacterService.mainAttack(character))
  },

  fortuneType: (character: Character): string => {
    return character.action_values["FortuneType"] as string || "Fortune"
  },

  maxFortuneLabel: (character: Character): string => {
    const fortuneType = CharacterService.fortuneType(character)
    return `Max ${fortuneType}`
  },

  maxFortune: (character: Character): number => {
    return CharacterService.rawActionValue(character, "Max Fortune")
  },

  marksOfDeath: (character: Character): number => {
    return character.action_values["Marks of Death"] as number || 0
  },

  impairments: (character: Character): number => {
    return character.impairments || 0
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
    return CharacterService.updateValue(character, "impairments", value)
  },

  healWounds: (character: Character, wounds: number): Character => {
    const originalWounds = CharacterService.wounds(character)
    const impairments = CharacterService.calculateImpairments(character, originalWounds - wounds, originalWounds)
    let updatedCharacter = CharacterService.addImpairments(character, -impairments)
    return CharacterService.updateActionValue(updatedCharacter, "Wounds", Math.max(0, originalWounds - wounds))
  },

  addDeathMarks: (character: Character, value: number): Character => {
    const deathMarks = character.action_values["Marks of Death"] as number || 0
    return CharacterService.updateActionValue(character, "Marks of Death", Math.max(0, deathMarks + value))
  },

  knownSkills: (character: Character): SkillValue[] => {
    return Object.entries(character.skills).filter(([name, value]: SkillValue) => (value as number > 0))
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

  updateSkill: (character: Character, key: string, value: number): Character => {
    return {
      ...character,
      skills: {
        ...character.skills,
        [key]: value
      }
    } as Character
  },

  updateValue: (character: Character, key: string, value: number | string): Character => {
    return {
      ...character,
      [key]: value
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
