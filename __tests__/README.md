# Test Suite Organization

This directory contains all test files for the Chi War legacy client application.

## Directory Structure

```
__tests__/
├── components/       # Component-level tests using React Testing Library
├── contexts/         # Context provider tests
├── factories/        # Test data factories (Characters.ts, Vehicles.ts, Weapons.ts)
├── helpers/          # Test utility functions and helpers
├── integration/      # Integration tests for API and feature flows
├── pages/            # Page-level integration tests
├── reducers/         # State reducer tests
├── services/         # Service layer unit tests
└── utils/            # Utility function tests
```

## Test Naming Conventions

- All test files must use the `.spec.ts` or `.spec.tsx` extension
- Test files should mirror the source file structure
- Factory files use PascalCase (e.g., `Characters.ts`)
- Helper files use PascalCase (e.g., `AttackHelpers.ts`)

## Running Tests

```bash
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Generate coverage report
npm test [pattern]         # Run specific tests
```

## Test Patterns

### Unit Tests
- Service layer functions tested in isolation
- Pure functions with predictable inputs/outputs
- Located in `services/` and `utils/`

### Component Tests
- React components tested with React Testing Library
- Focus on user interactions and rendered output
- Located in `components/`

### Integration Tests
- Multi-component flows
- API client integration
- Located in `integration/`

### Factory Pattern
- Reusable test data in `factories/`
- Named exports for specific test scenarios
- Import as: `import { brick, carolina } from "@/__tests__/factories/Characters"`

### Helper Functions
- Complex test setup utilities in `helpers/`
- Shared test logic and assertions
- Domain-specific test helpers (AttackHelpers, ChaseHelpers)