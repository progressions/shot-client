import type { Weapon } from "@/types/types"

export function createMockWeapon(overrides: Partial<Weapon> = {}): Weapon {
  return {
    id: 'weapon-1',
    name: 'Test Weapon',
    category: 'Guns',
    juncture: 'Contemporary',
    damage: 13,
    concealment: -1,
    reload_value: 1,
    description: 'A standard test weapon for unit testing',
    mook_bonus: 0,
    kachunk: false,
    image_url: null,
    ...overrides
  }
}