import type { Character } from "@/types/types"
import { CharacterTypes, defaultCharacter } from "@/types/types"

export const createMockCharacter = (overrides: Partial<Character> = {}): Character => {
  return {
    ...defaultCharacter,
    id: "test-character-1",
    name: "Test Character",
    active: true,
    color: "#3f51b5",
    action_values: {
      ...defaultCharacter.action_values,
      "Type": CharacterTypes.PC,
      "MainAttack": "Martial Arts",
      "Martial Arts": 12,
      "Defense": 12,
      "Toughness": 6,
      "Speed": 5,
      ...overrides.action_values
    },
    ...overrides
  }
}