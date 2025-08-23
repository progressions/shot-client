import CS from "@/services/CharacterService"
import type { Character, Juncture, Faction, CharacterJson } from "@/types/types"
import { defaultCharacter, defaultJuncture, defaultFaction } from "@/types/types"
import { carolina } from "@/__tests__/factories/Characters"

describe("CharacterService Extended Tests", () => {
  describe("updateJuncture", () => {
    it("should update character with new juncture", () => {
      const juncture: Juncture = {
        id: "contemporary",
        name: "Contemporary",
        description: "Modern times",
        active: true,
        image_url: null
      }

      const result = CS.updateJuncture(carolina, juncture)
      
      expect(result.juncture_id).toBe("contemporary")
      expect(result.juncture).toBe(juncture)
    })

    it("should handle null juncture", () => {
      const result = CS.updateJuncture(carolina, null)
      
      expect(result.juncture_id).toBeNull()
      expect(result.juncture).toEqual(defaultJuncture)
    })
  })

  describe("updateFaction", () => {
    it("should update character with new faction", () => {
      const faction: Faction = {
        id: "ascended",
        name: "Ascended",
        description: "The supernatural conspiracy",
        active: true,
        characters: [],
        vehicles: [],
        image_url: null
      }

      const result = CS.updateFaction(carolina, faction)
      
      expect(result.faction_id).toBe("ascended")
      expect(result.faction).toBe(faction)
    })

    it("should handle null faction", () => {
      const result = CS.updateFaction(carolina, null)
      
      expect(result.faction_id).toBeNull()
      expect(result.faction).toEqual(defaultFaction)
    })
  })

  describe("characterFromJson", () => {
    it("should create character from complete JSON", () => {
      const json: CharacterJson = {
        name: "Test Character",
        type: "PC",
        description: "A test character",
        mainAttack: "Guns",
        attackValue: 12,
        defense: 11,
        toughness: 6,
        speed: 7,
        damage: 8,
        nicknames: "Testy",
        age: "25",
        height: "6'0\"",
        weight: "180 lbs",
        hairColor: "Brown",
        eyeColor: "Blue",
        styleOfDress: "Casual",
        appearance: "Tall and lean",
        melodramaticHook: "Seeks revenge",
        faction: "Heroes",
        juncture: "Contemporary",
        wealth: "Working Stiff"
      }

      const result = CS.characterFromJson(json)
      
      expect(result.name).toBe("Test Character")
      expect(result.action_values.Type).toBe("PC")
      expect(result.description.Background).toBe("A test character")
      expect(result.action_values.MainAttack).toBe("Guns")
      expect(result.action_values.Guns).toBe(12)
      expect(result.action_values.Defense).toBe(11)
      expect(result.action_values.Toughness).toBe(6)
      expect(result.action_values.Speed).toBe(7)
      expect(result.action_values.Damage).toBe(8)
      expect(result.description.Nicknames).toBe("Testy")
      expect(result.description.Age).toBe("25")
      expect(result.description.Height).toBe("6'0\"")
      expect(result.description.Weight).toBe("180 lbs")
      expect(result.description["Hair Color"]).toBe("Brown")
      expect(result.description["Eye Color"]).toBe("Blue")
      expect(result.description["Style of Dress"]).toBe("Casual")
      expect(result.description.Appearance).toBe("Tall and lean")
      expect(result.description["Melodramatic Hook"]).toBe("Seeks revenge")
      expect(result.wealth).toBe("Working Stiff")
    })

    it("should handle empty optional fields", () => {
      const json: CharacterJson = {
        name: "Minimal Character",
        type: "Featured Foe",
        description: "",
        mainAttack: "Martial Arts",
        attackValue: 10,
        defense: 10,
        toughness: 5,
        speed: 6,
        damage: 7,
        nicknames: "",
        age: "",
        height: "",
        weight: "",
        hairColor: "",
        eyeColor: "",
        styleOfDress: "",
        appearance: "",
        melodramaticHook: "",
        faction: "",
        juncture: "",
        wealth: "Poor"
      }

      const result = CS.characterFromJson(json)
      
      expect(result.name).toBe("Minimal Character")
      expect(result.action_values.Type).toBe("Featured Foe")
      expect(result.description.Background).toBe("")
      expect(result.description.Nicknames).toBe("")
      expect(result.description.Age).toBe("")
    })
  })

  describe("healWounds", () => {
    it("should reduce wounds and impairments", () => {
      const character: Character = {
        ...defaultCharacter,
        count: 30,
        impairments: 2,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "PC",
          Wounds: 30
        }
      }

      const result = CS.healWounds(character, 6)
      
      expect(result.action_values.Wounds).toBe(24) // 30 - 6
      expect(result.impairments).toBe(0) // Should remove impairments when healed below thresholds
    })

    it("should not heal more wounds than character has", () => {
      const character: Character = {
        ...defaultCharacter,
        action_values: {
          ...defaultCharacter.action_values,
          Type: "PC",
          Wounds: 5
        }
      }

      const result = CS.healWounds(character, 10)
      
      expect(result.action_values.Wounds).toBe(0) // Can't go below 0
    })
  })

  describe("chain", () => {
    it("should chain multiple operations", () => {
      const operations: Array<[keyof typeof CS, any[]]> = [
        ["updateActionValue", ["Toughness", 8]],
        ["updateWounds", [20]]
      ]

      const result = CS.chain(carolina, operations)
      
      expect(CS.toughness(result)).toBe(8)
      expect(CS.wounds(result)).toBe(20)
    })
  })

  describe("chainz", () => {
    it("should provide fluent chaining interface", () => {
      const result = CS.chainz(carolina)
        .updateActionValue("Toughness", 9)
        .updateWounds(25)
        .done()
      
      expect(CS.toughness(result)).toBe(9)
      expect(CS.wounds(result)).toBe(25)
    })
  })

  describe("skill", () => {
    it("should return character's skill value", () => {
      const result = CS.skill(carolina, "Guns")
      expect(result).toBe((carolina.skills && carolina.skills.Guns) || 7)
    })

    it("should return 7 for unknown skills", () => {
      const result = CS.skill(carolina, "NonExistentSkill")
      expect(result).toBe(7)
    })
  })
})