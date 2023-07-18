import type { SkillValue, Character, CharacterEffect } from "../types/types"
import SharedService, { woundThresholds } from "./SharedService"

const CharacterService = {
  ...SharedService,

  // Adjusted for Impairment
  skill: function(character: Character, key: string): number {
    const value = character.skills[key] as number || 7
    return Math.max(0, value - this.impairments(character))
  },

  mainAttack: function(character: Character): string {
    return this.otherActionValue(character, "MainAttack")
  },

  mainAttackValue: function(character: Character): number {
    return this.actionValue(character, this.mainAttack(character))
  },

  fortuneType: function(character: Character): string {
    return character.action_values["FortuneType"] as string || "Fortune"
  },

  maxFortuneLabel: function(character: Character): string {
    const fortuneType = this.fortuneType(character)
    return `Max ${fortuneType}`
  },

  maxFortune: function(character: Character): number {
    return this.rawActionValue(character, "Max Fortune")
  },

  marksOfDeath: function(character: Character): number {
    return character.action_values["Marks of Death"] as number || 0
  },

  toughness: function(character: Character): number {
    return this.rawActionValue(character, "Toughness")
  },

  calculateWounds: function(character: Character, smackdown: number): number {
    const toughness = this.toughness(character)
    const wounds = Math.max(0, smackdown - toughness)

    return wounds
  },

  // Take a Smackdown, reduced by Toughness
  takeSmackdown: function(character: Character, smackdown: number): Character {
    const wounds = this.calculateWounds(character, smackdown)
    const originalWounds = this.rawActionValue(character, "Wounds")
    const impairments = this.calculateImpairments(character, originalWounds, originalWounds + wounds)
    const updatedCharacter = this.addImpairments(character, impairments)
    return this.takeWounds(updatedCharacter, wounds)
  },

  takeWounds: function(character: Character, wounds: number): Character {
    const originalWounds = this.rawActionValue(character, "Wounds")
    return this.updateActionValue(character, "Wounds", Math.max(0, originalWounds + wounds))
  },

  healWounds: function(character: Character, wounds: number): Character {
    const originalWounds = this.wounds(character)
    const impairments = this.calculateImpairments(character, originalWounds - wounds, originalWounds)
    let updatedCharacter = this.addImpairments(character, -impairments)
    return this.updateActionValue(updatedCharacter, "Wounds", Math.max(0, originalWounds - wounds))
  },

  addDeathMarks: function(character: Character, value: number): Character {
    const deathMarks = character.action_values["Marks of Death"] as number || 0
    return this.updateActionValue(character, "Marks of Death", Math.max(0, deathMarks + value))
  },

  knownSkills: function(character: Character): SkillValue[] {
    return Object.entries(character.skills).filter(([name, value]: SkillValue) => (value as number > 0))
  },

  updateSkill: function(character: Character, key: string, value: number): Character {
    return {
      ...character,
      skills: {
        ...character.skills,
        [key]: value
      }
    } as Character
  },

  fullHeal: function(character: Character): Character {
    if (this.isType(character, "Mook")) return character

    const maxFortune = this.actionValue(character, "Max Fortune")
    let updatedCharacter = this.updateActionValue(character, "Wounds", 0)
    updatedCharacter = this.updateActionValue(updatedCharacter, "Marks of Death", 0)
    updatedCharacter = this.updateActionValue(updatedCharacter, "Fortune", maxFortune)
    updatedCharacter.impairments = 0

    return updatedCharacter
  },

  wounds: function(character: Character): number {
    if (this.isType(character, "Mook")) {
      return character.count || 0
    }
    return character.action_values["Wounds"] as number || 0
  },

  seriousWounds: function(character: Character): boolean {
    if (this.isType(character, ["Boss", "Uber-Boss"]) && this.wounds(character) > 50) {
      return true
    }
    if (!this.isType(character, "Mook") && this.wounds(character) > 35) {
      return true
    }
    return false
  },

}

export default CharacterService
