import type { Weapon, Character, Juncture } from "@/types/types"
import { WeaponCategory } from "@/types/types"

// Extended weapon interface with additional properties for testing
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

/**
 * WeaponService - Handles weapon-specific calculations and validations
 */
class WeaponService {
  /**
   * Calculate the damage value for a weapon
   * @param weapon - The weapon to calculate damage for
   * @returns The damage value
   */
  calculateDamage(weapon: ExtendedWeapon): number {
    if (!weapon || typeof weapon.damage !== 'number') {
      return 0
    }

    // Handle negative damage edge case
    if (weapon.damage < 0) {
      return 0
    }

    // Handle damage overflow (max damage cap)
    if (weapon.damage > 50) {
      return 50
    }

    return weapon.damage
  }

  /**
   * Get the concealment value for a weapon
   * @param weapon - The weapon to get concealment for
   * @returns The concealment value
   */
  getConcealment(weapon: ExtendedWeapon): number {
    if (!weapon || typeof weapon.concealment !== 'number') {
      return 0
    }

    // Concealment values typically range from 0-10
    if (weapon.concealment < 0) {
      return 0
    }

    if (weapon.concealment > 10) {
      return 10
    }

    return weapon.concealment
  }

  /**
   * Calculate reload mechanics for a weapon
   * @param weapon - The weapon to check reload for
   * @returns Reload information
   */
  getReloadInfo(weapon: ExtendedWeapon): { needsReload: boolean; shotsRemaining: number; maxShots: number } {
    if (!weapon) {
      return { needsReload: false, shotsRemaining: 0, maxShots: 0 }
    }

    const maxShots = weapon.shots || 6 // Default to 6 shots
    const currentShots = weapon.current_shots ?? maxShots
    
    return {
      needsReload: currentShots <= 0,
      shotsRemaining: Math.max(0, currentShots),
      maxShots: maxShots
    }
  }

  /**
   * Reload a weapon to full capacity
   * @param weapon - The weapon to reload
   * @returns The weapon with full shots
   */
  reloadWeapon(weapon: ExtendedWeapon): ExtendedWeapon {
    if (!weapon) {
      return weapon
    }

    const maxShots = weapon.shots || 6
    return {
      ...weapon,
      current_shots: maxShots
    }
  }

  /**
   * Fire a weapon, reducing shot count
   * @param weapon - The weapon to fire
   * @returns The weapon with reduced shot count
   */
  fireWeapon(weapon: ExtendedWeapon): ExtendedWeapon {
    if (!weapon) {
      return weapon
    }

    const currentShots = weapon.current_shots ?? (weapon.shots || 6)
    return {
      ...weapon,
      current_shots: Math.max(0, currentShots - 1)
    }
  }

  /**
   * Get the category of a weapon
   * @param weapon - The weapon to categorize
   * @returns The weapon category
   */
  getCategory(weapon: ExtendedWeapon): WeaponCategory | string {
    if (!weapon || !weapon.category) {
      return 'Unknown'
    }

    return weapon.category
  }

  /**
   * Check if a weapon is appropriate for a specific juncture
   * @param weapon - The weapon to check
   * @param juncture - The juncture to check against
   * @returns True if weapon is appropriate for juncture
   */
  isAppropriateForJuncture(weapon: ExtendedWeapon, juncture: Juncture): boolean {
    if (!weapon || !juncture) {
      return false
    }

    // If weapon doesn't specify junctures, it's universal
    if (!weapon.junctures || weapon.junctures.length === 0) {
      return true
    }

    return weapon.junctures.includes(juncture.name)
  }

  /**
   * Get weapons appropriate for a specific juncture
   * @param weapons - Array of weapons to filter
   * @param juncture - The juncture to filter by
   * @returns Filtered array of weapons
   */
  getWeaponsForJuncture(weapons: ExtendedWeapon[], juncture: Juncture): ExtendedWeapon[] {
    if (!weapons || !Array.isArray(weapons)) {
      return []
    }

    return weapons.filter(weapon => this.isAppropriateForJuncture(weapon, juncture))
  }

