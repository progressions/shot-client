import type { Fight } from "@/types/types"

export const createMockFight = (overrides: Partial<Fight> = {}): Fight => {
  return {
    id: "test-fight-1",
    name: "Test Fight",
    description: "A test fight",
    sequence: 1,
    active: true,
    effects: [],
    shot_order: [],
    character_effects: {},
    vehicle_effects: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  }
}