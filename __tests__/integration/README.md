# Integration Tests

This directory contains integration tests that validate the interaction between multiple components and services.

## Test Categories

### API Integration
Tests that validate the complete flow from UI through API client to backend:
- Authentication flows
- CRUD operations
- WebSocket connections
- Error handling and retries

### Feature Integration
Tests that validate complete feature workflows:
- Character creation workflow
- Combat resolution flow
- Campaign activation process
- Party formation

### State Management Integration
Tests that validate complex state interactions:
- Context provider hierarchies
- Cross-component state updates
- WebSocket state synchronization

## Existing Integration Tests

Currently located in `services/`:
- `AttackIntegration.spec.ts` - Complete attack resolution flow
- `ChaseIntegration.spec.ts` - Vehicle chase mechanics

These should eventually be moved to this directory for better organization.

## Test Pattern

```typescript
describe("Campaign Activation Integration", () => {
  it("should activate campaign and update all dependent components", async () => {
    // Setup providers and mock data
    // Trigger campaign activation
    // Verify state updates across components
    // Verify API calls made
    // Verify WebSocket messages sent
  })
})
```