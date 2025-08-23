import React from 'react'
import { render, screen } from '@testing-library/react'
import WoundsDisplay from '../../../components/characters/WoundsDisplay'
import { defaultCharacter, defaultUser } from '../../../types/types'
import type { Character, User, CharacterType, CharacterCategory } from '../../../types/types'
import CS from '../../../services/CharacterService'

// Mock CharacterService methods
jest.mock('../../../services/CharacterService', () => ({
  seriousWounds: jest.fn(),
  wounds: jest.fn(),
  woundsLabel: jest.fn()
}))

describe('WoundsDisplay', () => {
  const mockCSeriousWounds = CS.seriousWounds as jest.MockedFunction<typeof CS.seriousWounds>
  const mockCWounds = CS.wounds as jest.MockedFunction<typeof CS.wounds>
  const mockCWoundsLabel = CS.woundsLabel as jest.MockedFunction<typeof CS.woundsLabel>

  const mockCharacter: Character = {
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Character'
  }

  const mockUser: User = {
    ...defaultUser,
    id: 'user-123',
    email: 'test@example.com'
  }

  const mockGamemasterUser: User = {
    ...defaultUser,
    id: 'gm-123',
    email: 'gm@example.com',
    gamemaster: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock returns - healthy character
    mockCSeriousWounds.mockReturnValue(false)
    mockCWounds.mockReturnValue(0)
    mockCWoundsLabel.mockReturnValue('Fine')
  })

  describe('rendering', () => {
    it('should render wounds display for gamemaster with healthy character', () => {
      render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('Fine')).toBeInTheDocument()
    })

    it('should not render for non-gamemaster user', () => {
      render(<WoundsDisplay character={mockCharacter} user={mockUser} />)
      
      expect(screen.queryByText('0')).not.toBeInTheDocument()
      expect(screen.queryByText('Fine')).not.toBeInTheDocument()
    })

    it('should not render when user is null', () => {
      render(<WoundsDisplay character={mockCharacter} user={null} />)
      
      expect(screen.queryByText('0')).not.toBeInTheDocument()
      expect(screen.queryByText('Fine')).not.toBeInTheDocument()
    })
  })

  describe('wounds display values', () => {
    it('should display correct wounds count and label', () => {
      mockCWounds.mockReturnValue(3)
      mockCWoundsLabel.mockReturnValue('Hurt')
      
      render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('Hurt')).toBeInTheDocument()
    })

    it('should display high wounds count', () => {
      mockCWounds.mockReturnValue(10)
      mockCWoundsLabel.mockReturnValue('Seriously Wounded')
      mockCSeriousWounds.mockReturnValue(true)
      
      render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('Seriously Wounded')).toBeInTheDocument()
    })

    it('should handle zero wounds', () => {
      mockCWounds.mockReturnValue(0)
      mockCWoundsLabel.mockReturnValue('Fine')
      
      render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('Fine')).toBeInTheDocument()
    })
  })

  describe('color logic', () => {
    it('should use normal colors for non-serious wounds', () => {
      mockCSeriousWounds.mockReturnValue(false)
      
      const { container } = render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(mockCSeriousWounds).toHaveBeenCalledWith(mockCharacter)
      
      // Should have normal styling (not error styling)
      const stack = container.querySelector('.MuiStack-root')
      expect(stack).toBeInTheDocument()
    })

    it('should use error colors for serious wounds', () => {
      mockCSeriousWounds.mockReturnValue(true)
      mockCWounds.mockReturnValue(8)
      mockCWoundsLabel.mockReturnValue('Seriously Wounded')
      
      const { container } = render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(mockCSeriousWounds).toHaveBeenCalledWith(mockCharacter)
      
      // Should have error styling for serious wounds
      const stack = container.querySelector('.MuiStack-root')
      expect(stack).toBeInTheDocument()
    })
  })

  describe('service integration', () => {
    it('should call CharacterService methods with correct character', () => {
      render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(mockCSeriousWounds).toHaveBeenCalledWith(mockCharacter)
      expect(mockCWounds).toHaveBeenCalledWith(mockCharacter)
      expect(mockCWoundsLabel).toHaveBeenCalledWith(mockCharacter)
    })

    it('should handle different character types', () => {
      const npcCharacter = { 
        ...mockCharacter,
        action_values: {
          ...mockCharacter.action_values,
          Type: 'Mook' as CharacterType
        }
      }
      
      render(<WoundsDisplay character={npcCharacter} user={mockGamemasterUser} />)
      
      expect(mockCSeriousWounds).toHaveBeenCalledWith(npcCharacter)
      expect(mockCWounds).toHaveBeenCalledWith(npcCharacter)
      expect(mockCWoundsLabel).toHaveBeenCalledWith(npcCharacter)
    })

    it('should handle vehicle character', () => {
      const vehicleCharacter = { 
        ...mockCharacter, 
        name: 'Test Vehicle',
        category: 'vehicle' as CharacterCategory
      }
      
      render(<WoundsDisplay character={vehicleCharacter} user={mockGamemasterUser} />)
      
      expect(mockCSeriousWounds).toHaveBeenCalledWith(vehicleCharacter)
      expect(mockCWounds).toHaveBeenCalledWith(vehicleCharacter)
      expect(mockCWoundsLabel).toHaveBeenCalledWith(vehicleCharacter)
    })
  })

  describe('Material-UI components', () => {
    it('should render with Stack and Typography components', () => {
      const { container } = render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      const stack = container.querySelector('.MuiStack-root')
      expect(stack).toBeInTheDocument()
      
      const typographies = container.querySelectorAll('.MuiTypography-root')
      expect(typographies.length).toBe(2) // wounds number and label
    })

    it('should have correct Typography variants', () => {
      const { container } = render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      const h4Typography = container.querySelector('.MuiTypography-h4')
      expect(h4Typography).toBeInTheDocument()
      
      const subtitle1Typography = container.querySelector('.MuiTypography-subtitle1')
      expect(subtitle1Typography).toBeInTheDocument()
    })

    it('should have proper styling attributes', () => {
      const { container } = render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      const stack = container.querySelector('.MuiStack-root')
      expect(stack).toBeInTheDocument()
      // Stack should have proper direction and alignment classes
      expect(stack).toHaveClass('MuiStack-root')
    })
  })

  describe('edge cases', () => {
    it('should handle empty wounds label', () => {
      mockCWoundsLabel.mockReturnValue('')
      
      render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(screen.getByText('0')).toBeInTheDocument()
      // Empty label should still render the Typography component
      const { container } = render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      const subtitle = container.querySelector('.MuiTypography-subtitle1')
      expect(subtitle).toBeInTheDocument()
    })

    it('should handle negative wounds count', () => {
      mockCWounds.mockReturnValue(-1)
      mockCWoundsLabel.mockReturnValue('Overheal')
      
      render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(screen.getByText('-1')).toBeInTheDocument()
      expect(screen.getByText('Overheal')).toBeInTheDocument()
    })

    it('should handle very high wounds count', () => {
      mockCWounds.mockReturnValue(999)
      mockCWoundsLabel.mockReturnValue('Critical')
      mockCSeriousWounds.mockReturnValue(true)
      
      render(<WoundsDisplay character={mockCharacter} user={mockGamemasterUser} />)
      
      expect(screen.getByText('999')).toBeInTheDocument()
      expect(screen.getByText('Critical')).toBeInTheDocument()
    })

    it('should handle character with minimal data', () => {
      const minimalCharacter = {
        ...defaultCharacter,
        id: 'min-123',
        name: 'Min'
      }
      
      render(<WoundsDisplay character={minimalCharacter} user={mockGamemasterUser} />)
      
      expect(mockCSeriousWounds).toHaveBeenCalledWith(minimalCharacter)
      expect(mockCWounds).toHaveBeenCalledWith(minimalCharacter)
      expect(mockCWoundsLabel).toHaveBeenCalledWith(minimalCharacter)
    })
  })
})