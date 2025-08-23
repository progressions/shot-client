import PartyService from "../../services/PartyService"
import { Party, Character, Vehicle } from "../../types/types"

describe("PartyService", () => {
  describe("nameBadge", () => {
    it("should return name with roster summary for party with characters and vehicles", () => {
      const party = {
        id: "party-1",
        name: "Test Party",
        secret: true,
        image_url: null,
        characters: [
          { id: "char-1", name: "Character 1" } as Character,
          { id: "char-2", name: "Character 2" } as Character
        ],
        vehicles: [
          { id: "vehicle-1", name: "Vehicle 1" } as Vehicle
        ]
      } as Party

      const result = PartyService.nameBadge(party)

      expect(result).toBe("Test Party (2 characters, 1 vehicles)")
    })

    it("should return name with empty string for empty party", () => {
      const party = {
        id: "party-1",
        name: "Empty Party",
        characters: [],
        vehicles: [],
        secret: true,
        image_url: null
      } as Party

      const result = PartyService.nameBadge(party)

      expect(result).toBe("Empty Party ")
    })

    it("should handle null/undefined party", () => {
      const result = PartyService.nameBadge(null as any)

      expect(result).toBe("undefined ")
    })

    it("should return name with roster summary for party with undefined characters/vehicles", () => {
      const party = {
        id: "party-1",
        name: "Undefined Party",
        secret: true,
        image_url: null
      } as Party

      const result = PartyService.nameBadge(party)

      expect(result).toBe("Undefined Party ")
    })
  })

  describe("rosterSummary", () => {
    it("should return empty string when no characters or vehicles", () => {
      const party = {
        characters: [],
        vehicles: [],
        name: 'Test',
        secret: true,
        image_url: null
      } as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("")
    })

    it("should return characters only when no vehicles", () => {
      const party = {
        characters: [
          { id: "char-1", name: "Character 1" } as Character,
          { id: "char-2", name: "Character 2" } as Character,
          { id: "char-3", name: "Character 3" } as Character
        ],
        vehicles: [],
        name: 'Test',
        secret: true,
        image_url: null
      } as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("(3 characters)")
    })

    it("should return vehicles only when no characters", () => {
      const party = {
        characters: [],
        vehicles: [
          { id: "vehicle-1", name: "Vehicle 1" } as Vehicle,
          { id: "vehicle-2", name: "Vehicle 2" } as Vehicle
        ],
        name: 'Test',
        secret: true,
        image_url: null
      } as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("(2 vehicles)")
    })

    it("should return both characters and vehicles when both present", () => {
      const party = {
        characters: [
          { id: "char-1", name: "Character 1" } as Character
        ],
        vehicles: [
          { id: "vehicle-1", name: "Vehicle 1" } as Vehicle,
          { id: "vehicle-2", name: "Vehicle 2" } as Vehicle
        ],
        name: 'Test',
        secret: true,
        image_url: null
      } as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("(1 characters, 2 vehicles)")
    })

    it("should handle null/undefined party", () => {
      const result = PartyService.rosterSummary(null as any)

      expect(result).toBe("")
    })

    it("should handle party with undefined characters array", () => {
      const party = {
        vehicles: [
          { id: "vehicle-1", name: "Vehicle 1" } as Vehicle
        ],
        name: 'Test',
        secret: true,
        image_url: null
      } as unknown as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("(1 vehicles)")
    })

    it("should handle party with undefined vehicles array", () => {
      const party = {
        characters: [
          { id: "char-1", name: "Character 1" } as Character,
          { id: "char-2", name: "Character 2" } as Character
        ],
        name: 'Test',
        secret: true,
        image_url: null
      } as unknown as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("(2 characters)")
    })

    it("should handle party with both arrays undefined", () => {
      const party = {
        name: 'Test',
        secret: true,
        image_url: null
      } as unknown as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("")
    })

    it("should handle singular character correctly", () => {
      const party = {
        characters: [
          { id: "char-1", name: "Single Character" } as Character
        ],
        vehicles: [],
        name: 'Test',
        secret: true,
        image_url: null
      } as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("(1 characters)")
    })

    it("should handle singular vehicle correctly", () => {
      const party = {
        characters: [],
        vehicles: [
          { id: "vehicle-1", name: "Single Vehicle" } as Vehicle
        ],
        name: 'Test',
        secret: true,
        image_url: null
      } as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("(1 vehicles)")
    })

    it("should handle large numbers of characters and vehicles", () => {
      const characters = Array.from({ length: 10 }, (_, i) => ({ 
        id: `char-${i}`, 
        name: `Character ${i}` 
      })) as Character[]
      
      const vehicles = Array.from({ length: 5 }, (_, i) => ({ 
        id: `vehicle-${i}`, 
        name: `Vehicle ${i}` 
      })) as Vehicle[]

      const party = { 
        characters, 
        vehicles,
        name: 'Test',
        secret: true,
        image_url: null
      } as Party

      const result = PartyService.rosterSummary(party)

      expect(result).toBe("(10 characters, 5 vehicles)")
    })
  })
})