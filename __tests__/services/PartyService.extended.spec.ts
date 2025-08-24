import PS from '../../services/PartyService'
import { createMockParty, createMockCharacter, createMockVehicle, createMockFaction } from '../factories/MockFactories'
import type { Party, Character, Vehicle } from '../../types/types'

describe.skip('PartyService Extended Tests', () => {
  describe('adding duplicate members', () => {
    it('should handle party with duplicate characters gracefully', () => {
      const duplicateCharacter = createMockCharacter({ id: '1', name: 'Duplicate Hero' })
      const party = createMockParty({
        characters: [duplicateCharacter, duplicateCharacter, duplicateCharacter],
        vehicles: []
      })

      const badge = PS.nameBadge(party)
      const summary = PS.rosterSummary(party)

      expect(badge).toBe(`${party.name} (3 characters)`)
      expect(summary).toBe('(3 characters)')
    })

    it('should handle party with duplicate vehicles gracefully', () => {
      const duplicateVehicle = createMockVehicle({ id: '1', name: 'Duplicate Car' })
      const party = createMockParty({
        characters: [],
        vehicles: [duplicateVehicle, duplicateVehicle]
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(2 vehicles)')
    })

    it('should handle mixed duplicates', () => {
      const character = createMockCharacter({ id: '1', name: 'Hero' })
      const vehicle = createMockVehicle({ id: '1', name: 'Car' })
      const party = createMockParty({
        characters: [character, character],
        vehicles: [vehicle, vehicle, vehicle]
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(2 characters, 3 vehicles)')
    })

    it('should handle empty duplicates arrays', () => {
      const party = createMockParty({
        characters: [],
        vehicles: []
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('')
    })
  })

  describe('removing non-existent members', () => {
    it('should handle empty party roster gracefully', () => {
      const emptyParty = createMockParty({
        characters: [],
        vehicles: []
      })

      const badge = PS.nameBadge(emptyParty)
      const summary = PS.rosterSummary(emptyParty)

      expect(badge).toBe(`${emptyParty.name} `)
      expect(summary).toBe('')
    })

    it('should handle party with only characters when checking vehicles', () => {
      const party = createMockParty({
        characters: [createMockCharacter({ id: '1' })],
        vehicles: []
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(1 characters)')
    })

    it('should handle party with only vehicles when checking characters', () => {
      const party = createMockParty({
        characters: [],
        vehicles: [createMockVehicle({ id: '1' })]
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(1 vehicles)')
    })

    it('should handle undefined characters array', () => {
      const party = createMockParty({
        characters: undefined as any,
        vehicles: [createMockVehicle({ id: '1' })]
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(1 vehicles)')
    })

    it('should handle undefined vehicles array', () => {
      const party = createMockParty({
        characters: [createMockCharacter({ id: '1' })],
        vehicles: undefined as any
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(1 characters)')
    })
  })

  describe('party size limits', () => {
    it('should handle very large party with many characters', () => {
      const characters = Array.from({ length: 100 }, (_, i) => 
        createMockCharacter({ id: `char-${i}`, name: `Character ${i}` })
      )
      const party = createMockParty({
        characters: characters,
        vehicles: []
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(100 characters)')
    })

    it('should handle very large party with many vehicles', () => {
      const vehicles = Array.from({ length: 50 }, (_, i) => 
        createMockVehicle({ id: `vehicle-${i}`, name: `Vehicle ${i}` })
      )
      const party = createMockParty({
        characters: [],
        vehicles: vehicles
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(50 vehicles)')
    })

    it('should handle maximum mixed party', () => {
      const characters = Array.from({ length: 20 }, (_, i) => 
        createMockCharacter({ id: `char-${i}` })
      )
      const vehicles = Array.from({ length: 15 }, (_, i) => 
        createMockVehicle({ id: `vehicle-${i}` })
      )
      const party = createMockParty({
        characters: characters,
        vehicles: vehicles
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(20 characters, 15 vehicles)')
      
      const badge = PS.nameBadge(party)
      expect(badge).toBe(`${party.name} (20 characters, 15 vehicles)`)
    })

    it('should handle single member parties', () => {
      const singleCharacterParty = createMockParty({
        characters: [createMockCharacter({ id: '1' })],
        vehicles: []
      })
      const singleVehicleParty = createMockParty({
        characters: [],
        vehicles: [createMockVehicle({ id: '1' })]
      })

      expect(PS.rosterSummary(singleCharacterParty)).toBe('(1 characters)')
      expect(PS.rosterSummary(singleVehicleParty)).toBe('(1 vehicles)')
    })
  })

  describe('mixed character/vehicle parties', () => {
    it('should handle balanced mixed party', () => {
      const party = createMockParty({
        characters: [
          createMockCharacter({ id: '1', name: 'Hero 1' }),
          createMockCharacter({ id: '2', name: 'Hero 2' })
        ],
        vehicles: [
          createMockVehicle({ id: '1', name: 'Car 1' }),
          createMockVehicle({ id: '2', name: 'Car 2' })
        ]
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(2 characters, 2 vehicles)')
    })

    it('should handle unbalanced mixed party (more characters)', () => {
      const party = createMockParty({
        characters: [
          createMockCharacter({ id: '1' }),
          createMockCharacter({ id: '2' }),
          createMockCharacter({ id: '3' }),
          createMockCharacter({ id: '4' }),
          createMockCharacter({ id: '5' })
        ],
        vehicles: [
          createMockVehicle({ id: '1' })
        ]
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(5 characters, 1 vehicles)')
    })

    it('should handle unbalanced mixed party (more vehicles)', () => {
      const party = createMockParty({
        characters: [
          createMockCharacter({ id: '1' })
        ],
        vehicles: [
          createMockVehicle({ id: '1' }),
          createMockVehicle({ id: '2' }),
          createMockVehicle({ id: '3' }),
          createMockVehicle({ id: '4' })
        ]
      })

      const summary = PS.rosterSummary(party)
      expect(summary).toBe('(1 characters, 4 vehicles)')
    })

    it('should handle complex mixed scenarios', () => {
      const characters = Array.from({ length: 7 }, (_, i) => 
        createMockCharacter({ id: `char-${i}` })
      )
      const vehicles = Array.from({ length: 3 }, (_, i) => 
        createMockVehicle({ id: `vehicle-${i}` })
      )
      
      const party = createMockParty({
        name: 'Complex Party',
        characters: characters,
        vehicles: vehicles
      })

      expect(PS.rosterSummary(party)).toBe('(7 characters, 3 vehicles)')
      expect(PS.nameBadge(party)).toBe('Complex Party (7 characters, 3 vehicles)')
    })
  })

  describe('faction conflicts', () => {
    it('should handle characters from different factions', () => {
      const heroCharacter = createMockCharacter({ 
        id: '1', 
        name: 'Hero',
        faction: createMockFaction({ id: '1', name: 'Heroes' })
      })
      const villainCharacter = createMockCharacter({ 
        id: '2', 
        name: 'Villain',
        faction: createMockFaction({ id: '2', name: 'Villains' })
      })
      
      const party = createMockParty({
        characters: [heroCharacter, villainCharacter],
        vehicles: []
      })

      // Service doesn't validate faction conflicts, just counts
      expect(PS.rosterSummary(party)).toBe('(2 characters)')
    })

    it('should handle vehicles from different factions', () => {
      const heroVehicle = createMockVehicle({ 
        id: '1', 
        name: 'Hero Car',
        faction: createMockFaction({ id: '1', name: 'Heroes' })
      })
      const villainVehicle = createMockVehicle({ 
        id: '2', 
        name: 'Villain Car',
        faction: createMockFaction({ id: '2', name: 'Villains' })
      })
      
      const party = createMockParty({
        characters: [],
        vehicles: [heroVehicle, villainVehicle]
      })

      expect(PS.rosterSummary(party)).toBe('(2 vehicles)')
    })

    it('should handle mixed faction party', () => {
      const neutralCharacter = createMockCharacter({ 
        id: '1', 
        faction: undefined
      })
      const factionedCharacter = createMockCharacter({ 
        id: '2',
        faction: createMockFaction({ id: '1', name: 'Some Faction' })
      })
      
      const party = createMockParty({
        characters: [neutralCharacter, factionedCharacter],
        vehicles: []
      })

      expect(PS.rosterSummary(party)).toBe('(2 characters)')
    })
  })

  describe('secret party visibility', () => {
    it('should handle party with secret flag', () => {
      const secretParty = createMockParty({
        name: 'Secret Mission Team',
        secret: true,
        characters: [createMockCharacter({ id: '1' })],
        vehicles: []
      } as any)

      // Service doesn't check secret flag, just provides name and summary
      expect(PS.nameBadge(secretParty)).toBe('Secret Mission Team (1 characters)')
    })

    it('should handle party with visibility restrictions', () => {
      const restrictedParty = createMockParty({
        name: 'Restricted Party',
        visible: false,
        characters: [
          createMockCharacter({ id: '1' }),
          createMockCharacter({ id: '2' })
        ],
        vehicles: [createMockVehicle({ id: '1' })]
      } as any)

      expect(PS.rosterSummary(restrictedParty)).toBe('(2 characters, 1 vehicles)')
    })

    it('should handle party with hidden members', () => {
      const hiddenCharacter = createMockCharacter({ 
        id: '1',
        hidden: true
      } as any)
      const visibleCharacter = createMockCharacter({ 
        id: '2',
        hidden: false
      } as any)
      
      const party = createMockParty({
        characters: [hiddenCharacter, visibleCharacter],
        vehicles: []
      })

      // Service counts all members regardless of visibility
      expect(PS.rosterSummary(party)).toBe('(2 characters)')
    })
  })

  describe('party dissolution edge cases', () => {
    it('should handle null party gracefully', () => {
      expect(PS.nameBadge(null as any)).toBe('undefined ')
      expect(PS.rosterSummary(null as any)).toBe('')
    })

    it('should handle undefined party gracefully', () => {
      expect(PS.nameBadge(undefined as any)).toBe('undefined ')
      expect(PS.rosterSummary(undefined as any)).toBe('')
    })

    it('should handle party with null name', () => {
      const party = createMockParty({
        name: null as any,
        characters: [createMockCharacter({ id: '1' })],
        vehicles: []
      })

      expect(PS.nameBadge(party)).toBe('null (1 characters)')
    })

    it('should handle party with empty string name', () => {
      const party = createMockParty({
        name: '',
        characters: [createMockCharacter({ id: '1' })],
        vehicles: []
      })

      expect(PS.nameBadge(party)).toBe(' (1 characters)')
    })

    it('should handle party with extremely long name', () => {
      const longName = 'A'.repeat(1000)
      const party = createMockParty({
        name: longName,
        characters: [createMockCharacter({ id: '1' })],
        vehicles: []
      })

      const badge = PS.nameBadge(party)
      expect(badge).toBe(`${longName} (1 characters)`)
      expect(badge.length).toBe(1000 + ' (1 characters)'.length)
    })

    it('should handle party with special characters in name', () => {
      const party = createMockParty({
        name: 'Party™ with 特殊字符 & symbols!@#$%^&*()',
        characters: [createMockCharacter({ id: '1' })],
        vehicles: []
      })

      expect(PS.nameBadge(party)).toBe('Party™ with 特殊字符 & symbols!@#$%^&*() (1 characters)')
    })

    it('should handle party that becomes empty after member removal', () => {
      const nowEmptyParty = createMockParty({
        characters: [],
        vehicles: []
      })

      expect(PS.rosterSummary(nowEmptyParty)).toBe('')
      expect(PS.nameBadge(nowEmptyParty)).toBe(`${nowEmptyParty.name} `)
    })
  })

  describe('performance and memory considerations', () => {
    it('should handle party with zero-length arrays efficiently', () => {
      const party = createMockParty({
        characters: [],
        vehicles: []
      })

      // Multiple calls should be consistent
      expect(PS.rosterSummary(party)).toBe('')
      expect(PS.rosterSummary(party)).toBe('')
      expect(PS.nameBadge(party)).toBe(`${party.name} `)
    })

    it('should handle repeated calls with same party data', () => {
      const party = createMockParty({
        characters: [createMockCharacter({ id: '1' })],
        vehicles: [createMockVehicle({ id: '1' })]
      })

      const firstCall = PS.rosterSummary(party)
      const secondCall = PS.rosterSummary(party)
      const thirdCall = PS.rosterSummary(party)

      expect(firstCall).toBe('(1 characters, 1 vehicles)')
      expect(secondCall).toBe(firstCall)
      expect(thirdCall).toBe(firstCall)
    })

    it('should handle party state changes correctly', () => {
      const party = createMockParty({
        characters: [createMockCharacter({ id: '1' })],
        vehicles: []
      })

      const initialSummary = PS.rosterSummary(party)
      expect(initialSummary).toBe('(1 characters)')

      // Simulate adding a vehicle
      party.vehicles = [createMockVehicle({ id: '1' })]
      const updatedSummary = PS.rosterSummary(party)
      expect(updatedSummary).toBe('(1 characters, 1 vehicles)')
    })
  })
})