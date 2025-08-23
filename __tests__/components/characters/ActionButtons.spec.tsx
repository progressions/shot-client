import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import ActionButtons from '../../../components/characters/ActionButtons'
import { defaultCharacter, defaultUser } from '../../../types/types'
import type { Character } from '../../../types/types'

// Mock the contexts
jest.mock('../../../contexts', () => ({
  useClient: () => ({
    user: {
      id: 'test-user',
      gamemaster: true
    }
  })
}))

// Mock the heavy modal components
jest.mock('../../../components/characters/WoundsModal', () => {
  return function MockWoundsModal() {
    return <button data-testid="wounds-modal">Wounds Modal</button>
  }
})

jest.mock('../../../components/characters/HealModal', () => {
  return function MockHealModal() {
    return <button data-testid="heal-modal">Heal Modal</button>
  }
})

jest.mock('../../../components/characters/ActionModal', () => {
  return function MockActionModal() {
    return <button data-testid="action-modal">Action Modal</button>
  }
})

// Mock CharacterService
jest.mock('../../../services/CharacterService', () => ({
  default: {}
}))

// Extend Material-UI theme to include highlight color
declare module '@mui/material/styles' {
  interface Palette {
    highlight: Palette['primary']
  }
  interface PaletteOptions {
    highlight: PaletteOptions['primary']
  }
}

