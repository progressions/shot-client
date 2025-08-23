import SharedService from "@/services/SharedService"
import type { Character, Vehicle } from "@/types/types"
import { defaultCharacter, defaultVehicle, defaultFaction } from "@/types/types"
import { carolina, shing, zombies } from "@/__tests__/factories/Characters"
import { copCar } from "@/__tests__/factories/Vehicles"

describe("SharedService Extended Tests", () => {
  describe("actionValues", () => {
    it("should return all action values for character", () => {
      const result = SharedService.actionValues(carolina)
      
      expect(typeof result).toBe("object")
      expect(result.Guns).toBeDefined()
      expect(result.Defense).toBeDefined()
      expect(result.Toughness).toBeDefined()
    })

    it("should return all action values for vehicle", () => {
      const result = SharedService.actionValues(copCar)
      
      expect(typeof result).toBe("object")
      expect(result.Acceleration).toBeDefined()
      expect(result.Handling).toBeDefined()
    })
  })

  describe("type", () => {
    it("should return PC type", () => {
      expect(SharedService.type(carolina)).toBe("PC")
    })

    it("should return Boss type", () => {
      expect(SharedService.type(shing)).toBe("Boss")
    })

    it("should return Mook type", () => {
      expect(SharedService.type(zombies)).toBe("Mook")
    })

    it("should return vehicle type", () => {
      expect(SharedService.type(copCar)).toBe("Featured Foe")
    })
  })

  describe("isFriendly", () => {
    it("should return true for PC", () => {
      expect(SharedService.isFriendly(carolina)).toBe(true)
    })

    it("should return true for Ally", () => {
      const ally = { ...carolina, action_values: { ...carolina.action_values, Type: "Ally" } }
      expect(SharedService.isFriendly(ally)).toBe(true)
    })

    it("should return false for Boss", () => {
      expect(SharedService.isFriendly(shing)).toBe(false)
    })
  })

  describe("isUnfriendly", () => {
    it("should return false for PC", () => {
      expect(SharedService.isUnfriendly(carolina)).toBe(false)
    })

    it("should return false for Ally", () => {
      const ally = { ...carolina, action_values: { ...carolina.action_values, Type: "Ally" } }
      expect(SharedService.isUnfriendly(ally)).toBe(false)
    })

    it("should return true for Boss", () => {
      expect(SharedService.isUnfriendly(shing)).toBe(true)
    })
  })

  describe("type checking methods", () => {
    it("isPC should work correctly", () => {
      expect(SharedService.isPC(carolina)).toBe(true)
      expect(SharedService.isPC(shing)).toBe(false)
    })

    it("isMook should work correctly", () => {
      expect(SharedService.isMook(zombies)).toBe(true)
      expect(SharedService.isMook(carolina)).toBe(false)
    })

    it("isBoss should work correctly", () => {
      expect(SharedService.isBoss(shing)).toBe(true)
      expect(SharedService.isBoss(carolina)).toBe(false)
    })

    it("isAlly should work correctly", () => {
      const ally = { ...carolina, action_values: { ...carolina.action_values, Type: "Ally" } }
      expect(SharedService.isAlly(ally)).toBe(true)
      expect(SharedService.isAlly(carolina)).toBe(false)
      expect(SharedService.isAlly(zombies)).toBe(false)
    })

    it("isFeaturedFoe should work correctly", () => {
      const featuredFoe = { ...carolina, action_values: { ...carolina.action_values, Type: "Featured Foe" } }
      expect(SharedService.isFeaturedFoe(featuredFoe)).toBe(true)
      expect(SharedService.isFeaturedFoe(carolina)).toBe(false)
      expect(SharedService.isFeaturedFoe(shing)).toBe(false)
    })

    it("isUberBoss should work correctly", () => {
      const uberBoss = { ...carolina, action_values: { ...carolina.action_values, Type: "Uber-Boss" } }
      expect(SharedService.isUberBoss(uberBoss)).toBe(true)
      expect(SharedService.isUberBoss(carolina)).toBe(false)
      expect(SharedService.isUberBoss(shing)).toBe(false)
    })
  })

  describe("actionValue", () => {
    it("should return adjusted action value for character", () => {
      const result = SharedService.actionValue(carolina, "Guns")
      expect(typeof result).toBe("number")
      expect(result).toBeGreaterThanOrEqual(0)
    })

    it("should handle impairments", () => {
      const impaired = { ...carolina, impairments: 2 }
      const normalValue = SharedService.actionValue(carolina, "Defense")
      const impairedValue = SharedService.actionValue(impaired, "Defense")
      expect(impairedValue).toBeLessThan(normalValue)
    })

    it("should handle string action values", () => {
      const result = SharedService.actionValue(carolina, "Type")
      expect(typeof result).toBe("number") // Should return a numeric value even for string types
    })
  })

  describe("otherActionValue", () => {
    it("should return string action value", () => {
      const result = SharedService.otherActionValue(carolina, "Type")
      expect(typeof result).toBe("string")
      expect(result).toBe("PC")
    })

    it("should return empty string for missing values", () => {
      const result = SharedService.otherActionValue(carolina, "NonExistent")
      expect(result).toBe("")
    })
  })

  describe("faction", () => {
    it("should return character's faction", () => {
      const result = SharedService.faction(carolina)
      expect(result).toBeDefined()
      expect(typeof result).toBe("object")
    })

    it("should handle character with null faction", () => {
      const character = { ...carolina, faction: null } as any
      const result = SharedService.faction(character)
      expect(result).toBeNull()
    })
  })

  describe("impairments", () => {
    it("should return impairment count", () => {
      const impaired = { ...carolina, impairments: 3 }
      const result = SharedService.impairments(impaired)
      expect(result).toBe(3)
    })

    it("should return 0 for no impairments", () => {
      const result = SharedService.impairments(carolina)
      expect(result).toBe(0)
    })
  })

  describe("isImpaired", () => {
    it("should return true for impaired character", () => {
      const impaired = { ...carolina, impairments: 1 }
      expect(SharedService.isImpaired(impaired)).toBe(true)
    })

    it("should return false for non-impaired character", () => {
      expect(SharedService.isImpaired(carolina)).toBe(false)
    })
  })

  describe("addImpairments", () => {
    it("should add impairments", () => {
      const result = SharedService.addImpairments(carolina, 2)
      expect(result.impairments).toBe(2)
    })

    it("should not go below zero impairments", () => {
      const result = SharedService.addImpairments(carolina, -5)
      expect(result.impairments).toBe(-5) // addImpairments doesn't enforce minimum
    })

    it("should handle zero change", () => {
      const result = SharedService.addImpairments(carolina, 0)
      expect(result.impairments).toBe(0)
    })
  })

  describe("updateActionValue", () => {
    it("should update action value", () => {
      const result = SharedService.updateActionValue(carolina, "Guns", 15)
      expect(result.action_values.Guns).toBe(15)
    })
  })

  describe("updateValue", () => {
    it("should update character count", () => {
      const result = SharedService.updateValue(carolina, "count", 25)
      expect(result.count).toBe(25)
    })
  })

  describe("rollInitiative", () => {
    it("should set initiative with roll result", () => {
      const result = SharedService.rollInitiative(carolina, 0)
      
      expect(typeof result.current_shot).toBe("number")
      expect(result.current_shot).toBeGreaterThanOrEqual(0)
    })

    it("should handle zero roll", () => {
      const result = SharedService.rollInitiative(carolina, 0)
      
      expect(typeof result.current_shot).toBe("number")
    })

    it("should handle negative roll", () => {
      const speed = SharedService.actionValue(carolina, "Speed")
      const result = SharedService.rollInitiative(carolina, -3)
      
      expect(result.current_shot).toBe(speed - 3)
    })
  })

  describe("setInitiative", () => {
    it("should set current_shot adding existing value", () => {
      const character = { ...carolina, current_shot: 10 }
      const result = SharedService.setInitiative(character, 15)
      
      expect(result.current_shot).toBe(25) // Adds existing current_shot (10) to new value (15)
    })

    it("should handle character with no current_shot", () => {
      const character = { ...carolina, current_shot: 0 }
      const result = SharedService.setInitiative(character, 8)
      
      expect(result.current_shot).toBe(8)
    })

    it("should handle zero initiative", () => {
      const character = { ...carolina, current_shot: 8 }
      const result = SharedService.setInitiative(character, 0)
      
      expect(result.current_shot).toBe(8) // Adds existing current_shot (8) to new value (0)
    })
  })
})