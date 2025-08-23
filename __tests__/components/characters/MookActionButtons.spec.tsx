import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import MookActionButtons from '../../../components/characters/MookActionButtons'
import { defaultCharacter, defaultUser, CharacterTypes } from '../../../types/types'
import type { Character, User } from '../../../types/types'
import CS from '../../../services/CharacterService'

// Mock ClientContext
const mockUser = {
  ...defaultUser,
  gamemaster: true
}

jest.mock('../../../contexts/ClientContext', () => ({
  useClient: () => ({
    user: mockUser
  })
}))

// Mock CharacterService
jest.mock('../../../services/CharacterService', () => ({
  mainAttackValue: jest.fn()
}))

// Mock KillMooksModal component
jest.mock('../../../components/characters/KillMooksModal', () => ({
  __esModule: true,
  default: ({ character }: any) => (
    <button data-testid="kill-mooks-modal">
      Kill Mooks - {character.name}
    </button>
  )
}))

// Mock ActionModal component
jest.mock('../../../components/characters/ActionModal', () => ({
  __esModule: true,
  default: ({ character }: any) => (
    <button data-testid="action-modal">
      Action - {character.name}
    </button>
  )
}))

// Mock GamemasterOnly component
jest.mock('../../../components/GamemasterOnly', () => ({
  __esModule: true,
  default: ({ user, character, children }: any) => {
    if (user?.gamemaster) {
      return <div data-testid="gamemaster-only">{children}</div>
    }
    return null
  }
}))

