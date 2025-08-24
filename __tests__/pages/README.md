# Page-Level Integration Tests

This directory is for page-level integration tests that validate complete user flows through the application pages.

## Test Structure

Page tests should:
- Test the complete page component with all its child components
- Mock API calls at the page boundary
- Validate navigation and routing behavior
- Test authentication and authorization flows
- Verify data loading and error states

## Example Test Pattern

```typescript
// __tests__/pages/campaigns/index.spec.tsx
import { render, screen, waitFor } from "@testing-library/react"
import CampaignsPage from "@/pages/campaigns/index"
import { mockCampaigns } from "@/__tests__/factories/Campaigns"

describe("Campaigns Page", () => {
  it("should display list of campaigns", async () => {
    // Test implementation
  })
})
```

## Priority Pages to Test

1. **Authentication Pages** (Critical - No Coverage)
   - `/auth/signin` - Login flow
   - `/auth/signup` - Registration flow

2. **Campaign Management** (Critical - No Coverage)
   - `/campaigns` - Campaign list and creation
   - `/campaigns/[id]` - Campaign details and activation

3. **Character Management** (High Priority)
   - `/characters` - Character list
   - `/characters/[id]` - Character details
   - `/characters/generate` - AI generation

4. **Combat System** (High Priority)
   - `/fights/[id]` - Fight management and combat

5. **User Profile** (Medium Priority)
   - `/profile` - User settings and preferences