  /**
   * Check if a weapon has special properties
   * @param weapon - The weapon to check
   * @param property - The property to check for
   * @returns True if weapon has the property
   */
  hasSpecialProperty(weapon: ExtendedWeapon, property: string): boolean {
    if (!weapon || !property) {
      return false
    }

    // Check in description or special properties
    if (weapon.description && weapon.description.toLowerCase().includes(property.toLowerCase())) {
      return true
    }

    // Check in special properties array if it exists
    if (weapon.special_properties && Array.isArray(weapon.special_properties)) {
      return weapon.special_properties.some(prop => 
        prop.toLowerCase().includes(property.toLowerCase())
      )
    }

    return false
  }

  /**
   * Calculate the effective range of a weapon
   * @param weapon - The weapon to calculate range for
   * @returns The effective range value
   */
  getEffectiveRange(weapon: ExtendedWeapon): number {
    if (!weapon) {
      return 0
    }

    // Use range if specified, otherwise default based on category
    if (typeof weapon.range === 'number') {
      return weapon.range
    }

    // Default ranges based on weapon category
    switch (weapon.category) {
      case 'Melee':
        return 1
      case 'Pistol':
        return 20
      case 'Rifle':
        return 100
      case 'Heavy':
        return 200
      default:
        return 10
    }
  }

  /**
   * Check if a character can wield a weapon
   * @param character - The character to check
   * @param weapon - The weapon to check
   * @returns True if character can wield weapon
   */
  canCharacterWieldWeapon(character: Character, weapon: ExtendedWeapon): boolean {
    if (!character || !weapon) {
      return false
    }

    // Check if character has required strength or skill
    // This is a simplified check - could be expanded based on game rules
    if (weapon.minimum_strength && character.action_values?.Strength) {
      const strength = typeof character.action_values.Strength === 'number' ? 
        character.action_values.Strength : 
        parseInt(character.action_values.Strength.toString()) || 0
      return strength >= weapon.minimum_strength
    }

    return true
  }

  /**
   * Get the total weight of weapons carried by a character
   * @param character - The character to check
   * @returns Total weight of weapons
   */
  getTotalWeaponWeight(character: Character): number {
    if (!character?.weapons || !Array.isArray(character.weapons)) {
      return 0
    }

    return character.weapons.reduce((total, weapon) => {
      const extendedWeapon = weapon as ExtendedWeapon
      return total + (extendedWeapon.weight || 0)
    }, 0)
  }

  /**
   * Check if a weapon is loaded and ready to fire
   * @param weapon - The weapon to check
   * @returns True if weapon can be fired
   */
  canFire(weapon: ExtendedWeapon): boolean {
    if (!weapon) {
      return false
    }

    const { shotsRemaining } = this.getReloadInfo(weapon)
    return shotsRemaining > 0
  }

  /**
   * Get the maintenance cost for a weapon based on usage
   * @param weapon - The weapon to calculate maintenance for
   * @returns Maintenance cost
   */
  getMaintenanceCost(weapon: ExtendedWeapon): number {
    if (!weapon) {
      return 0
    }

    const baseCost = weapon.cost || 100
    const usageRatio = this.getUsageRatio(weapon)
    
    // Higher usage = higher maintenance cost
    return Math.round(baseCost * usageRatio * 0.1)
  }

  /**
   * Calculate weapon usage ratio (how much it's been used)
   * @param weapon - The weapon to check
   * @returns Usage ratio between 0 and 1
   */
  private getUsageRatio(weapon: ExtendedWeapon): number {
    if (!weapon || !weapon.shots) {
      return 0
    }

    const maxShots = weapon.shots
    const currentShots = weapon.current_shots ?? maxShots
    return 1 - (currentShots / maxShots)
  }
}

const WS = new WeaponService()
export default WS