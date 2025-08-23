# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **legacy-client** - the original Next.js frontend for the Chi War Feng Shui 2 RPG campaign management system. It runs on port 3003 and communicates with the Rails API backend using v1 endpoints. While newer development focuses on shot-client-next, this application is maintained for backward compatibility.

## Development Commands

### Core Development
```bash
npm run dev                    # Start development server on port 3003
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Run ESLint
npm run test                   # Run Jest tests
```

### Testing Commands
```bash
npm test                              # Run all Jest tests
npm test -- --watch                  # Run tests in watch mode
npm test services/CharacterService   # Run specific test file
```

## Architecture Overview

### Pages Router Structure
Uses Next.js Pages Router (not App Router) with file-based routing:
- `pages/` - Route definitions with dynamic segments `[id].tsx`
- `pages/api/` - API routes (primarily NextAuth)
- `pages/_app.tsx` - Application wrapper with providers
- `pages/_document.tsx` - Document structure

### Component Organization
Components are organized by feature domain:
```
components/
├── attacks/          # Combat attack system
├── characters/       # Character management (CRUD, display)
├── fights/           # Combat encounter management
├── campaigns/        # Campaign selection and management
├── vehicles/         # Vehicle system for chase scenes
├── weapons/          # Weapon management
├── schticks/         # Special abilities system
├── editor/           # Rich text editor with mentions
└── popups/           # Modal popup system
```

### State Management Architecture

**Context Providers (Hierarchical):**
- `SessionProvider` - NextAuth authentication
- `LocalStorageProvider` - Persistent local storage
- `ClientProvider` - API client and user state
- `CampaignProvider` - Current campaign context
- `FightProvider` - Combat state management
- `WebSocketProvider` - Real-time connections
- `ToastProvider` - Notification system

**Key Patterns:**
- Nested providers in `_app.tsx` establish global state hierarchy
- Local state with `useState` for component-specific data
- Reducers in `reducers/` for complex state transitions
- Services in `services/` for business logic

### API Integration

**API Client (`utils/Api.ts`):**
- Centralized URL builder for Rails v1 API endpoints
- Environment-based configuration for server URLs
- RESTful resource patterns with nested routes
- WebSocket cable URL generation

**Authentication:**
- NextAuth.js for session management
- JWT tokens for API authentication
- User context provides authentication state

**WebSocket Integration:**
- Action Cable integration via `@rails/actioncable`
- Real-time fight updates and campaign broadcasts
- Connection management in `WebSocketContext`

### Service Layer Pattern

**Service Architecture:**
- `CharacterService.ts` - Character state manipulation and calculations
- `FightService.ts` - Combat mechanics and initiative
- `AttackReducerService.ts` - Combat resolution logic
- `ChaseReducerService.ts` - Vehicle chase mechanics
- `SharedService.ts` - Common utilities across character/vehicle systems

**Key Service Features:**
- Functional approach with immutable state updates
- Chainable operations via `chain()` and `chainz()` methods
- Domain-specific calculations (wounds, toughness, initiative)
- Type-safe interfaces for all operations

### Component Patterns

**Feature Component Structure:**
```
characters/
├── CharacterModal.tsx        # CRUD modal
├── CharacterDetails.tsx      # Display component
├── CreateCharacter.tsx       # Creation form
├── edit/EditCharacter.tsx    # Edit forms
└── show/ShowCharacter.tsx    # Read-only display
```

**Common Patterns:**
- Modal-based editing with Material-UI dialogs
- Autocomplete components for entity selection
- Avatar components with badges for visual representation
- Toolbar components for bulk actions

### Rich Text Editor System

**TipTap Integration:**
- `components/editor/` - Custom rich text editor
- Mention system for referencing characters/entities
- WYSIWYG editing with toolbar
- Sanitized HTML rendering with DOMPurify

### Combat System Architecture

**Combat Flow:**
1. Fight creation and character/vehicle assignment
2. Initiative rolling and shot management
3. Attack resolution with dice mechanics
4. Real-time updates via WebSocket

**Key Combat Components:**
- `Initiative.tsx` - Shot order management
- `attacks/` - Attack resolution system
- `dice/DiceRoller.tsx` - Exploding dice mechanics
- `fights/Sequence.tsx` - Turn order display

## Data Models and Types

**Core Entities (`types/types.ts`):**
- `Character` - Player/NPC with skills, weapons, schticks
- `Vehicle` - Chase scene participants
- `Fight` - Combat encounters with shots and locations
- `Campaign` - Game sessions with users and content
- `Party` - Groups of characters/vehicles
- `Weapon/Schtick` - Equipment and special abilities

**Character Types:**
- `:pc` - Player Characters
- `:npc` - Non-Player Characters
- `:boss/:uber_boss` - Major antagonists
- `:featured_foe` - Notable enemies
- `:mook` - Weak enemies (handled differently in combat)

## Testing Strategy

**Jest Configuration:**
- TypeScript testing with `ts-jest`
- Test factories in `__tests__/factories/`
- Service layer unit tests
- Integration tests for combat mechanics

**Test Structure:**
```
__tests__/
├── factories/        # Test data factories
├── helpers/          # Test utilities
└── services/         # Service layer tests
```

## Environment Configuration

**Required Environment Variables:**
- `NEXT_PUBLIC_SERVER_URL` - Rails API base URL
- `NEXT_PUBLIC_WEBSOCKET_URL` - WebSocket server URL
- NextAuth configuration variables

## Material-UI Theming

**Custom Dark Theme:**
- Dark color palette with blue/red accent colors
- Custom component overrides
- Consistent styling across all components

## Path Aliases and Module Resolution

**TypeScript Path Mapping:**
- `@/*` maps to project root
- Absolute imports for all internal modules
- Custom type definitions in `types/` directory

## Legacy Considerations

**V1 API Integration:**
- Uses Rails API v1 endpoints (not v2)
- Some patterns may differ from newer shot-client-next
- Maintained for compatibility with existing campaigns
- Consider migration path when making significant changes

## WebSocket Real-time Features

**Action Cable Channels:**
- Campaign-wide updates for user management
- Fight-specific updates for combat state
- Character/vehicle action broadcasts
- Toast notifications for user feedback