import React from 'react'
import { render, screen } from '@testing-library/react'
import PlayerOnly from '../../components/PlayerOnly'
import { useCampaign } from '../../contexts/CampaignContext'
import { User, Campaign, Character } from '../../types/types'

// Mock the CampaignContext hook
jest.mock('../../contexts/CampaignContext', () => ({
  useCampaign: jest.fn()
}))

const mockUseCampaign = useCampaign as jest.MockedFunction<typeof useCampaign>

describe('PlayerOnly', () => {
  const mockGamemaster = { id: 'gm-1', gamemaster: true } as User
  const mockPlayer = { id: 'player-1', gamemaster: false } as User
  const mockCampaign = { id: 'campaign-1', gamemaster: mockGamemaster } as Campaign
  const TestContent = () => <div>Test Content</div>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('PC/Ally character logic', () => {
    it('should render children when user is not gamemaster and character is PC', () => {
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
        <PlayerOnly user={mockPlayer} character={pcCharacter}>
          <TestContent />
        </PlayerOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render children when user is not gamemaster and character is Ally', () => {
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
        <PlayerOnly user={mockPlayer} character={allyCharacter}>
          <TestContent />
        </PlayerOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should not render children when user is gamemaster and character is PC', () => {
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
        <PlayerOnly user={mockGamemaster} character={pcCharacter}>
          <TestContent />
        </PlayerOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('should render children when character is not PC or Ally but user is not gamemaster', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })
      const npcCharacter = { 
        id: 'char-3', 
        name: 'NPC Character', 
        action_values: { Type: 'NPC' } 
      } as Character

      render(
        <PlayerOnly user={mockPlayer} character={npcCharacter}>
          <TestContent />
        </PlayerOnly>
      )

      // Should render because user is not gamemaster and condition 2 applies
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })

  describe('campaign gamemaster logic', () => {
    it('should render children when user is not gamemaster of current campaign and not a gamemaster', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <PlayerOnly user={mockPlayer}>
          <TestContent />
        </PlayerOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should not render children when user is gamemaster of current campaign', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <PlayerOnly user={mockGamemaster}>
          <TestContent />
        </PlayerOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })

    it('should not render children when user is a gamemaster but not of current campaign', () => {
      const otherGamemaster = { id: 'gm-2', gamemaster: true } as User
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <PlayerOnly user={otherGamemaster}>
          <TestContent />
        </PlayerOnly>
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
        <PlayerOnly user={mockGamemaster}>
          <TestContent />
        </PlayerOnly>
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
        <PlayerOnly user={mockPlayer}>
          <TestContent />
        </PlayerOnly>
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
        <PlayerOnly user={mockGamemaster} override={true}>
          <TestContent />
        </PlayerOnly>
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
        <PlayerOnly user={mockGamemaster} override={false}>
          <TestContent />
        </PlayerOnly>
      )

      expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should render children when user is null (due to logic conditions)', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: mockCampaign,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <PlayerOnly user={null}>
          <TestContent />
        </PlayerOnly>
      )

      // With null user, condition 2 passes: campaign?.id && campaign.gamemaster?.id !== user?.id && !user?.gamemaster
      // true && true && true = true, so content will render
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should handle null campaign gracefully', () => {
      mockUseCampaign.mockReturnValue({ 
        campaign: null,
        setCurrentCampaign: jest.fn(),
        getCurrentCampaign: jest.fn()
      })

      render(
        <PlayerOnly user={mockPlayer}>
          <TestContent />
        </PlayerOnly>
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
        <PlayerOnly user={mockPlayer}>
          <div>Child 1</div>
          <div>Child 2</div>
          <span>Child 3</span>
        </PlayerOnly>
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
        <PlayerOnly user={mockPlayer}>
          Just some text content
        </PlayerOnly>
      )

      expect(screen.getByText('Just some text content')).toBeInTheDocument()
    })
  })

  describe('complex authorization scenarios', () => {
    it('should prioritize PC/Ally character check over other conditions', () => {
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

      // Even though user is not gamemaster of campaign, PC character should allow access
      render(
        <PlayerOnly user={mockPlayer} character={pcCharacter}>
          <TestContent />
        </PlayerOnly>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render children when character has missing action_values but user is not gamemaster', () => {
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
        <PlayerOnly user={mockPlayer} character={characterWithoutType}>
          <TestContent />
        </PlayerOnly>
      )

      // Should render because first condition fails, but second condition passes
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render children when character has null action_values Type but user is not gamemaster', () => {
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
        <PlayerOnly user={mockPlayer} character={characterWithNullType}>
          <TestContent />
        </PlayerOnly>
      )

      // Should render because first condition fails, but second condition passes
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })
  })
})