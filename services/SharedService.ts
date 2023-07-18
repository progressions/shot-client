import type { Vehicle, Character } from "../types/types"

interface woundThresholdType {
  low: number,
  high: number,
  serious: number,
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

const SharedService = {
  name: function(character: Character | Vehicle): string {
    return character.name
  },

  type: function(character: Character | Vehicle): string {
    return this.otherActionValue(character, "Type")
  },

  isCharacter: function(character: Character | Vehicle): boolean {
    return (character.category === "character")
  },

  isVehicle: function(character: Character | Vehicle): boolean {
    return (character.category === "vehicle")
  },

  isType: function(character: Character | Vehicle, type: string | string[]): boolean {
    if (Array.isArray(type)) {
      return type.includes(this.type(character))
    }

    return this.type(character) === type
  },

  // Adjusted for Impairment
  // Attacks, Defense and skill checks
  actionValue: function(character: Character | Vehicle, key: string): number {
    const value = this.rawActionValue(character, key)
    return Math.max(0, value - this.impairments(character))
  },

  // Unadjusted for Impairment
  rawActionValue: function(character: Character | Vehicle, key: string): number {
    return character.action_values[key] as number || 0
  },

  // Use when fetching action values other than numbers.
  otherActionValue: function(character: Character | Vehicle, key: string): string {
    return character.action_values[key] as string || ""
  },

  impairments: function(character: Character | Vehicle): number {
    return character.impairments || 0
  },

  isImpaired: function(character: Character | Vehicle): boolean {
    return character.impairments > 0
  },

  addImpairments: function(character: Character | Vehicle, value: number): Character | Vehicle {
    return this.updateValue(character, "impairments", value)
  },

  calculateImpairments: function(character: Character | Vehicle, originalWounds:number, newWounds: number): number {
    if (this.isType(character, "Mook")) return 0

    const threshold = woundThresholds[this.type(character)]

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

  updateActionValue: function(character: Character | Vehicle, key: string, value: number | string): Character | Vehicle {
    return {
      ...character,
      action_values: {
        ...character.action_values,
        [key]: value
      }
    }
  },

  updateValue: function(character: Character | Vehicle, key: string, value: number | string): Character | Vehicle {
    return {
      ...character,
      [key]: value
    } as Character | Vehicle
  },

  seriousPoints: function(character: Character | Vehicle, value: number): boolean {
    if (this.isType(character, "Mook")) return false

    const type = this.type(character)
    const threshold = woundThresholds[type]

    return (value > threshold.serious)
  },
}

export default SharedService
