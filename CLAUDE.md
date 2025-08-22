# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **legacy-client** - a Next.js 13+ frontend application that serves as the original frontend for the Feng Shui 2 RPG campaign management system. It connects to the Rails API v1 endpoints and is maintained for backward compatibility while the newer shot-client-next uses API v2.

## Development Commands

### Common Development Tasks
```bash
npm run dev        # Start development server on port 3001
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm test           # Run Jest tests
```

### Test Commands
```bash
npm test                                    # Run all Jest tests
npm test -- CharacterService.spec.ts       # Run specific test file
npm test -- --watch                        # Run tests in watch mode
```

## Architecture

### Framework & Core Technologies
- **Next.js 13+** with Pages Router (not App Router)
- **TypeScript** for type safety
- **Material-UI (MUI) v5** for UI components with custom dark theme
- **NextAuth.js** for authentication
- **Jest + ts-jest** for unit testing
- **Sass/SCSS** for styling

### Key Architectural Patterns

**Pages Router Structure:**
- `pages/` - Next.js page components with file-based routing
- `pages/api/` - API routes (primarily NextAuth configuration)
- `pages/_app.tsx` - Application wrapper with providers
- `pages/_document.tsx` - HTML document structure

**Context-Based State Management:**
- Multiple React contexts for global state (Campaign, Fight, Client, etc.)
- Provider hierarchy defined in `_app.tsx`
- Local storage integration for persistence

**Service Layer Architecture:**
- `services/` - Domain logic and business rules
- `reducers/` - State transformation logic
- `utils/Api.ts` - API client with Rails backend integration
- `utils/Client.ts` - Axios-based HTTP client

**Real-time Communication:**
- Action Cable integration via `@rails/actioncable`
- WebSocket connections for live updates
- Campaign and Fight channels for collaborative features

### Component Organization

**Feature-Based Structure:**
```
components/
├── characters/     # Character management components
├── fights/         # Combat/fight management
├── campaigns/      # Campaign operations
├── attacks/        # Combat attack system
├── vehicles/       # Vehicle/chase mechanics
├── weapons/        # Weapon management
├── factions/       # Faction system
└── shared/         # Reusable components
```

**Component Patterns:**
- Feature directories contain List, Show, Form, Modal, and specialized components
- `edit/` subdirectories for editing interfaces
- Autocomplete components for entity selection
- Avatar and Badge components for visual representation

### Type System

**Comprehensive TypeScript Types:**
- `types/types.ts` - Complete domain model definitions
- Union types for character types, positions, etc.
- Default objects for all entities
- Complex interfaces for API responses with pagination

**Key Domain Types:**
- `Character` (union of `Person` and `Vehicle`)
- `Campaign`, `Fight`, `Faction`, `Party`, `Site`, `Juncture`
- `Weapon`, `Schtick`, `ActionValues`, `SkillValues`
- Response wrappers with pagination metadata

### API Integration

**Rails API v1 Client:**
- Class-based API client in `utils/Api.ts`
- RESTful endpoint construction
- Nested resource URL building
- JWT token authentication

**Authentication Flow:**
- NextAuth.js with custom JWT provider
- Rails backend authentication via API endpoints
- Session management with persistent storage
- Middleware for route protection

### Testing Strategy

**Jest Configuration:**
- `ts-jest` preset for TypeScript support
- Path mapping for `@/` imports
- Test factories for consistent test data
- Service layer unit tests with mocking

**Test Structure:**
- `__tests__/factories/` - Test data factories
- `__tests__/helpers/` - Testing utilities
- `__tests__/services/` - Service layer tests
- Comprehensive character service test coverage

### Styling & Theme

**Material-UI Theming:**
- Custom dark theme with blue/red color palette
- Global styles for dark background
- Component-level SCSS modules where needed
- Consistent typography and spacing

## Development Workflow

### Local Development Setup
1. Ensure Rails backend is running on port 3000
2. Install dependencies: `npm install`
3. Start development server: `npm run dev` (runs on port 3001)
4. Access application at `http://localhost:3001`

### Code Quality
- ESLint configuration for Next.js and TypeScript
- Type checking enforced throughout codebase
- Consistent import organization with path aliases
- SCSS modules for component-specific styling

### Real-time Features
The application includes extensive real-time functionality:
- Live campaign updates via WebSocket
- Fight sequence synchronization
- Character action broadcasting
- Multi-user collaborative editing

## Important Notes

- This is the **legacy** frontend - new features should prioritize shot-client-next
- Uses API v1 endpoints (not the newer v2 API)
- Maintains backward compatibility for existing users
- Complex combat system with detailed character mechanics
- Extensive character customization and management features