import type { SkillValue, Character, CharacterEffect } from "../types/types"
import SharedService, { woundThresholds } from "./SharedService"
import { rollDie } from "../components/dice/DiceRoller"

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

  // Adjusted for Impairment
  mainAttackValue: function(character: Character): number {
    return this.actionValue(character, this.mainAttack(character))
  },

  secondaryAttack: function(character: Character): string {
    return this.otherActionValue(character, "SecondaryAttack")
  },

  // Adjusted for Impairment
  secondaryAttackValue: function(character: Character): number {
    return this.actionValue(character, this.secondaryAttack(character))
  },

  attackValues: function(character: Character): string[] {
    return [
      this.mainAttack(character),
      this.secondaryAttack(character),
    ].filter((key) => this.actionValue(character, key) > 0)
  },

  damage: function(character: Character): number {
    return this.rawActionValue(character, "Damage")
  },

  fortuneType: function(character: Character): string {
    return character.action_values["FortuneType"] as string || "Fortune"
  },

  maxFortuneLabel: function(character: Character): string {
    const fortuneType = this.fortuneType(character)
    return `Max ${fortuneType}`
  },

  // Not modified by Impairment
  maxFortune: function(character: Character): number {
    return this.rawActionValue(character, "Max Fortune")
  },

  archetype: function(character: Character): string {
    return this.otherActionValue(character, "Archetype")
  },

  // Not modified by Impairment
  speed: function(character: Character): number {
    return this.rawActionValue(character, "Speed")
  },

  // Not modified by Impairment
  toughness: function(character: Character): number {
    return this.rawActionValue(character, "Toughness")
  },

  // Modified by Impairment
  defense: function(character: Character): number {
    return this.actionValue(character, "Defense")
  },

  marksOfDeath: function(character: Character): number {
    return character.action_values["Marks of Death"] as number || 0
  },

  calculateWounds: function(character: Character, smackdown: number): number {
    const toughness = this.toughness(character)
    const wounds = Math.max(0, smackdown - toughness)

    return wounds
  },

  // Take a Smackdown, reduced by Toughness
  takeSmackdown: function(character: Character, smackdown: number): Character {
    if (this.isType(character, "Mook")) {
      return this.killMooks(character, smackdown)
    }

    const wounds = this.calculateWounds(character, smackdown)
    const originalWounds = this.wounds(character)
    const impairments = this.calculateImpairments(character, originalWounds, originalWounds + wounds)
    const updatedCharacter = this.addImpairments(character, impairments)
    return this.takeRawWounds(updatedCharacter, wounds)
  },

  // Take raw Wounds, ignoring Toughness
  takeRawWounds: function(character: Character, wounds: number): Character {
    const originalWounds = this.wounds(character)
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
    return Object
    .entries(character.skills)
    .filter(([name, value]: SkillValue) => (value as number > 0))
    .map(([name, _value]: SkillValue) => ([name, this.skill(character, name)]))
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

  // Restore Wounds to 0, Fortune to Max Fortune, Impairments to 0, Marks of Death to 0
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
      return this.mooks(character)
    }
    return Math.max(0, character.action_values["Wounds"] as number || 0)
  },

  seriousWounds: function(character: Character): boolean {
    return this.seriousPoints(character, this.wounds(character))
  },

}

export default CharacterService