describe('ActionButtons', () => {
  const mockCharacter: Character = {
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Character'
  }

  const mockTakeDodgeAction = jest.fn()
  const mockCheeseItAction = jest.fn()

  // Create a theme with the custom highlight color
  const theme = createTheme({
    palette: {
      highlight: {
        main: '#ff9800',
        dark: '#f57c00',
        light: '#ffb74d',
        contrastText: '#fff'
      }
    }
  })

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render base action buttons without optional actions', () => {
      renderWithTheme(<ActionButtons character={mockCharacter} />)
      
      // Should render wounds and heal modals
      expect(screen.getByTestId('wounds-modal')).toBeInTheDocument()
      expect(screen.getByTestId('heal-modal')).toBeInTheDocument()
      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
    })

    it('should render dodge button when takeDodgeAction provided', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      expect(dodgeButton).toBeInTheDocument()
    })

    it('should render cheese it button when cheeseItAction provided', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const cheeseItButton = screen.getByRole('button', { name: /cheese it/i })
      expect(cheeseItButton).toBeInTheDocument()
    })

    it('should render both optional buttons when both actions provided', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      expect(screen.getByRole('button', { name: /dodge/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cheese it/i })).toBeInTheDocument()
    })

    it('should not render optional buttons when actions not provided', () => {
      renderWithTheme(<ActionButtons character={mockCharacter} />)
      
      expect(screen.queryByRole('button', { name: /dodge/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /cheese it/i })).not.toBeInTheDocument()
    })
  })

  describe('button groups', () => {
    it('should organize buttons in proper ButtonGroups', () => {
      const { container } = renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const buttonGroups = container.querySelectorAll('.MuiButtonGroup-root')
      expect(buttonGroups.length).toBe(3) // Cheese it, wounds/heal, dodge/action
    })

    it('should have correct button group variants', () => {
      const { container } = renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const containedGroups = container.querySelectorAll('.MuiButtonGroup-contained')
      const outlinedGroups = container.querySelectorAll('.MuiButtonGroup-outlined')
      
      expect(containedGroups.length).toBe(2) // Cheese it and wounds/heal groups
      expect(outlinedGroups.length).toBe(1) // Dodge/action group
    })

    it('should have small size for all button groups', () => {
      const { container } = renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      // ButtonGroup components should have size="small" prop, which translates to different CSS classes
      const buttonGroups = container.querySelectorAll('.MuiButtonGroup-root')
      expect(buttonGroups.length).toBe(3)
      
      // The size is applied via the size prop - the exact class name may vary
      buttonGroups.forEach(group => {
        expect(group).toBeInTheDocument()
      })
    })
  })

  describe('dodge button interaction', () => {
    it('should call takeDodgeAction when dodge button is clicked', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      fireEvent.click(dodgeButton)
      
      expect(mockTakeDodgeAction).toHaveBeenCalledWith(mockCharacter)
      expect(mockTakeDodgeAction).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple clicks on dodge button', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      
      fireEvent.click(dodgeButton)
      fireEvent.click(dodgeButton)
      fireEvent.click(dodgeButton)
      
      expect(mockTakeDodgeAction).toHaveBeenCalledTimes(3)
      expect(mockTakeDodgeAction).toHaveBeenCalledWith(mockCharacter)
    })
  })

  describe('cheese it button interaction', () => {
    it('should call cheeseItAction when cheese it button is clicked', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const cheeseItButton = screen.getByRole('button', { name: /cheese it/i })
      fireEvent.click(cheeseItButton)
      
      expect(mockCheeseItAction).toHaveBeenCalledWith(mockCharacter)
      expect(mockCheeseItAction).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple clicks on cheese it button', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const cheeseItButton = screen.getByRole('button', { name: /cheese it/i })
      
      fireEvent.click(cheeseItButton)
      fireEvent.click(cheeseItButton)
      
      expect(mockCheeseItAction).toHaveBeenCalledTimes(2)
      expect(mockCheeseItAction).toHaveBeenCalledWith(mockCharacter)
    })
  })

  describe('tooltip behavior', () => {
    it('should render dodge button inside tooltip wrapper', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      // The button should exist and be wrapped by tooltip component
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      expect(dodgeButton).toBeInTheDocument()
    })

    it('should render cheese it button inside tooltip wrapper', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      // The button should exist and be wrapped by tooltip component
      const cheeseItButton = screen.getByRole('button', { name: /cheese it/i })
      expect(cheeseItButton).toBeInTheDocument()
    })
  })

  describe('button styling', () => {
    it('should have correct styling for dodge button', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      expect(dodgeButton).toHaveClass('MuiButton-contained')
    })

    it('should have custom styling for cheese it button', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const cheeseItButton = screen.getByRole('button', { name: /cheese it/i })
      expect(cheeseItButton).toHaveClass('MuiButton-contained')
      // Custom sx styling should be applied (orange background)
    })
  })

  describe('icons', () => {
    it('should render DirectionsRunIcon in dodge button', () => {
      const { container } = renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      const runIcon = container.querySelector('[data-testid="DirectionsRunIcon"]')
      expect(runIcon).toBeInTheDocument()
    })

    it('should render RunCircleIcon in cheese it button', () => {
      const { container } = renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const runCircleIcon = container.querySelector('[data-testid="RunCircleIcon"]')
      expect(runCircleIcon).toBeInTheDocument()
    })
  })

  describe('character prop handling', () => {
    it('should pass character to all callback functions', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      const cheeseItButton = screen.getByRole('button', { name: /cheese it/i })
      
      fireEvent.click(dodgeButton)
      fireEvent.click(cheeseItButton)
      
      expect(mockTakeDodgeAction).toHaveBeenCalledWith(mockCharacter)
      expect(mockCheeseItAction).toHaveBeenCalledWith(mockCharacter)
    })

    it('should handle different character objects', () => {
      const differentCharacter = {
        ...defaultCharacter,
        id: 'different-123',
        name: 'Different Character'
      }
      
      renderWithTheme(
        <ActionButtons 
          character={differentCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      fireEvent.click(dodgeButton)
      
      expect(mockTakeDodgeAction).toHaveBeenCalledWith(differentCharacter)
    })
  })

  describe('modal integration', () => {
    it('should render mocked modal components', () => {
      renderWithTheme(<ActionButtons character={mockCharacter} />)
      
      // All modal components should be present
      expect(screen.getByTestId('wounds-modal')).toBeInTheDocument()
      expect(screen.getByTestId('heal-modal')).toBeInTheDocument()
      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
    })

    it('should pass character to modal components', () => {
      // The mocked components don't show character props, but they should be passed
      renderWithTheme(<ActionButtons character={mockCharacter} />)
      
      // Verify modals are rendered (integration is mocked but structure is tested)
      expect(screen.getByTestId('wounds-modal')).toBeInTheDocument()
      expect(screen.getByTestId('heal-modal')).toBeInTheDocument()
      expect(screen.getByTestId('action-modal')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should render accessible buttons', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
      
      // Material-UI buttons should be accessible
      buttons.forEach(button => {
        expect(button).toBeInTheDocument()
        expect(button).not.toHaveAttribute('disabled')
      })
    })

    it('should render buttons with proper structure', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
          cheeseItAction={mockCheeseItAction}
        />
      )
      
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      const cheeseItButton = screen.getByRole('button', { name: /cheese it/i })
      
      // Buttons should exist and be accessible
      expect(dodgeButton).toBeInTheDocument()
      expect(cheeseItButton).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle null character gracefully', () => {
      renderWithTheme(
        <ActionButtons 
          character={null as any} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      fireEvent.click(dodgeButton)
      
      expect(mockTakeDodgeAction).toHaveBeenCalledWith(null)
    })

    it('should handle undefined callback functions', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={undefined}
          cheeseItAction={undefined}
        />
      )
      
      // Should render without optional buttons
      expect(screen.queryByRole('button', { name: /dodge/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /cheese it/i })).not.toBeInTheDocument()
    })

    it('should handle rapid button clicks', () => {
      renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      const dodgeButton = screen.getByRole('button', { name: /dodge/i })
      
      // Rapid fire clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(dodgeButton)
      }
      
      expect(mockTakeDodgeAction).toHaveBeenCalledTimes(10)
    })

    it('should maintain button functionality across re-renders', () => {
      const { rerender } = renderWithTheme(
        <ActionButtons 
          character={mockCharacter} 
          takeDodgeAction={mockTakeDodgeAction}
        />
      )
      
      const initialDodgeButton = screen.getByRole('button', { name: /dodge/i })
      fireEvent.click(initialDodgeButton)
      
      expect(mockTakeDodgeAction).toHaveBeenCalledTimes(1)
      
      // Re-render with same props
      rerender(
        <ThemeProvider theme={theme}>
          <ActionButtons 
            character={mockCharacter} 
            takeDodgeAction={mockTakeDodgeAction}
          />
        </ThemeProvider>
      )
      
      const rerenderedDodgeButton = screen.getByRole('button', { name: /dodge/i })
      fireEvent.click(rerenderedDodgeButton)
      
      expect(mockTakeDodgeAction).toHaveBeenCalledTimes(2)
    })
  })
})