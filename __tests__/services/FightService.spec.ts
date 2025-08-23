import FightService from "@/services/FightService"
import { Fight, Character, Vehicle, User, CharacterEffect, ShotType } from "@/types/types"
import { defaultFight, defaultCharacter, defaultVehicle, defaultUser } from "@/types/types"
import { carolina, brick, shing } from "@/__tests__/factories/Characters"
import { copCar, motorcycles } from "@/__tests__/factories/Vehicles"

describe("FightService", () => {
  describe("currentShot", () => {
    it("should return 0 for empty fight", () => {
      expect(FightService.currentShot(defaultFight)).toBe(0)
    })

    it("should return 0 for fight without shot_order", () => {
      const fight = { ...defaultFight, shot_order: undefined as any }
      expect(FightService.currentShot(fight)).toBe(0)
    })

    it("should return 0 for fight with empty shot_order", () => {
      const fight = { ...defaultFight, shot_order: [] }
      expect(FightService.currentShot(fight)).toBe(0)
    })

    it("should return current shot number from first shot order entry", () => {
      const fight: Fight = {
        ...defaultFight,
        shot_order: [
          [15, [carolina, brick]],
          [12, [shing]],
          [8, [copCar]]
        ] as ShotType[]
      }
      expect(FightService.currentShot(fight)).toBe(15)
    })

    it("should handle shot_order with undefined shot number", () => {
      const fight: Fight = {
        ...defaultFight,
        shot_order: [
          [undefined as any, [carolina]],
          [12, [brick]]
        ] as ShotType[]
      }
      expect(FightService.currentShot(fight)).toBe(0)
    })
  })

  describe("users", () => {
    it("should return empty array for fight without required properties", () => {
      expect(FightService.users(defaultFight)).toEqual([])
    })

    it("should return empty array for fight without gamemaster", () => {
      const fight = {
        ...defaultFight,
        id: "fight-123",
        shot_order: [[15, [carolina]]] as ShotType[]
      }
      expect(FightService.users(fight)).toEqual([])
    })

    it("should return only gamemaster if no player characters", () => {
      const gamemaster = { ...defaultUser, id: "gm-123", name: "GM" }
      const npcCharacter = { ...carolina, type: "npc" as const, user: undefined }
      
      const fight: Fight = {
        ...defaultFight,
        id: "fight-123",
        gamemaster,
        shot_order: [[15, [npcCharacter]]] as ShotType[]
      }
      
      expect(FightService.users(fight)).toEqual([gamemaster])
    })

    it("should return gamemaster plus unique PC users", () => {
      const gamemaster = { ...defaultUser, id: "gm-123", name: "GM" }
      const user1 = { ...defaultUser, id: "user-1", name: "Player 1" }
      const user2 = { ...defaultUser, id: "user-2", name: "Player 2" }
      
      const pc1 = { ...carolina, type: "pc" as const, user: user1 }
      const pc2 = { ...brick, type: "pc" as const, user: user2 }
      const pc3 = { ...shing, type: "pc" as const, user: user1 } // Same user as pc1
      const npc = { ...defaultCharacter, type: "npc" as const, user: undefined }

      const fight: Fight = {
        ...defaultFight,
        id: "fight-123",
        gamemaster,
        shot_order: [
          [15, [pc1, pc2]],
          [12, [pc3, npc]]
        ] as ShotType[]
      }

      const result = FightService.users(fight)
      expect(result).toHaveLength(3) // GM + 2 unique players
      expect(result).toContain(gamemaster)
      expect(result).toContain(user1)
      expect(result).toContain(user2)
    })

    it("should handle PC without user", () => {
      const gamemaster = { ...defaultUser, id: "gm-123", name: "GM" }
      const pcWithoutUser = { ...carolina, type: "pc" as const, user: undefined }
      
      const fight: Fight = {
        ...defaultFight,
        id: "fight-123",
        gamemaster,
        shot_order: [[15, [pcWithoutUser]]] as ShotType[]
      }
      
      expect(FightService.users(fight)).toEqual([gamemaster])
    })
  })

  describe("firstUp", () => {
    it("should return undefined for empty fight", () => {
      expect(FightService.firstUp(defaultFight)).toBeUndefined()
    })

    it("should return first character in first shot", () => {
      const fight: Fight = {
        ...defaultFight,
        shot_order: [
          [15, [carolina, brick]],
          [12, [shing]]
        ] as ShotType[]
      }
      
      expect(FightService.firstUp(fight)).toEqual(carolina)
    })

    it("should return first vehicle in first shot", () => {
      const fight: Fight = {
        ...defaultFight,
        shot_order: [
          [18, [copCar, motorcycles]],
          [15, [carolina]]
        ] as ShotType[]
      }
      
      expect(FightService.firstUp(fight)).toEqual(copCar)
    })

    it("should handle empty shot order arrays", () => {
      const fight: Fight = {
        ...defaultFight,
        shot_order: [
          [15, []],
          [12, [carolina]]
        ] as ShotType[]
      }
      
      expect(FightService.firstUp(fight)).toBeUndefined()
    })
  })

  describe("playerCharactersForInitiative", () => {
    it("should return empty array for fight without shot_order", () => {
      expect(FightService.playerCharactersForInitiative(defaultFight)).toEqual([])
    })

    it("should return PC characters with shot <= 0 that are not hidden", () => {
      const pc1 = { ...carolina, type: "pc" as const, current_shot: 0 }
      const pc2 = { ...brick, type: "pc" as const, current_shot: -1 }
      const pc3 = { ...shing, type: "pc" as const, current_shot: 15 } // Has shot > 0
      const hiddenPC = { ...defaultCharacter, type: "pc" as const, current_shot: 0, active: false } // Hidden
      const npc = { ...defaultCharacter, type: "npc" as const, current_shot: 0 }

      const fight: Fight = {
        ...defaultFight,
        shot_order: [
          [0, [pc1, pc2]],
          [0, [pc3, hiddenPC, npc]]
        ] as ShotType[]
      }

      const result = FightService.playerCharactersForInitiative(fight)
      expect(result).toHaveLength(2)
      expect(result).toContain(pc1)
      expect(result).toContain(pc2)
      expect(result).not.toContain(pc3)
      expect(result).not.toContain(hiddenPC)
      expect(result).not.toContain(npc)
    })
  })

  describe("playerCharacters", () => {
    it("should return empty array for fight without shot_order", () => {
      expect(FightService.playerCharacters(defaultFight)).toEqual([])
    })

    it("should return all PC characters with current_shot set", () => {
      const pc1 = { ...carolina, type: "pc" as const }
      const pc2 = { ...brick, type: "pc" as const }
      const npc = { ...shing, type: "npc" as const }
      const vehicle = { ...copCar }

      const fight: Fight = {
        ...defaultFight,
        shot_order: [
          [15, [pc1, npc]],
          [12, [pc2, vehicle]]
        ] as ShotType[]
      }

      const result = FightService.playerCharacters(fight)
      expect(result).toHaveLength(2)
      
      // Check that current_shot is set correctly
      const returnedPC1 = result.find(c => c.id === pc1.id)
      const returnedPC2 = result.find(c => c.id === pc2.id)
      
      expect(returnedPC1?.current_shot).toBe(15)
      expect(returnedPC2?.current_shot).toBe(12)
    })

    it("should handle malformed shot_order gracefully", () => {
      const fight: Fight = {
        ...defaultFight,
        shot_order: null as any
      }
      
      expect(FightService.playerCharacters(fight)).toEqual([])
    })
  })

  describe("charactersInFight", () => {
    it("should return empty array for fight without shot_order", () => {
      expect(FightService.charactersInFight(defaultFight)).toEqual([])
    })

    it("should return all characters (PC and NPC) in fight", () => {
      const pc = { ...carolina, type: "pc" as const }
      const npc = { ...brick, type: "npc" as const }
      const boss = { ...shing, type: "boss" as const }
      const vehicle = { ...copCar }

      const fight: Fight = {
        ...defaultFight,
        shot_order: [
          [15, [pc, vehicle]],
          [12, [npc, boss]]
        ] as ShotType[]
      }

      const result = FightService.charactersInFight(fight)
      expect(result).toHaveLength(3)
      expect(result).toContain(pc)
      expect(result).toContain(npc)
      expect(result).toContain(boss)
      expect(result).not.toContain(vehicle)
    })
  })

  describe("vehiclesInFight", () => {
    it("should return empty array for fight without shot_order", () => {
      expect(FightService.vehiclesInFight(defaultFight)).toEqual([])
    })

    it("should return all vehicles in fight", () => {
      const character = { ...carolina }
      const vehicle1 = { ...copCar }
      const vehicle2 = { ...motorcycles }

      const fight: Fight = {
        ...defaultFight,
        shot_order: [
          [18, [vehicle1, character]],
          [15, [vehicle2]]
        ] as ShotType[]
      }

      const result = FightService.vehiclesInFight(fight)
      expect(result).toHaveLength(2)
      expect(result).toContain(vehicle1)
      expect(result).toContain(vehicle2)
      expect(result).not.toContain(character)
    })
  })

  describe("startOfSequence", () => {
    it("should return true for empty fight", () => {
      expect(FightService.startOfSequence(defaultFight)).toBe(true)
    })

    it("should return true when current shot is 0", () => {
      const fight: Fight = {
        ...defaultFight,
        shot_order: [[0, [carolina]]] as ShotType[]
      }
      
      expect(FightService.startOfSequence(fight)).toBe(true)
    })

    it("should return false when current shot is greater than 0", () => {
      const fight: Fight = {
        ...defaultFight,
        shot_order: [[15, [carolina]]] as ShotType[]
      }
      
      expect(FightService.startOfSequence(fight)).toBe(false)
    })

    it("should handle undefined shot number as 0", () => {
      const fight: Fight = {
        ...defaultFight,
        shot_order: [[undefined as any, [carolina]]] as ShotType[]
      }
      
      expect(FightService.startOfSequence(fight)).toBe(true)
    })
  })

  describe("characterEffects", () => {
    it("should return empty array when no character_effects", () => {
      const fight = { ...defaultFight }
      const character = { ...carolina, shot_id: "shot-123" }
      
      expect(FightService.characterEffects(fight, character)).toEqual([])
    })

    it("should return empty array when character has no effects", () => {
      const fight: Fight = {
        ...defaultFight,
        character_effects: {
          "other-shot": [{ id: "effect-1", name: "Some Effect" } as CharacterEffect]
        }
      }
      const character = { ...carolina, shot_id: "shot-123" }
      
      expect(FightService.characterEffects(fight, character)).toEqual([])
    })

    it("should return character effects for the character's shot_id", () => {
      const effect1: CharacterEffect = { id: "effect-1", name: "Stunned" } as CharacterEffect
      const effect2: CharacterEffect = { id: "effect-2", name: "Wounded" } as CharacterEffect
      
      const fight: Fight = {
        ...defaultFight,
        character_effects: {
          "shot-123": [effect1, effect2],
          "other-shot": [{ id: "effect-3", name: "Other Effect" } as CharacterEffect]
        }
      }
      const character = { ...carolina, shot_id: "shot-123" }
      
      const result = FightService.characterEffects(fight, character)
      expect(result).toHaveLength(2)
      expect(result).toContain(effect1)
      expect(result).toContain(effect2)
    })

    it("should handle character without shot_id", () => {
      const fight: Fight = {
        ...defaultFight,
        character_effects: {
          "shot-123": [{ id: "effect-1", name: "Effect" } as CharacterEffect]
        }
      }
      const character = { ...carolina, shot_id: "missing-shot" as any }
      
      expect(FightService.characterEffects(fight, character)).toEqual([])
    })
  })
})