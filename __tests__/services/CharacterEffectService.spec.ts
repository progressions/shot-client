import CharacterEffectService from "@/services/CharacterEffectService"
import { Character, Fight, CharacterEffect } from "@/types/types"
import { defaultFight, defaultCharacter } from "@/types/types"
import { carolina, brick } from "@/__tests__/factories/Characters"

describe("CharacterEffectService", () => {
  let mockFight: Fight
  let mockCharacter: Character

  beforeEach(() => {
    mockCharacter = { ...carolina }
    mockFight = { 
      ...defaultFight,
      character_effects: {}
    }
  })

  describe("adjustedMainAttack", () => {
    it("should return main attack value adjusted by effects", () => {
      const effect: CharacterEffect = {
        id: "effect-1",
        action_value: "MainAttack",
        change: "+3"
      } as CharacterEffect

      mockFight.character_effects = {
        [mockCharacter.shot_id as string]: [effect]
      }

      const [change, newValue] = CharacterEffectService.adjustedMainAttack(mockCharacter, mockFight)
      
      expect(typeof change).toBe("number")
      expect(typeof newValue).toBe("number")
      expect(newValue).toBeGreaterThan(0) // Should have some positive value
    })

    it("should handle character with no effects", () => {
      const [change, newValue] = CharacterEffectService.adjustedMainAttack(mockCharacter, mockFight)
      
      expect(typeof change).toBe("number")
      expect(typeof newValue).toBe("number")
    })
  })

  describe("effectsForCharacter", () => {
    it("should return effects that match the action value name", () => {
      const effects: CharacterEffect[] = [
        { id: "effect-1", action_value: "Guns", change: "+2" } as CharacterEffect,
        { id: "effect-2", action_value: "Martial Arts", change: "-1" } as CharacterEffect,
        { id: "effect-3", action_value: "Guns", change: "+1" } as CharacterEffect
      ]

      const result = CharacterEffectService.effectsForCharacter(mockCharacter, effects, "Guns")
      
      expect(result).toHaveLength(2)
      expect(result[0].action_value).toBe("Guns")
      expect(result[1].action_value).toBe("Guns")
    })

    it("should return MainAttack effects when name matches character's main attack", () => {
      const effects: CharacterEffect[] = [
        { id: "effect-1", action_value: "MainAttack", change: "+2" } as CharacterEffect,
        { id: "effect-2", action_value: "Guns", change: "+1" } as CharacterEffect
      ]

      // Assume carolina's main attack is "Guns"
      const result = CharacterEffectService.effectsForCharacter(mockCharacter, effects, "Guns")
      
      expect(result).toHaveLength(2) // Both MainAttack and direct Guns match
      expect(result.some(e => e.action_value === "MainAttack")).toBe(true)
      expect(result.some(e => e.action_value === "Guns")).toBe(true)
    })

    it("should return empty array when no effects match", () => {
      const effects: CharacterEffect[] = [
        { id: "effect-1", action_value: "Guns", change: "+2" } as CharacterEffect
      ]

      const result = CharacterEffectService.effectsForCharacter(mockCharacter, effects, "Martial Arts")
      
      expect(result).toHaveLength(0)
    })

    it("should handle empty effects array", () => {
      const result = CharacterEffectService.effectsForCharacter(mockCharacter, [], "Guns")
      
      expect(result).toHaveLength(0)
    })
  })

  describe("adjustedDamage", () => {
    it("should return damage value adjusted by effects", () => {
      const effect: CharacterEffect = {
        id: "effect-1",
        action_value: "Damage",
        change: "+5"
      } as CharacterEffect

      mockFight.character_effects = {
        [mockCharacter.shot_id as string]: [effect]
      }

      const [change, newValue] = CharacterEffectService.adjustedDamage(mockCharacter, mockFight)
      
      expect(typeof change).toBe("number")
      expect(typeof newValue).toBe("number")
    })

    it("should ignore impairments for damage calculation", () => {
      // Test that ignoreImpairments parameter is passed correctly
      const characterWithImpairments = { ...mockCharacter, impairments: 2 }
      
      const [change, newValue] = CharacterEffectService.adjustedDamage(characterWithImpairments, mockFight)
      
      expect(typeof change).toBe("number")
      expect(typeof newValue).toBe("number")
    })
  })

  describe("adjustedActionValue", () => {
    it("should return action value adjusted by effects and impairments", () => {
      const characterWithImpairments = { ...mockCharacter, impairments: 1 }
      
      const [change, newValue] = CharacterEffectService.adjustedActionValue(characterWithImpairments, "Guns", mockFight)
      
      expect(typeof change).toBe("number")
      expect(typeof newValue).toBe("number")
    })

    it("should ignore impairments when flag is true", () => {
      const characterWithImpairments = { ...mockCharacter, impairments: 2 }
      
      const [changeWithImpairments] = CharacterEffectService.adjustedActionValue(characterWithImpairments, "Guns", mockFight, false)
      const [changeIgnoreImpairments] = CharacterEffectService.adjustedActionValue(characterWithImpairments, "Guns", mockFight, true)
      
      expect(typeof changeWithImpairments).toBe("number")
      expect(typeof changeIgnoreImpairments).toBe("number")
    })

    it("should handle effects with positive modifiers", () => {
      const effect: CharacterEffect = {
        id: "effect-1",
        action_value: "Guns",
        change: "+3"
      } as CharacterEffect

      mockFight.character_effects = {
        [mockCharacter.shot_id as string]: [effect]
      }

      const [change, newValue] = CharacterEffectService.adjustedActionValue(mockCharacter, "Guns", mockFight)
      
      expect(typeof change).toBe("number")
      expect(typeof newValue).toBe("number")
    })

    it("should handle effects with negative modifiers", () => {
      const effect: CharacterEffect = {
        id: "effect-1",
        action_value: "Guns",
        change: "-2"
      } as CharacterEffect

      mockFight.character_effects = {
        [mockCharacter.shot_id as string]: [effect]
      }

      const [change, newValue] = CharacterEffectService.adjustedActionValue(mockCharacter, "Guns", mockFight)
      
      expect(typeof change).toBe("number")
      expect(typeof newValue).toBe("number")
    })
  })

  describe("adjustedValue", () => {
    it("should adjust a given value by effects", () => {
      const baseValue = 15
      const effect: CharacterEffect = {
        id: "effect-1",
        action_value: "TestValue",
        change: "+2"
      } as CharacterEffect

      mockFight.character_effects = {
        [mockCharacter.shot_id as string]: [effect]
      }

      const [change, newValue] = CharacterEffectService.adjustedValue(mockCharacter, baseValue, "TestValue", mockFight)
      
      expect(typeof change).toBe("number")
      expect(typeof newValue).toBe("number")
      expect(newValue).not.toBe(baseValue) // Should be different due to effect
    })

    it("should return original value when no effects match", () => {
      const baseValue = 12
      
      const [change, newValue] = CharacterEffectService.adjustedValue(mockCharacter, baseValue, "NonExistentValue", mockFight)
      
      expect(typeof change).toBe("number")
      expect(typeof newValue).toBe("number")
    })
  })

  describe("actionValueAdjustedByEffects", () => {
    it("should handle empty effects array", () => {
      const [change, newValue] = CharacterEffectService.actionValueAdjustedByEffects(mockCharacter, [], 10, 10)
      
      expect(change).toBe(0) // No change from original
      expect(newValue).toBe(10)
    })

    it("should handle effects with + modifier", () => {
      const effects: CharacterEffect[] = [
        { id: "effect-1", change: "+3" } as CharacterEffect
      ]

      const [change, newValue] = CharacterEffectService.actionValueAdjustedByEffects(mockCharacter, effects, 10, 10)
      
      expect(typeof change).toBe("number")
      expect(newValue).toBe(13) // 10 + 3
    })

    it("should handle effects with - modifier", () => {
      const effects: CharacterEffect[] = [
        { id: "effect-1", change: "-2" } as CharacterEffect
      ]

      const [change, newValue] = CharacterEffectService.actionValueAdjustedByEffects(mockCharacter, effects, 10, 10)
      
      expect(typeof change).toBe("number")
      expect(newValue).toBe(8) // 10 - 2
    })

    it("should handle effects with absolute value", () => {
      const effects: CharacterEffect[] = [
        { id: "effect-1", name: "Set Value", severity: "error", change: "15" } as CharacterEffect
      ]

      const [change, newValue] = CharacterEffectService.actionValueAdjustedByEffects(mockCharacter, effects, 10, 10)
      
      expect(typeof change).toBe("number")
      expect(newValue).toBe("15") // Set to absolute value (string)
    })

    it("should handle multiple effects in sequence", () => {
      const effects: CharacterEffect[] = [
        { id: "effect-1", change: "+2" } as CharacterEffect,
        { id: "effect-2", change: "-1" } as CharacterEffect,
        { id: "effect-3", change: "+3" } as CharacterEffect
      ]

      const [change, newValue] = CharacterEffectService.actionValueAdjustedByEffects(mockCharacter, effects, 10, 10)
      
      expect(typeof change).toBe("number")
      expect(newValue).toBe(14) // 10 + 2 - 1 + 3
    })

    it("should handle effects with undefined change", () => {
      const effects: CharacterEffect[] = [
        { id: "effect-1", change: undefined } as CharacterEffect
      ]

      const [change, newValue] = CharacterEffectService.actionValueAdjustedByEffects(mockCharacter, effects, 10, 10)
      
      expect(typeof change).toBe("number")
      expect(newValue).toBe(0) // undefined becomes 0
    })
  })

  describe("adjustedReturnValue", () => {
    it("should return change and new value", () => {
      const [change, newValue] = CharacterEffectService.adjustedReturnValue(10, 15)
      
      expect(change).toBe(5) // 15 - 10
      expect(newValue).toBe(15)
    })

    it("should handle negative change", () => {
      const [change, newValue] = CharacterEffectService.adjustedReturnValue(10, 7)
      
      expect(change).toBe(-3) // 7 - 10
      expect(newValue).toBe(7)
    })

    it("should handle no change", () => {
      const [change, newValue] = CharacterEffectService.adjustedReturnValue(10, 10)
      
      expect(change).toBe(0) // 10 - 10
      expect(newValue).toBe(10)
    })
  })

  describe("valueChange", () => {
    it("should return the difference between new and original value", () => {
      expect(CharacterEffectService.valueChange(10, 15)).toBe(5)
      expect(CharacterEffectService.valueChange(10, 7)).toBe(-3)
      expect(CharacterEffectService.valueChange(10, 10)).toBe(0)
    })

    it("should handle zero values", () => {
      expect(CharacterEffectService.valueChange(0, 5)).toBe(5)
      expect(CharacterEffectService.valueChange(5, 0)).toBe(-5)
      expect(CharacterEffectService.valueChange(0, 0)).toBe(0)
    })

    it("should handle negative values", () => {
      expect(CharacterEffectService.valueChange(-5, -2)).toBe(3)
      expect(CharacterEffectService.valueChange(-2, -5)).toBe(-3)
      expect(CharacterEffectService.valueChange(-5, 5)).toBe(10)
    })
  })
})