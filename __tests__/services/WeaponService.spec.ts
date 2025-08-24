import WS from '../../services/WeaponService'
import { createMockWeapon, createMockCharacter } from '../factories/MockFactories'
import type { Weapon, Character, Juncture } from '../../types/types'

// Extended weapon interface for testing
interface ExtendedWeapon extends Weapon {
  shots?: number
  current_shots?: number
  range?: number
  weight?: number
  cost?: number
  minimum_strength?: number
  special_properties?: string[]
  junctures?: string[]
}

// Helper function to create extended weapon
const createExtendedWeapon = (overrides: Partial<ExtendedWeapon> = {}): ExtendedWeapon => {
  return { ...createMockWeapon(), ...overrides } as ExtendedWeapon
}

describe('WeaponService', () => {
  describe('damage calculation', () => {
    it('should calculate damage correctly for valid weapon', () => {
      const weapon = createExtendedWeapon({ damage: 10 })
      
      expect(WS.calculateDamage(weapon)).toBe(10)
    })

    it('should return 0 for weapon without damage', () => {
      const weapon = createExtendedWeapon({ damage: undefined })
      
      expect(WS.calculateDamage(weapon)).toBe(0)
    })

    it('should return 0 for null weapon', () => {
      expect(WS.calculateDamage(null as any)).toBe(0)
    })

    it('should handle negative damage edge case', () => {
      const weapon = createExtendedWeapon({ damage: -5 })
      
      expect(WS.calculateDamage(weapon)).toBe(0)
    })

    it('should cap damage at maximum value', () => {
      const weapon = createExtendedWeapon({ damage: 100 })
      
      expect(WS.calculateDamage(weapon)).toBe(50) // Capped at 50
    })

    it('should handle non-numeric damage values', () => {
      const weapon = createExtendedWeapon({ damage: "invalid" as any })
      
      expect(WS.calculateDamage(weapon)).toBe(0)
    })
  })

  describe('concealment values', () => {
    it('should return correct concealment value', () => {
      const weapon = createExtendedWeapon({ concealment: 5 })
      
      expect(WS.getConcealment(weapon)).toBe(5)
    })

    it('should return 0 for weapon without concealment', () => {
      const weapon = createExtendedWeapon({ concealment: undefined })
      
      expect(WS.getConcealment(weapon)).toBe(0)
    })

    it('should cap concealment at maximum', () => {
      const weapon = createExtendedWeapon({ concealment: 15 })
      
      expect(WS.getConcealment(weapon)).toBe(10) // Capped at 10
    })

    it('should handle negative concealment', () => {
      const weapon = createExtendedWeapon({ concealment: -3 })
      
      expect(WS.getConcealment(weapon)).toBe(0)
    })

    it('should return 0 for null weapon', () => {
      expect(WS.getConcealment(null as any)).toBe(0)
    })
  })

  describe('reload mechanics', () => {
    it('should correctly identify weapon that needs reload', () => {
      const weapon = createExtendedWeapon({ 
        shots: 6, 
        current_shots: 0 
      })
      
      const reloadInfo = WS.getReloadInfo(weapon)
      
      expect(reloadInfo.needsReload).toBe(true)
      expect(reloadInfo.shotsRemaining).toBe(0)
      expect(reloadInfo.maxShots).toBe(6)
    })

    it('should identify weapon that does not need reload', () => {
      const weapon = createExtendedWeapon({ 
        shots: 6, 
        current_shots: 3 
      })
      
      const reloadInfo = WS.getReloadInfo(weapon)
      
      expect(reloadInfo.needsReload).toBe(false)
      expect(reloadInfo.shotsRemaining).toBe(3)
      expect(reloadInfo.maxShots).toBe(6)
    })

    it('should default to 6 shots when not specified', () => {
      const weapon = createExtendedWeapon({ 
        shots: undefined,
        current_shots: undefined
      })
      
      const reloadInfo = WS.getReloadInfo(weapon)
      
      expect(reloadInfo.maxShots).toBe(6)
      expect(reloadInfo.shotsRemaining).toBe(6)
      expect(reloadInfo.needsReload).toBe(false)
    })

    it('should handle null weapon', () => {
      const reloadInfo = WS.getReloadInfo(null as any)
      
      expect(reloadInfo.needsReload).toBe(false)
      expect(reloadInfo.shotsRemaining).toBe(0)
      expect(reloadInfo.maxShots).toBe(0)
    })

    it('should handle weapon with undefined current_shots', () => {
      const weapon = createExtendedWeapon({ 
        shots: 8,
        current_shots: undefined
      })
      
      const reloadInfo = WS.getReloadInfo(weapon)
      
      expect(reloadInfo.shotsRemaining).toBe(8)
      expect(reloadInfo.maxShots).toBe(8)
    })
  })

  describe('weapon categories', () => {
    it('should return correct weapon category', () => {
      const weapon = createExtendedWeapon({ category: 'Pistol' })
      
      expect(WS.getCategory(weapon)).toBe('Pistol')
    })

    it('should return Unknown for weapon without category', () => {
      const weapon = createExtendedWeapon({ category: undefined })
      
      expect(WS.getCategory(weapon)).toBe('Unknown')
    })

    it('should handle null weapon', () => {
      expect(WS.getCategory(null as any)).toBe('Unknown')
    })

    it('should handle various weapon categories', () => {
      const melee = createExtendedWeapon({ category: 'Melee' })
      const rifle = createExtendedWeapon({ category: 'Rifle' })
      const heavy = createExtendedWeapon({ category: 'Heavy' })
      
      expect(WS.getCategory(melee)).toBe('Melee')
      expect(WS.getCategory(rifle)).toBe('Rifle')
      expect(WS.getCategory(heavy)).toBe('Heavy')
    })
  })

  describe('juncture-specific weapons', () => {
    const ancientJuncture: Juncture = { 
      id: '1', 
      name: 'Ancient', 
      description: 'Ancient times',
      active: true,
      image_url: null
    }
    const modernJuncture: Juncture = { 
      id: '2', 
      name: 'Contemporary', 
      description: 'Modern times',
      active: true,
      image_url: null
    }

    it('should identify weapon appropriate for juncture', () => {
      const weapon = createExtendedWeapon({ 
        junctures: ['Ancient', 'Contemporary']
      })
      
      expect(WS.isAppropriateForJuncture(weapon, ancientJuncture)).toBe(true)
      expect(WS.isAppropriateForJuncture(weapon, modernJuncture)).toBe(true)
    })

    it('should identify weapon not appropriate for juncture', () => {
      const weapon = createExtendedWeapon({ 
        junctures: ['Future']
      })
      
      expect(WS.isAppropriateForJuncture(weapon, ancientJuncture)).toBe(false)
    })

    it('should treat universal weapons as appropriate for all junctures', () => {
      const universalWeapon = createExtendedWeapon({ 
        junctures: []
      })
      
      expect(WS.isAppropriateForJuncture(universalWeapon, ancientJuncture)).toBe(true)
      expect(WS.isAppropriateForJuncture(universalWeapon, modernJuncture)).toBe(true)
    })

    it('should filter weapons by juncture', () => {
      const ancientWeapon = createExtendedWeapon({ 
        id: '1',
        name: 'Sword',
        junctures: ['Ancient']
      })
      const modernWeapon = createExtendedWeapon({ 
        id: '2',
        name: 'Gun',
        junctures: ['Contemporary']
      })
      const universalWeapon = createExtendedWeapon({ 
        id: '3',
        name: 'Knife',
        junctures: []
      })
      
      const weapons = [ancientWeapon, modernWeapon, universalWeapon]
      const ancientWeapons = WS.getWeaponsForJuncture(weapons, ancientJuncture)
      
      expect(ancientWeapons).toHaveLength(2)
      expect(ancientWeapons).toContain(ancientWeapon)
      expect(ancientWeapons).toContain(universalWeapon)
      expect(ancientWeapons).not.toContain(modernWeapon)
    })

    it('should handle empty weapons array', () => {
      const result = WS.getWeaponsForJuncture([], ancientJuncture)
      
      expect(result).toEqual([])
    })

    it('should handle null inputs', () => {
      expect(WS.isAppropriateForJuncture(null as any, ancientJuncture)).toBe(false)
      expect(WS.isAppropriateForJuncture(createExtendedWeapon({}), null as any)).toBe(false)
    })
  })

  describe('special weapon properties', () => {
    it('should identify weapon with special property in description', () => {
      const weapon = createExtendedWeapon({ 
        description: 'This weapon has explosive rounds'
      })
      
      expect(WS.hasSpecialProperty(weapon, 'explosive')).toBe(true)
    })

    it('should identify weapon without special property', () => {
      const weapon = createExtendedWeapon({ 
        description: 'A standard weapon'
      })
      
      expect(WS.hasSpecialProperty(weapon, 'explosive')).toBe(false)
    })

    it('should handle case-insensitive property matching', () => {
      const weapon = createExtendedWeapon({ 
        description: 'EXPLOSIVE rounds'
      })
      
      expect(WS.hasSpecialProperty(weapon, 'explosive')).toBe(true)
      expect(WS.hasSpecialProperty(weapon, 'EXPLOSIVE')).toBe(true)
    })

    it('should check special properties array', () => {
      const weapon = createExtendedWeapon({ 
        special_properties: ['Automatic', 'Silenced']
      } as any)
      
      expect(WS.hasSpecialProperty(weapon, 'automatic')).toBe(true)
      expect(WS.hasSpecialProperty(weapon, 'silenced')).toBe(true)
      expect(WS.hasSpecialProperty(weapon, 'explosive')).toBe(false)
    })

    it('should handle null inputs', () => {
      expect(WS.hasSpecialProperty(null as any, 'explosive')).toBe(false)
      expect(WS.hasSpecialProperty(createExtendedWeapon({}), '')).toBe(false)
    })
  })

  describe('weapon operations', () => {
    it('should reload weapon to full capacity', () => {
      const weapon = createExtendedWeapon({ 
        shots: 6, 
        current_shots: 2
      })
      
      const reloadedWeapon = WS.reloadWeapon(weapon)
      
      expect(reloadedWeapon.current_shots).toBe(6)
      expect(reloadedWeapon.shots).toBe(6)
    })

    it('should fire weapon reducing shot count', () => {
      const weapon = createExtendedWeapon({ 
        shots: 6, 
        current_shots: 3
      })
      
      const firedWeapon = WS.fireWeapon(weapon)
      
      expect(firedWeapon.current_shots).toBe(2)
    })

    it('should not reduce shots below zero when firing', () => {
      const weapon = createExtendedWeapon({ 
        shots: 6, 
        current_shots: 0
      })
      
      const firedWeapon = WS.fireWeapon(weapon)
      
      expect(firedWeapon.current_shots).toBe(0)
    })

    it('should handle firing weapon without current_shots set', () => {
      const weapon = createExtendedWeapon({ 
        shots: 6,
        current_shots: undefined
      })
      
      const firedWeapon = WS.fireWeapon(weapon)
      
      expect(firedWeapon.current_shots).toBe(5)
    })

    it('should identify if weapon can fire', () => {
      const loadedWeapon = createExtendedWeapon({ current_shots: 3 })
      const emptyWeapon = createExtendedWeapon({ current_shots: 0 })
      
      expect(WS.canFire(loadedWeapon)).toBe(true)
      expect(WS.canFire(emptyWeapon)).toBe(false)
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle weapons with overflow damage values', () => {
      const weapon = createExtendedWeapon({ damage: Number.MAX_VALUE })
      
      expect(WS.calculateDamage(weapon)).toBe(50) // Capped
    })

    it('should handle weapons with negative ammunition', () => {
      const weapon = createExtendedWeapon({ 
        shots: 6,
        current_shots: -1
      })
      
      const reloadInfo = WS.getReloadInfo(weapon)
      
      expect(reloadInfo.shotsRemaining).toBe(0)
      expect(reloadInfo.needsReload).toBe(true)
    })

    it('should get effective range based on category', () => {
      const meleeWeapon = createExtendedWeapon({ category: 'Melee' })
      const pistol = createExtendedWeapon({ category: 'Pistol' })
      const rifle = createExtendedWeapon({ category: 'Rifle' })
      const heavy = createExtendedWeapon({ category: 'Heavy' })
      
      expect(WS.getEffectiveRange(meleeWeapon)).toBe(1)
      expect(WS.getEffectiveRange(pistol)).toBe(20)
      expect(WS.getEffectiveRange(rifle)).toBe(100)
      expect(WS.getEffectiveRange(heavy)).toBe(200)
    })

    it('should use specified range over default', () => {
      const weapon = createExtendedWeapon({ 
        category: 'Pistol',
        range: 50
      })
      
      expect(WS.getEffectiveRange(weapon)).toBe(50)
    })

    it('should calculate total weapon weight for character', () => {
      const character = createMockCharacter({
        weapons: [
          createExtendedWeapon({ weight: 2.5 }),
          createExtendedWeapon({ weight: 1.0 }),
          createExtendedWeapon({ weight: 3.2 })
        ]
      })
      
      expect(WS.getTotalWeaponWeight(character)).toBe(6.7)
    })

    it('should return 0 weight for character without weapons', () => {
      const character = createMockCharacter({ weapons: [] })
      
      expect(WS.getTotalWeaponWeight(character)).toBe(0)
    })

    it('should check if character can wield weapon based on strength', () => {
      const strongCharacter = createMockCharacter({
        action_values: { Strength: 15 }
      })
      const weakCharacter = createMockCharacter({
        action_values: { Strength: 5 }
      })
      const heavyWeapon = createExtendedWeapon({ 
        minimum_strength: 10
      } as any)
      
      expect(WS.canCharacterWieldWeapon(strongCharacter, heavyWeapon)).toBe(true)
      expect(WS.canCharacterWieldWeapon(weakCharacter, heavyWeapon)).toBe(false)
    })

    it('should calculate maintenance cost based on usage', () => {
      const newWeapon = createExtendedWeapon({ 
        cost: 100,
        shots: 6,
        current_shots: 6
      })
      const usedWeapon = createExtendedWeapon({ 
        cost: 100,
        shots: 6,
        current_shots: 3
      })
      
      const newCost = WS.getMaintenanceCost(newWeapon)
      const usedCost = WS.getMaintenanceCost(usedWeapon)
      
      expect(usedCost).toBeGreaterThan(newCost)
    })
  })
})