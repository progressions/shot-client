import type { Schtick } from "@/types/types"

export function createMockSchtick(overrides: Partial<Schtick> = {}): Schtick {
  return {
    id: 'schtick-1',
    name: 'Test Schtick',
    category: 'Martial Arts',
    path: 'Tiger',
    description: 'A test schtick for unit testing',
    campaign_id: 'test-campaign-1',
    schtick_id: 'test-schtick-1',
    prerequisite: {},
    color: '#2196f3',
    ...overrides
  }
}