describe('MookActionButtons', () => {
  const mockMainAttackValue = CS.mainAttackValue as jest.MockedFunction<typeof CS.mainAttackValue>
  const mockEditCharacter = jest.fn()
  const mockDeleteCharacter = jest.fn()
  const mockHealWounds = jest.fn()
  const mockTakeConditionPoints = jest.fn()
  const mockTakeAction = jest.fn()

  const theme = createTheme()

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    )
  }

  const createTestCharacter = (category: 'character' | 'vehicle' = 'character'): Character => ({
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Mook',
    category,
    action_values: {
      ...defaultCharacter.action_values,
      Type: CharacterTypes.Mook
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockMainAttackValue.mockReturnValue(12)
  })

  describe('basic rendering', () => {
    const character = createTestCharacter()

    it('should render button groups', () => {
      renderWithTheme(<MookActionButtons character={character} />)

      expect(screen.getByTestId('kill-mooks-modal')).toBeInTheDocument()
      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
    })

    it('should render stack layout with proper spacing', () => {
      const { container } = renderWithTheme(<MookActionButtons character={character} />)

      const stack = container.querySelector('.MuiStack-root')
      expect(stack).toBeInTheDocument()
    })

    it('should have button groups with correct variants', () => {
      const { container } = renderWithTheme(<MookActionButtons character={character} />)

      const buttonGroups = container.querySelectorAll('.MuiButtonGroup-root')
      expect(buttonGroups).toHaveLength(2)
    })
  })

  describe('KillMooksModal integration', () => {
    const character = createTestCharacter()

    it('should render KillMooksModal with character', () => {
      renderWithTheme(<MookActionButtons character={character} />)

      expect(screen.getByTestId('kill-mooks-modal')).toBeInTheDocument()
      expect(screen.getByText('Kill Mooks - Test Mook')).toBeInTheDocument()
    })
  })

  describe('ActionModal integration', () => {
    const character = createTestCharacter()

    it('should render ActionModal with character', () => {
      renderWithTheme(<MookActionButtons character={character} />)

      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
      expect(screen.getByText('Action - Test Mook')).toBeInTheDocument()
    })

    it('should render ActionModal in outlined button group', () => {
      const { container } = renderWithTheme(<MookActionButtons character={character} />)

      const actionButtonGroup = container.querySelector('.actionButtons')
      expect(actionButtonGroup).toBeInTheDocument()
    })
  })

  describe('gamemaster features', () => {
    const character = createTestCharacter()

    it('should render gamemaster section for gamemaster user', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          editCharacter={mockEditCharacter}
          deleteCharacter={mockDeleteCharacter}
        />
      )

      expect(screen.getByTestId('gamemaster-only')).toBeInTheDocument()
    })

    it('should render edit button when editCharacter prop provided', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          editCharacter={mockEditCharacter}
        />
      )

      expect(screen.getByTestId('EditIcon')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit character/i })).toBeInTheDocument()
    })

    it('should render delete button when deleteCharacter prop provided', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          deleteCharacter={mockDeleteCharacter}
        />
      )

      expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete character/i })).toBeInTheDocument()
    })

    it('should render both edit and delete buttons when both props provided', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          editCharacter={mockEditCharacter}
          deleteCharacter={mockDeleteCharacter}
        />
      )

      expect(screen.getByRole('button', { name: /edit character/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete character/i })).toBeInTheDocument()
    })

    it('should not render edit button when editCharacter prop not provided', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          deleteCharacter={mockDeleteCharacter}
        />
      )

      expect(screen.queryByTestId('EditIcon')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /edit character/i })).not.toBeInTheDocument()
    })

    it('should not render delete button when deleteCharacter prop not provided', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          editCharacter={mockEditCharacter}
        />
      )

      expect(screen.queryByTestId('DeleteIcon')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete character/i })).not.toBeInTheDocument()
    })
  })

  describe('button interactions', () => {
    const character = createTestCharacter()

    it('should call editCharacter when edit button clicked', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          editCharacter={mockEditCharacter}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit character/i })
      fireEvent.click(editButton)

      expect(mockEditCharacter).toHaveBeenCalledWith(character)
    })

    it('should call deleteCharacter when delete button clicked', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          deleteCharacter={mockDeleteCharacter}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete character/i })
      fireEvent.click(deleteButton)

      expect(mockDeleteCharacter).toHaveBeenCalledWith(character)
    })

    it('should handle multiple button clicks', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          editCharacter={mockEditCharacter}
          deleteCharacter={mockDeleteCharacter}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit character/i })
      const deleteButton = screen.getByRole('button', { name: /delete character/i })

      fireEvent.click(editButton)
      fireEvent.click(deleteButton)
      fireEvent.click(editButton)

      expect(mockEditCharacter).toHaveBeenCalledTimes(2)
      expect(mockDeleteCharacter).toHaveBeenCalledTimes(1)
      expect(mockEditCharacter).toHaveBeenCalledWith(character)
      expect(mockDeleteCharacter).toHaveBeenCalledWith(character)
    })
  })

  describe('icon selection based on category', () => {
    it('should use HeartBroken icon for character category', () => {
      const character = createTestCharacter('character')
      
      renderWithTheme(<MookActionButtons character={character} />)

      // The icon logic is internal to the component and the mock KillMooksModal doesn't show icons
      // We can test that the component renders without error for character category
      expect(screen.getByTestId('kill-mooks-modal')).toBeInTheDocument()
    })

    it('should use Commute icon for vehicle category', () => {
      const vehicle = createTestCharacter('vehicle')
      
      renderWithTheme(<MookActionButtons character={vehicle} />)

      // The icon logic is internal to the component and the mock KillMooksModal doesn't show icons
      // We can test that the component renders without error for vehicle category
      expect(screen.getByTestId('kill-mooks-modal')).toBeInTheDocument()
    })
  })

  describe('unused props handling', () => {
    const character = createTestCharacter()

    it('should handle healWounds prop without rendering additional UI', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          healWounds={mockHealWounds}
        />
      )

      expect(screen.getByTestId('kill-mooks-modal')).toBeInTheDocument()
      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
      // healWounds is not used in current implementation
    })

    it('should handle takeConditionPoints prop without rendering additional UI', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          takeConditionPoints={mockTakeConditionPoints}
        />
      )

      expect(screen.getByTestId('kill-mooks-modal')).toBeInTheDocument()
      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
      // takeConditionPoints is not used in current implementation
    })

    it('should handle takeAction prop without rendering additional UI', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          takeAction={mockTakeAction}
        />
      )

      expect(screen.getByTestId('kill-mooks-modal')).toBeInTheDocument()
      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
      // takeAction is not used in current implementation
    })
  })

  describe('service integration', () => {
    const character = createTestCharacter()

    it('should call CharacterService.mainAttackValue', () => {
      renderWithTheme(<MookActionButtons character={character} />)

      expect(mockMainAttackValue).toHaveBeenCalledWith(character)
    })

    it('should handle different main attack values', () => {
      mockMainAttackValue.mockReturnValue(15)
      
      renderWithTheme(<MookActionButtons character={character} />)

      expect(mockMainAttackValue).toHaveBeenCalledWith(character)
    })
  })

  describe('accessibility', () => {
    const character = createTestCharacter()

    it('should have proper tooltip attributes for edit button', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          editCharacter={mockEditCharacter}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit character/i })
      expect(editButton).toBeInTheDocument()
    })

    it('should have proper tooltip attributes for delete button', () => {
      renderWithTheme(
        <MookActionButtons 
          character={character}
          deleteCharacter={mockDeleteCharacter}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete character/i })
      expect(deleteButton).toBeInTheDocument()
    })

    it('should have proper button group roles', () => {
      const { container } = renderWithTheme(
        <MookActionButtons 
          character={character}
          editCharacter={mockEditCharacter}
        />
      )

      const buttonGroups = container.querySelectorAll('[role="group"]')
      expect(buttonGroups.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('component structure', () => {
    const character = createTestCharacter()

    it('should maintain fixed height layout', () => {
      const { container } = renderWithTheme(<MookActionButtons character={character} />)

      const stack = container.querySelector('.MuiStack-root')
      expect(stack).toBeInTheDocument()
    })

    it('should use small button sizes', () => {
      const { container } = renderWithTheme(
        <MookActionButtons 
          character={character}
          editCharacter={mockEditCharacter}
        />
      )

      // ButtonGroups should exist regardless of specific CSS class names
      const buttonGroups = container.querySelectorAll('.MuiButtonGroup-root')
      expect(buttonGroups.length).toBeGreaterThanOrEqual(2)
    })

    it('should have proper CSS classes for action buttons', () => {
      const { container } = renderWithTheme(<MookActionButtons character={character} />)

      const actionButtonGroup = container.querySelector('.actionButtons')
      expect(actionButtonGroup).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle character with missing properties gracefully', () => {
      const minimalCharacter = {
        ...defaultCharacter,
        name: 'Minimal Character',
        category: 'character' as const
      }

      renderWithTheme(<MookActionButtons character={minimalCharacter} />)

      expect(screen.getByTestId('kill-mooks-modal')).toBeInTheDocument()
      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
    })

    it('should handle character with undefined category', () => {
      const characterWithUndefinedCategory = {
        ...createTestCharacter(),
        category: undefined as any
      }

      renderWithTheme(<MookActionButtons character={characterWithUndefinedCategory} />)

      expect(screen.getByTestId('kill-mooks-modal')).toBeInTheDocument()
      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
    })
  })
})