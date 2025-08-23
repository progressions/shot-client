import type { User } from "@/types/types"

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    gamemaster: false,
    ...overrides
  }
}