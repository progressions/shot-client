import type { Campaign } from "@/types/types"

export function createMockCampaign(overrides: Partial<Campaign> = {}): Campaign {
  return {
    id: 'campaign-1',
    name: 'Test Campaign',
    description: 'A test campaign for unit testing',
    new: false,
    players: [],
    invitations: [],
    ...overrides
  }
}