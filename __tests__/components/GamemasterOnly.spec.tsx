import React from 'react'
import { render, screen } from '@testing-library/react'
import GamemasterOnly from '../../components/GamemasterOnly'
import { useCampaign } from '../../contexts/CampaignContext'
import { User, Campaign, Character } from '../../types/types'

// Mock the CampaignContext hook
jest.mock('../../contexts/CampaignContext', () => ({
  useCampaign: jest.fn()
}))

const mockUseCampaign = useCampaign as jest.MockedFunction<typeof useCampaign>

describe('GamemasterOnly', () => {
  const mockGamemaster = { id: 'gm-1', gamemaster: true } as User
  const mockPlayer = { id: 'player-1', gamemaster: false } as User
  const mockCampaign = { id: 'campaign-1', gamemaster: mockGamemaster } as Campaign
  const TestContent = () => <div>Test Content</div>
  const ExceptContent = () => <div>Except Content</div>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('PC/Ally character logic', () => {
    it('should render children when character is PC regardless of user', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })
      const pcCharacter = { 
        id: 'char-1', 
        name: 'PC Character', 
        action_values: { Type: 'PC' } 
      } as Character

      render(
        <GamemasterOnly user={mockPlayer} character={pcCharacter}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render children when character is Ally regardless of user', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })
      const allyCharacter = { 
        id: 'char-2', 
        name: 'Ally Character', 
        action_values: { Type: 'Ally' } 
      } as Character

      render(
        <GamemasterOnly user={mockGamemaster} character={allyCharacter}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render children when character is PC even if user is not gamemaster', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })
      const pcCharacter = { 
        id: 'char-1', 
        name: 'PC Character', 
        action_values: { Type: 'PC' } 
      } as Character

      render(
        <GamemasterOnly user={mockPlayer} character={pcCharacter}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })

  describe('gamemaster of current campaign logic', () => {
    it('should render children when user is gamemaster of current campaign', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockGamemaster}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should not render children when user is not gamemaster of current campaign', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockPlayer}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('should not render children when user is gamemaster but not of current campaign', () => {
      const otherGamemaster = { id: 'gm-2', gamemaster: true } as User
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={otherGamemaster}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('should not render children when user is not a gamemaster at all', () => {
      const nonGamemaster = { id: 'user-1', gamemaster: false } as User
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={nonGamemaster}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })
  })

  describe('no current campaign logic', () => {
    it('should render children when no current campaign and user is gamemaster', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: null,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockGamemaster}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should not render children when no current campaign and user is not gamemaster', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: null,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockPlayer}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })
  })

  describe('override logic', () => {
    it('should render children when override is true regardless of other conditions', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockPlayer} override={true}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should not render children when override is false', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockPlayer} override={false}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })
  })

  describe('except prop logic', () => {
    it('should render except content when conditions are not met', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockPlayer} except={<ExceptContent />}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
      expect(screen.getByText('Except Content')).toBeInTheDocument()
    })

    it('should render main content when conditions are met, ignoring except', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockGamemaster} except={<ExceptContent />}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(screen.queryByText('Except Content')).not.toBeInTheDocument()
    })

    it('should render nothing when no except prop and conditions not met', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockPlayer}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('should handle null except prop', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockPlayer} except={null}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle null user gracefully', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={null}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('should handle null campaign gracefully', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: null,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockPlayer}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('should handle multiple children correctly', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockGamemaster}>
          <div>Child 1</div>
          <div>Child 2</div>
          <span>Child 3</span>
        </GamemasterOnly>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })

    it('should handle text children correctly', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockGamemaster}>
          Just some text content
        </GamemasterOnly>
      )

      expect(screen.getByText('Just some text content')).toBeInTheDocument()
    })
  })

  describe('complex authorization scenarios', () => {
    it('should prioritize PC/Ally character check over gamemaster check', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })
      const pcCharacter = { 
        id: 'char-1', 
        name: 'PC Character', 
        action_values: { Type: 'PC' } 
      } as Character

      // Even though user is not gamemaster, PC character should allow access
      render(
        <GamemasterOnly user={mockPlayer} character={pcCharacter}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should handle character with missing action_values', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })
      const characterWithoutType = { 
        id: 'char-4', 
        name: 'Character', 
        action_values: {} 
      } as any

      render(
        <GamemasterOnly user={mockPlayer} character={characterWithoutType}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('should handle character with null action_values Type', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })
      const characterWithNullType = { 
        id: 'char-5', 
        name: 'Character', 
        action_values: { Type: null } 
      } as any

      render(
        <GamemasterOnly user={mockPlayer} character={characterWithNullType}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('should handle override with except prop', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <GamemasterOnly user={mockPlayer} override={true} except={<ExceptContent />}>
          <TestContent />
        </GamemasterOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(screen.queryByText('Except Content')).not.toBeInTheDocument()
    })
  })
})