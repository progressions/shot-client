import type { Weapon, SkillValue, Character, CharacterEffect } from "@/types/types"
import { DescriptionValues, DescriptionKeys } from "@/types/types"
import SharedService, { woundThresholds } from "@/services/SharedService"

interface Service {
  [key: string]: (character: Character, ...args: any[]) => Character
}

const CharacterService = {
  ...SharedService,

  chain: function(character: Character, calls: Array<[string, any[]]>): Character {
    let char = character
    for (const [funcName, args] of calls) {
      const unknownService = this as unknown
      const service = unknownService as Service

      char = service[funcName](char, ...args);
    }
    return char
  },

  chainz: function(character: Character): ServiceChain {
    return new ServiceChain(character)
  },

  /* Writer functions, change the state */

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
    return this.updateWounds(character, Math.max(0, originalWounds + wounds))
  },

  healWounds: function(character: Character, wounds: number): Character {
    const originalWounds = this.wounds(character)
    const impairments = this.calculateImpairments(character, originalWounds - wounds, originalWounds)
    let updatedCharacter = this.addImpairments(character, -impairments)
    return this.updateWounds(updatedCharacter, Math.max(0, originalWounds - wounds))
  },

  addDeathMarks: function(character: Character, value: number): Character {
    const deathMarks = character.action_values["Marks of Death"] as number || 0
    return this.updateActionValue(character, "Marks of Death", Math.max(0, deathMarks + value))
  },

  updateWounds: function(character: Character, wounds: number): Character {
    const updatedCharacter = this.updateValue(character, "count", Math.max(0, wounds))
    return this.updateActionValue(updatedCharacter, "Wounds", Math.max(0, wounds))
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

    const maxFortune = this.maxFortune(character)
    let updatedCharacter = this.updateWounds(character, 0)
    updatedCharacter = this.updateActionValue(updatedCharacter, "Marks of Death", 0)
    updatedCharacter = this.updateActionValue(updatedCharacter, "Fortune", maxFortune)
    updatedCharacter.impairments = 0

    return updatedCharacter
  },

  /* Reader functions, don't change the state, just return values */

  // Adjusted for Impairment
  skill: function(character: Character, key: string): number {
    return (character.skills && character.skills[key] as number) || 7
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

  fortune: function(character: Character): number {
    return this.rawActionValue(character, this.fortuneType(character))
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

  knownSkills: function(character: Character): SkillValue[] {
    return Object
    .entries(character.skills)
    .filter(([name, value]: SkillValue) => (value as number > 0))
    .map(([name, _value]: SkillValue) => ([name, this.skill(character, name)]))
  },

  wounds: function(character: Character): number {
    if (this.isType(character, "PC")) {
      return this.rawActionValue(character, "Wounds")
    }
    return Math.max(0, character.count || 0)
  },

  seriousWounds: function(character: Character): boolean {
    return this.seriousPoints(character, this.wounds(character))
  },

  weapons: function(character: Character): Weapon[] {
    if (character.weapons && character.weapons.length) {
      return character.weapons
    }
    return []
  },

  description: function(character: Character, key: keyof DescriptionValues): string {
    return character.description[key] as string || ""
  }

}

class ServiceChain {
  character: Character

  constructor(character: Character) {
    this.character = character
  }

  updateActionValue(key: string, value: number): ServiceChain {
    this.character = CharacterService.updateActionValue(this.character as Character, key, value)
    return this
  }

  updateWounds(value: number): ServiceChain {
    this.character = CharacterService.updateWounds(this.character as Character, value)
    return this
  }

  done: () => Character = () => this.character
}

export default CharacterService
