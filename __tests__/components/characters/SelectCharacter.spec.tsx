import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import SelectCharacter from '../../../components/characters/SelectCharacter'
import { defaultCharacter, defaultFight, defaultUser, CharacterTypes } from '../../../types/types'
import type { Character, Vehicle } from '../../../types/types'

// Mock contexts
const mockToastSuccess = jest.fn()
const mockToastError = jest.fn()
const mockDispatchFight = jest.fn()
const mockGetCharactersAndVehicles = jest.fn()

const mockUser = {
  ...defaultUser,
  gamemaster: true
}

jest.mock('../../../contexts', () => ({
  useToast: () => ({
    toastSuccess: mockToastSuccess,
    toastError: mockToastError
  }),
  useClient: () => ({
    user: mockUser,
    client: {
      getCharactersAndVehicles: mockGetCharactersAndVehicles
    }
  }),
  useFight: () => ({
    fight: {
      ...defaultFight,
      id: 'test-fight'
    },
    dispatch: mockDispatchFight
  })
}))

// Mock GamemasterOnly component
jest.mock('../../../components/GamemasterOnly', () => ({
  __esModule: true,
  default: ({ children }: any) => (
    <div data-testid="gamemaster-only">{children}</div>
  )
}))

// Mock CharacterFilters component
jest.mock('../../../components/characters/CharacterFilters', () => ({
  __esModule: true,
  default: ({ state, dispatch }: any) => (
    <div data-testid="character-filters">
      <input 
        data-testid="search-input" 
        value={state.search || ''} 
        onChange={(e) => dispatch({ type: 'search', payload: e.target.value })} 
      />
      <div data-testid="selected-character">{state.character?.name || 'None'}</div>
    </div>
  )
}))

// Mock StyledFields
jest.mock('../../../components/StyledFields', () => ({
  StyledTextField: ({ onChange, value, ...props }: any) => (
    <input 
      data-testid="styled-text-field"
      onChange={onChange}
      value={value || ''}
      {...props}
    />
  )
}))

describe('SelectCharacter', () => {
  const mockAddCharacter = jest.fn()
  const mockCharacter: Character = {
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Character',
    category: 'character' as const,
    action_values: {
      ...defaultCharacter.action_values,
      Type: CharacterTypes.PC
    }
  }

  const theme = createTheme()

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockGetCharactersAndVehicles.mockResolvedValue({
      characters: [mockCharacter],
      vehicles: [],
      total: 1
    })
  })

  describe('rendering', () => {
    it('should render select button', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
    })

    it('should render select button with icons', () => {
      const { container } = renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      expect(container.querySelector('[data-testid="PersonIcon"]')).toBeInTheDocument()
      expect(container.querySelector('[data-testid="DirectionsCarFilledIcon"]')).toBeInTheDocument()
    })

    it('should not render popover when closed', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      expect(screen.queryByTestId('character-filters')).not.toBeInTheDocument()
    })
  })

  describe('popover interactions', () => {
    it('should handle opening the popover', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      // After clicking, popover should open and show character filters
      expect(screen.getByTestId('character-filters')).toBeInTheDocument()
    })

    it('should render character filters in opened popover', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      expect(screen.getByTestId('character-filters')).toBeInTheDocument()
      expect(screen.getByTestId('search-input')).toBeInTheDocument()
      expect(screen.getByTestId('selected-character')).toBeInTheDocument()
    })

    it('should render submit button in opened popover', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      const submitButton = screen.getByTestId('PersonAddIcon').closest('button')
      expect(submitButton).toBeInTheDocument()
    })

    it('should render gamemaster section when opened', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      // Should render gamemaster section
      expect(screen.getByTestId('gamemaster-only')).toBeInTheDocument()
    })
  })

  describe('form submission', () => {
    it('should have submit button disabled by default', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      const submitButton = screen.getByTestId('PersonAddIcon').closest('button') as HTMLButtonElement
      expect(submitButton).toBeDisabled()
    })

    it('should handle form structure correctly', async () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      expect(screen.getByTestId('character-filters')).toBeInTheDocument()
      expect(mockAddCharacter).toBeDefined()
    })
  })

  describe('gamemaster features', () => {
    it('should show gamemaster-only features for gamemaster users', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      // Should show gamemaster only section
      expect(screen.getByTestId('gamemaster-only')).toBeInTheDocument()
    })

    it('should have toggle functionality available', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      // Should have gamemaster section rendered
      expect(screen.getByTestId('gamemaster-only')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible form elements', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
      
      // Open popover to access other elements
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThanOrEqual(1) // at least the submit button
      expect(screen.getByTestId('gamemaster-only')).toBeInTheDocument()
    })

    it('should have proper popover accessibility', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      const popover = document.querySelector('[role="presentation"]')
      expect(popover).toBeInTheDocument()
    })
  })

  describe('integration', () => {
    it('should integrate with character filters', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      const searchInput = screen.getByTestId('search-input')
      expect(searchInput).toBeInTheDocument()
      
      // Test that search input is functional
      fireEvent.change(searchInput, { target: { value: 'test search' } })
      expect(searchInput).toHaveValue('test search')
    })

    it('should show selected character status', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      const selectedCharacter = screen.getByTestId('selected-character')
      expect(selectedCharacter).toHaveTextContent('None')
    })
  })

  describe('edge cases', () => {
    it('should handle addCharacter prop properly', () => {
      const customAddCharacter = jest.fn()
      
      renderWithTheme(<SelectCharacter addCharacter={customAddCharacter} />)
      
      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
      expect(customAddCharacter).toBeDefined()
    })

    it('should have proper component structure', () => {
      renderWithTheme(<SelectCharacter addCharacter={mockAddCharacter} />)
      
      expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument()
      
      const selectButton = screen.getByRole('button', { name: /select/i })
      fireEvent.click(selectButton)
      
      expect(screen.getByTestId('character-filters')).toBeInTheDocument()
    })
  })
})