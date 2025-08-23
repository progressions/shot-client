import React from 'react'
import { render, screen } from '@testing-library/react'
import ActionValueDisplay, { colorForValue } from '../../../components/characters/ActionValueDisplay'
import { defaultCharacter, defaultFight } from '../../../types/types'
import type { Character, Fight } from '../../../types/types'
import CS from '../../../services/CharacterService'
import CES from '../../../services/CharacterEffectService'

// Mock the contexts
jest.mock('../../../contexts/FightContext', () => ({
  useFight: () => ({
    fight: {
      ...defaultFight,
      id: 'test-fight',
      active: true
    }
  })
}))

// Mock CharacterService methods
jest.mock('../../../services/CharacterService', () => ({
  fortune: jest.fn(),
  maxFortune: jest.fn()
}))

// Mock CharacterEffectService methods
jest.mock('../../../services/CharacterEffectService', () => ({
  adjustedActionValue: jest.fn()
}))

describe('ActionValueDisplay', () => {
  const mockCSFortune = CS.fortune as jest.MockedFunction<typeof CS.fortune>
  const mockCSMaxFortune = CS.maxFortune as jest.MockedFunction<typeof CS.maxFortune>
  const mockCESAdjustedActionValue = CES.adjustedActionValue as jest.MockedFunction<typeof CES.adjustedActionValue>

  const mockCharacter: Character = {
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Character',
    impairments: 2,
    action_values: {
      ...defaultCharacter.action_values,
      Guns: 12,
      Defense: 14,
      Fortune: 8,
      'Max Fortune': 10
    }
  }

  const mockFight: Fight = {
    ...defaultFight,
    id: 'fight-123',
    active: true
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Default mock returns - no change in value
    mockCESAdjustedActionValue.mockReturnValue([0, 12])
    mockCSFortune.mockReturnValue(8)
    mockCSMaxFortune.mockReturnValue(10)
  })

  describe('colorForValue utility function', () => {
    it('should return red for negative values', () => {
      expect(colorForValue(-5)).toBe('red')
      expect(colorForValue(-1)).toBe('red')
    })

    it('should return green for positive values', () => {
      expect(colorForValue(5)).toBe('green')
      expect(colorForValue(1)).toBe('green')
    })

    it('should return inherit for zero', () => {
      expect(colorForValue(0)).toBe('inherit')
    })
  })

  describe('rendering', () => {
    it('should render action value with label and value', () => {
      render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={mockCharacter}
        />
      )

      expect(screen.getByText('Guns')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
    })

    it('should not render when action value is not present', () => {
      const characterWithoutGuns = {
        ...mockCharacter,
        action_values: {
          ...mockCharacter.action_values,
          Guns: undefined as any
        }
      }

      const { container } = render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={characterWithoutGuns}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('should return empty fragment when action value is falsy', () => {
      const characterWithZeroValue = {
        ...mockCharacter,
        action_values: {
          ...mockCharacter.action_values,
          Guns: 0
        }
      }

      const { container } = render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={characterWithZeroValue}
        />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('Fortune special case', () => {
    it('should render Fortune as current/max format', () => {
      render(
        <ActionValueDisplay
          name="Fortune"
          label="Fortune"
          description="Character fortune"
          character={mockCharacter}
        />
      )

      expect(screen.getByText('Fortune')).toBeInTheDocument()
      expect(screen.getByText('8 / 10')).toBeInTheDocument()
    })

    it('should call CharacterService methods for Fortune values', () => {
      render(
        <ActionValueDisplay
          name="Fortune"
          label="Fortune"
          description="Character fortune"
          character={mockCharacter}
        />
      )

      expect(mockCSFortune).toHaveBeenCalledWith(mockCharacter)
      expect(mockCSMaxFortune).toHaveBeenCalledWith(mockCharacter)
    })

    it('should handle different fortune values', () => {
      mockCSFortune.mockReturnValue(3)
      mockCSMaxFortune.mockReturnValue(15)

      render(
        <ActionValueDisplay
          name="Fortune"
          label="Fortune"
          description="Character fortune"
          character={mockCharacter}
        />
      )

      expect(screen.getByText('3 / 15')).toBeInTheDocument()
    })
  })

  describe('service integration', () => {
    it('should call CharacterEffectService with correct parameters', () => {
      render(
        <ActionValueDisplay
          name="Defense"
          label="Defense"
          description="Defensive skill"
          character={mockCharacter}
        />
      )

      expect(mockCESAdjustedActionValue).toHaveBeenCalledWith(
        mockCharacter,
        'Defense',
        expect.objectContaining({ id: 'test-fight' }),
        undefined
      )
    })

    it('should handle ignoreImpairments parameter', () => {
      render(
        <ActionValueDisplay
          name="Defense"
          label="Defense"
          description="Defensive skill"
          character={mockCharacter}
          ignoreImpairments={true}
        />
      )

      expect(mockCESAdjustedActionValue).toHaveBeenCalledWith(
        mockCharacter,
        'Defense',
        expect.objectContaining({ id: 'test-fight' }),
        true
      )
    })

    it('should use adjusted action value from service', () => {
      mockCESAdjustedActionValue.mockReturnValue([2, 16]) // +2 change, final value 16

      render(
        <ActionValueDisplay
          name="Defense"
          label="Defense"
          description="Defensive skill"
          character={mockCharacter}
        />
      )

      expect(screen.getByText('16')).toBeInTheDocument()
    })
  })

  describe('color logic', () => {
    it('should apply green color for positive changes', () => {
      mockCESAdjustedActionValue.mockReturnValue([3, 15]) // +3 change

      const { container } = render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={mockCharacter}
        />
      )

      const label = screen.getByText('Guns')
      expect(label).toHaveStyle('color: rgb(0, 128, 0)')
      
      const value = screen.getByText('15')
      expect(value).toHaveStyle('color: rgb(0, 128, 0)')
    })

    it('should apply red color for negative changes', () => {
      mockCESAdjustedActionValue.mockReturnValue([-2, 10]) // -2 change

      const { container } = render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={mockCharacter}
        />
      )

      const label = screen.getByText('Guns')
      expect(label).toHaveStyle('color: rgb(255, 0, 0)')
      
      const value = screen.getByText('10')
      expect(value).toHaveStyle('color: rgb(255, 0, 0)')
    })

    it('should apply inherit color for no change', () => {
      mockCESAdjustedActionValue.mockReturnValue([0, 12]) // no change

      const { container } = render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={mockCharacter}
        />
      )

      const label = screen.getByText('Guns')
      expect(label).toHaveStyle('color: inherit')
      
      const value = screen.getByText('12')
      expect(value).toHaveStyle('color: inherit')
    })
  })

  describe('Material-UI components', () => {
    it('should render Typography components', () => {
      const { container } = render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={mockCharacter}
        />
      )

      const typographies = container.querySelectorAll('.MuiTypography-root')
      expect(typographies.length).toBe(2) // label and value
    })

    it('should apply correct Typography variants', () => {
      const { container } = render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={mockCharacter}
        />
      )

      const labelTypography = container.querySelector('.MuiTypography-body1')
      expect(labelTypography).toBeInTheDocument()
    })

    it('should accept custom sx prop', () => {
      const customSx = { margin: 2 }

      render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={mockCharacter}
          sx={customSx}
        />
      )

      // Component should render without error with sx prop
      expect(screen.getByText('Guns')).toBeInTheDocument()
    })
  })

  describe('impairments handling', () => {
    it('should use character impairments by default', () => {
      const characterWithImpairments = {
        ...mockCharacter,
        impairments: 5
      }

      render(
        <ActionValueDisplay
          name="Defense"
          label="Defense"
          description="Defensive skill"
          character={characterWithImpairments}
        />
      )

      expect(mockCESAdjustedActionValue).toHaveBeenCalledWith(
        characterWithImpairments,
        'Defense',
        expect.any(Object),
        undefined
      )
    })

    it('should ignore impairments when ignoreImpairments is true', () => {
      const characterWithImpairments = {
        ...mockCharacter,
        impairments: 5
      }

      render(
        <ActionValueDisplay
          name="Defense"
          label="Defense"
          description="Defensive skill"
          character={characterWithImpairments}
          ignoreImpairments={true}
        />
      )

      expect(mockCESAdjustedActionValue).toHaveBeenCalledWith(
        characterWithImpairments,
        'Defense',
        expect.any(Object),
        true
      )
    })
  })

  describe('edge cases', () => {
    it('should handle undefined action values gracefully', () => {
      const characterWithUndefinedValues = {
        ...mockCharacter,
        action_values: {
          ...mockCharacter.action_values,
          Guns: undefined as any
        }
      }

      const { container } = render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={characterWithUndefinedValues}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('should handle missing action_values object', () => {
      const characterWithoutActionValues = {
        ...mockCharacter,
        action_values: {} as any
      }

      const { container } = render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={characterWithoutActionValues}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('should handle very large values', () => {
      mockCESAdjustedActionValue.mockReturnValue([50, 999])

      render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={mockCharacter}
        />
      )

      expect(screen.getByText('999')).toBeInTheDocument()
    })

    it('should handle negative final values', () => {
      mockCESAdjustedActionValue.mockReturnValue([-15, -3])

      render(
        <ActionValueDisplay
          name="Guns"
          label="Guns"
          description="Shooting skill"
          character={mockCharacter}
        />
      )

      expect(screen.getByText('-3')).toBeInTheDocument()
    })

    it('should handle Fortune with zero values', () => {
      mockCSFortune.mockReturnValue(0)
      mockCSMaxFortune.mockReturnValue(0)

      render(
        <ActionValueDisplay
          name="Fortune"
          label="Fortune"
          description="Character fortune"
          character={mockCharacter}
        />
      )

      expect(screen.getByText('0 / 0')).toBeInTheDocument()
    })
  })
})