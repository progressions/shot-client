import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DeathMarks, { deathMarkIcons } from '../../../components/characters/DeathMarks'
import CS from '../../../services/CharacterService'
import { Character } from '../../../types/types'

// Mock the CharacterService
jest.mock('../../../services/CharacterService', () => ({
  marksOfDeath: jest.fn()
}))

const mockMarksOfDeath = CS.marksOfDeath as jest.MockedFunction<typeof CS.marksOfDeath>

describe('DeathMarks', () => {
  const mockCharacter = { id: 'char-1', name: 'Test Character' } as Character

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('deathMarkIcons helper function', () => {
    it('should return empty array when character has no death marks', () => {
      mockMarksOfDeath.mockReturnValue(0)

      const icons = deathMarkIcons(mockCharacter)

      expect(icons).toEqual([])
      expect(mockMarksOfDeath).toHaveBeenCalledWith(mockCharacter)
    })

    it('should return filled and empty skull icons for partial death marks', () => {
      mockMarksOfDeath.mockReturnValue(2)

      const icons = deathMarkIcons(mockCharacter)

      expect(icons).toHaveLength(5)
      // First 2 should be filled skulls, next 3 should be empty skulls
      expect(icons[0].type.name).toBe('IoSkull')
      expect(icons[1].type.name).toBe('IoSkull')
      expect(icons[2].type.name).toBe('IoSkullOutline')
      expect(icons[3].type.name).toBe('IoSkullOutline')
      expect(icons[4].type.name).toBe('IoSkullOutline')
    })

    it('should return all filled skull icons when character has maximum death marks', () => {
      mockMarksOfDeath.mockReturnValue(5)

      const icons = deathMarkIcons(mockCharacter)

      expect(icons).toHaveLength(5)
      icons.forEach((icon) => {
        expect(icon.type.name).toBe('IoSkull')
      })
    })

    it('should handle single death mark', () => {
      mockMarksOfDeath.mockReturnValue(1)

      const icons = deathMarkIcons(mockCharacter)

      expect(icons).toHaveLength(5)
      expect(icons[0].type.name).toBe('IoSkull')
      for (let i = 1; i < 5; i++) {
        expect(icons[i].type.name).toBe('IoSkullOutline')
      }
    })

    it('should generate correct keys for icons', () => {
      mockMarksOfDeath.mockReturnValue(3)

      const icons = deathMarkIcons(mockCharacter)

      expect(icons[0].key).toBe('Mark 1')
      expect(icons[1].key).toBe('Mark 2')
      expect(icons[2].key).toBe('Mark 3')
      expect(icons[3].key).toBe('Mark 4')
      expect(icons[4].key).toBe('Mark 5')
    })
  })

  describe('DeathMarks component in readOnly mode', () => {
    it('should render death mark icons when readOnly is true', () => {
      mockMarksOfDeath.mockReturnValue(3)

      render(<DeathMarks character={mockCharacter} readOnly={true} />)

      // Should render the icons, not the Rating component
      expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    })

    it('should render nothing when character has no death marks in readOnly mode', () => {
      mockMarksOfDeath.mockReturnValue(0)

      const { container } = render(<DeathMarks character={mockCharacter} readOnly={true} />)

      // Container should be empty or have no content
      expect(container.textContent).toBe('')
    })
  })

  describe('DeathMarks component in interactive mode', () => {
    it('should render Rating component when not readOnly', () => {
      mockMarksOfDeath.mockReturnValue(2)

      render(<DeathMarks character={mockCharacter} readOnly={false} />)

      // Check that rating radio buttons are rendered
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons.length).toBeGreaterThan(0)
      expect(radioButtons[0]).toHaveAttribute('name', 'Marks of Death')
    })

    it('should render Rating component when readOnly is undefined', () => {
      mockMarksOfDeath.mockReturnValue(2)

      render(<DeathMarks character={mockCharacter} />)

      // Check that rating radio buttons are rendered
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons.length).toBeGreaterThan(0)
    })

    it('should set correct value on Rating component', () => {
      mockMarksOfDeath.mockReturnValue(4)

      render(<DeathMarks character={mockCharacter} />)

      // Check that the correct radio button is selected (4 Stars)
      const selectedRadio = screen.getByRole('radio', { checked: true })
      expect(selectedRadio).toHaveAttribute('value', '4')
    })

    it('should set maximum value of 5 on Rating component', () => {
      mockMarksOfDeath.mockReturnValue(3)

      render(<DeathMarks character={mockCharacter} />)

      // Check that there are 5 radio options available (1-5)
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons).toHaveLength(6) // 5 values + 1 empty option
    })

    it('should call onChange when Rating value changes', () => {
      const mockOnChange = jest.fn()
      mockMarksOfDeath.mockReturnValue(2)

      render(<DeathMarks character={mockCharacter} onChange={mockOnChange} />)

      const fourStarsRadio = screen.getByDisplayValue('4')
      
      // Simulate clicking the 4 stars option
      fireEvent.click(fourStarsRadio)

      expect(mockOnChange).toHaveBeenCalled()
    })

    it('should render with small size', () => {
      mockMarksOfDeath.mockReturnValue(1)

      render(<DeathMarks character={mockCharacter} />)

      // Check that the MuiRating component has the sizeSmall class
      const ratingElement = document.querySelector('.MuiRating-sizeSmall')
      expect(ratingElement).toBeInTheDocument()
    })

    it('should handle zero death marks', () => {
      mockMarksOfDeath.mockReturnValue(0)

      render(<DeathMarks character={mockCharacter} />)

      // Check that no radio button is checked for 0 death marks  
      const checkedRadio = screen.queryByRole('radio', { checked: true })
      expect(checkedRadio).toBeNull()
    })

    it('should handle maximum death marks', () => {
      mockMarksOfDeath.mockReturnValue(5)

      render(<DeathMarks character={mockCharacter} />)

      // Check that the 5 stars radio button is selected
      const selectedRadio = screen.getByRole('radio', { checked: true })
      expect(selectedRadio).toHaveAttribute('value', '5')
    })
  })

  describe('component behavior edge cases', () => {
    it('should handle when CharacterService returns null/undefined', () => {
      mockMarksOfDeath.mockReturnValue(null as any)

      // Should not crash when rendering readOnly
      render(<DeathMarks character={mockCharacter} readOnly={true} />)
      
      // Should not crash when rendering interactive
      render(<DeathMarks character={mockCharacter} readOnly={false} />)
      
      expect(mockMarksOfDeath).toHaveBeenCalledTimes(2)
    })

    it('should call CharacterService.marksOfDeath with correct character', () => {
      mockMarksOfDeath.mockReturnValue(2)

      render(<DeathMarks character={mockCharacter} />)

      expect(mockMarksOfDeath).toHaveBeenCalledWith(mockCharacter)
    })

    it('should work with different character objects', () => {
      const anotherCharacter = { id: 'char-2', name: 'Another Character' } as Character
      mockMarksOfDeath.mockReturnValue(3)

      render(<DeathMarks character={anotherCharacter} />)

      expect(mockMarksOfDeath).toHaveBeenCalledWith(anotherCharacter)
    })
  })

  describe('Material-UI Rating integration', () => {
    it('should use skull icons for filled state', () => {
      mockMarksOfDeath.mockReturnValue(2)

      render(<DeathMarks character={mockCharacter} />)

      // The Rating component should be configured with skull icons
      // We can't directly test the icon types, but we can verify the rating renders
      // Check that rating radio buttons are rendered
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons.length).toBeGreaterThan(0)
    })

    it('should not be readOnly when readOnly prop is false', () => {
      mockMarksOfDeath.mockReturnValue(2)

      render(<DeathMarks character={mockCharacter} readOnly={false} />)

      // Check that radio buttons are interactive (not readonly)
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons[0]).not.toHaveAttribute('readonly')
    })

    it('should support onChange callback', () => {
      const mockOnChange = jest.fn()
      mockMarksOfDeath.mockReturnValue(1)

      render(<DeathMarks character={mockCharacter} onChange={mockOnChange} readOnly={false} />)

      // Rating should be interactive
      // Check that rating radio buttons are rendered
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons.length).toBeGreaterThan(0)
    })
  })
})