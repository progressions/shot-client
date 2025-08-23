import type { Schtick } from "@/types/types"

export function createMockSchtick(overrides: Partial<Schtick> = {}): Schtick {
  return {
    id: 'schtick-1',
    name: 'Test Schtick',
    category: 'Martial Arts',
    path: 'Tiger',
    description: 'A test schtick for unit testing',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    ...overrides
  }
}