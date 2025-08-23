import React from 'react'
import { render, screen } from '@testing-library/react'
import PlayerTypeOnly from '../../components/PlayerTypeOnly'
import CS from '../../services/CharacterService'
import { Character, CharacterType } from '../../types/types'

// Mock the CharacterService
jest.mock('../../services/CharacterService', () => ({
  isType: jest.fn()
}))

const mockIsType = CS.isType as jest.MockedFunction<typeof CS.isType>

describe('PlayerTypeOnly', () => {
  const mockCharacter = { id: 'char-1', name: 'Test Character' } as Character
  const TestContent = () => <div>Test Content</div>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('with "only" prop', () => {
    it('should render children when character matches single type', () => {
      mockIsType.mockReturnValue(true)

      render(
        <PlayerTypeOnly character={mockCharacter} only="PC">
          <TestContent />
        </PlayerTypeOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, 'PC')
    })

    it('should not render children when character does not match single type', () => {
      mockIsType.mockReturnValue(false)

      render(
        <PlayerTypeOnly character={mockCharacter} only="PC">
          <TestContent />
        </PlayerTypeOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, 'PC')
    })

    it('should render children when character matches one of multiple types', () => {
      mockIsType.mockReturnValue(true)

      render(
        <PlayerTypeOnly character={mockCharacter} only={['PC', 'Ally']}>
          <TestContent />
        </PlayerTypeOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, ['PC', 'Ally'])
    })

    it('should not render children when character matches none of multiple types', () => {
      mockIsType.mockReturnValue(false)

      render(
        <PlayerTypeOnly character={mockCharacter} only={['Boss', 'Uber-Boss']}>
          <TestContent />
        </PlayerTypeOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, ['Boss', 'Uber-Boss'])
    })
  })

  describe('with "except" prop', () => {
    it('should render children when character does not match excluded type', () => {
      mockIsType.mockReturnValue(false) // NOT the excluded type

      render(
        <PlayerTypeOnly character={mockCharacter} except="Boss">
          <TestContent />
        </PlayerTypeOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, 'Boss')
    })

    it('should not render children when character matches excluded type', () => {
      mockIsType.mockReturnValue(true) // IS the excluded type

      render(
        <PlayerTypeOnly character={mockCharacter} except="Boss">
          <TestContent />
        </PlayerTypeOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, 'Boss')
    })

    it('should render children when character does not match any excluded types', () => {
      mockIsType.mockReturnValue(false) // NOT any of the excluded types

      render(
        <PlayerTypeOnly character={mockCharacter} except={['Boss', 'Uber-Boss', 'Mook']}>
          <TestContent />
        </PlayerTypeOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, ['Boss', 'Uber-Boss', 'Mook'])
    })

    it('should not render children when character matches one of excluded types', () => {
      mockIsType.mockReturnValue(true) // IS one of the excluded types

      render(
        <PlayerTypeOnly character={mockCharacter} except={['Boss', 'Uber-Boss', 'Mook']}>
          <TestContent />
        </PlayerTypeOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, ['Boss', 'Uber-Boss', 'Mook'])
    })
  })

  describe('edge cases', () => {
    it('should not render children when no "only" or "except" props provided', () => {
      render(
        <PlayerTypeOnly character={mockCharacter}>
          <TestContent />
        </PlayerTypeOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
      expect(mockIsType).not.toHaveBeenCalled()
    })

    it('should handle multiple children correctly', () => {
      mockIsType.mockReturnValue(true)

      render(
        <PlayerTypeOnly character={mockCharacter} only="PC">
          <div>Child 1</div>
          <div>Child 2</div>
          <span>Child 3</span>
        </PlayerTypeOnly>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })

    it('should handle text children correctly', () => {
      mockIsType.mockReturnValue(true)

      render(
        <PlayerTypeOnly character={mockCharacter} only="PC">
          Just some text content
        </PlayerTypeOnly>
      )

      expect(screen.getByText('Just some text content')).toBeInTheDocument()
    })
  })

  describe('component logic priority', () => {
    it('should prioritize "only" prop over "except" when both provided', () => {
      // Setup: character IS a PC (matches "only") AND IS a PC (matches "except")
      mockIsType.mockReturnValue(true)

      render(
        <PlayerTypeOnly character={mockCharacter} only="PC" except="PC">
          <TestContent />
        </PlayerTypeOnly>
      )

      // Should render because "only" logic executes first and returns true
      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, 'PC')
      expect(mockIsType).toHaveBeenCalledTimes(1) // Only called once for "only" check
    })

    it('should check "except" when "only" is false', () => {
      // Setup: character is NOT a PC (fails "only") but IS a boss (matches "except")
      mockIsType
        .mockReturnValueOnce(false) // First call for "only" check
        .mockReturnValueOnce(true)  // Second call for "except" check

      render(
        <PlayerTypeOnly character={mockCharacter} only="PC" except="Boss">
          <TestContent />
        </PlayerTypeOnly>
      )

      // Should not render because "except" logic returns false (character IS a boss)
      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, 'PC')
      expect(mockIsType).toHaveBeenCalledWith(mockCharacter, 'Boss')
      expect(mockIsType).toHaveBeenCalledTimes(2)
    })
  })
})