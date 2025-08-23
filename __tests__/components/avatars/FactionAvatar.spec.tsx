import React from 'react'
import { render, screen } from '@testing-library/react'
import FactionAvatar from '../../../components/avatars/FactionAvatar'
import { defaultFaction } from '../../../types/types'
import type { Faction } from '../../../types/types'

// Mock the useClient context
jest.mock('../../../contexts', () => ({
  useClient: () => ({
    user: { id: 'test-user' },
    client: {}
  })
}))

describe('FactionAvatar', () => {
  const mockFaction: Faction = {
    ...defaultFaction,
    id: 'faction-123',
    name: 'Jade Serpent',
    image_url: 'https://example.com/faction.jpg'
  }

  describe('rendering', () => {
    it('should render faction avatar with image', () => {
      render(<FactionAvatar faction={mockFaction} />)
      
      const avatar = screen.getByRole('img', { name: 'Jade Serpent' })
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', 'https://example.com/faction.jpg')
    })

    it('should render initials when no image provided', () => {
      const factionWithoutImage = { ...mockFaction, image_url: '' }
      
      render(<FactionAvatar faction={factionWithoutImage} />)
      
      const avatar = screen.getByText('JS') // Jade Serpent -> JS
      expect(avatar).toBeInTheDocument()
    })

    it('should handle single word names', () => {
      const singleWordFaction = { ...mockFaction, name: 'Dragons', image_url: '' }
      
      render(<FactionAvatar faction={singleWordFaction} />)
      
      const avatar = screen.getByText('D')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle multiple word names correctly', () => {
      const multiWordFaction = { ...mockFaction, name: 'Red Tiger Phoenix Society', image_url: '' }
      
      render(<FactionAvatar faction={multiWordFaction} />)
      
      const avatar = screen.getByText('RTPS')
      expect(avatar).toBeInTheDocument()
    })

    it('should return empty fragment when faction has no id', () => {
      const factionWithoutId = { ...mockFaction, id: '' }
      
      const { container } = render(<FactionAvatar faction={factionWithoutId} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should return empty fragment when faction is null', () => {
      const { container } = render(<FactionAvatar faction={null as any} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should handle empty faction name', () => {
      const factionWithoutName = { ...mockFaction, name: '', image_url: '' }
      
      render(<FactionAvatar faction={factionWithoutName} />)
      
      // Should render default person icon when no name and no image
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toBeInTheDocument()
    })

    it('should have mention data attributes on avatar container', () => {
      render(<FactionAvatar faction={mockFaction} />)
      
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toHaveAttribute('data-mention-id', 'faction-123')
      expect(avatarContainer).toHaveAttribute('data-mention-class-name', 'Faction')
    })
  })

  describe('link behavior', () => {
    it('should render as link when href provided', () => {
      render(<FactionAvatar faction={mockFaction} href="/factions/faction-123" />)
      
      const link = document.querySelector('a[data-mention-id="faction-123"]')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/factions/faction-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Faction')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('should not render link when disablePopup is true', () => {
      render(<FactionAvatar faction={mockFaction} href="/factions/faction-123" disablePopup />)
      
      expect(document.querySelector('a[data-mention-id="faction-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Jade Serpent' })
      expect(avatar).toBeInTheDocument()
      // Avatar container should still have mention attributes even without link
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toHaveAttribute('data-mention-id', 'faction-123')
    })

    it('should render plain avatar when no href provided', () => {
      render(<FactionAvatar faction={mockFaction} />)
      
      expect(document.querySelector('a[data-mention-id="faction-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Jade Serpent' })
      expect(avatar).toBeInTheDocument()
      // Avatar container should still have mention attributes
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toHaveAttribute('data-mention-id', 'faction-123')
    })
  })

  describe('accessibility', () => {
    it('should have proper alt text', () => {
      render(<FactionAvatar faction={mockFaction} />)
      
      const avatar = screen.getByRole('img', { name: 'Jade Serpent' })
      expect(avatar).toHaveAttribute('alt', 'Jade Serpent')
    })

    it('should handle empty alt text gracefully', () => {
      const factionWithoutName = { ...mockFaction, name: '', image_url: '' }
      
      render(<FactionAvatar faction={factionWithoutName} />)
      
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply Material-UI styling classes', () => {
      render(<FactionAvatar faction={mockFaction} href="/test" />)
      
      const link = document.querySelector('.MuiLink-root')
      expect(link).toBeInTheDocument()
      
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('MuiAvatar-img')
    })

    it('should apply mention styling attributes on both link and avatar', () => {
      render(<FactionAvatar faction={mockFaction} href="/test" />)
      
      const link = document.querySelector('a[data-mention-id="faction-123"]')
      expect(link).toHaveAttribute('data-mention-id', 'faction-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Faction')
      
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toHaveAttribute('data-mention-id', 'faction-123')
      expect(avatarContainer).toHaveAttribute('data-mention-class-name', 'Faction')
    })

    it('should have link styling with padding and margin', () => {
      render(<FactionAvatar faction={mockFaction} href="/test" />)
      
      const link = document.querySelector('a[data-mention-id="faction-123"]')
      expect(link).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle faction with special characters in name', () => {
      const specialCharFaction = { ...mockFaction, name: 'Faction-X @2023!', image_url: '' }
      
      render(<FactionAvatar faction={specialCharFaction} />)
      
      const avatar = screen.getByText('F@')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle very long faction names', () => {
      const longNameFaction = { 
        ...mockFaction, 
        name: 'Super Long Faction Name With Many Words For Testing',
        image_url: ''
      }
      
      render(<FactionAvatar faction={longNameFaction} />)
      
      const avatar = screen.getByText('SLFNWMWFT')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle lowercase names correctly', () => {
      const lowercaseFaction = { ...mockFaction, name: 'test faction', image_url: '' }
      
      render(<FactionAvatar faction={lowercaseFaction} />)
      
      const avatar = screen.getByText('TF')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle faction with undefined properties', () => {
      const partialFaction = { 
        ...mockFaction, 
        name: 'Test',
        image_url: undefined as any
      }
      
      render(<FactionAvatar faction={partialFaction} />)
      
      // When image_url is undefined, it renders initials instead of image
      const avatar = screen.getByText('T')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('link variants', () => {
    it('should handle link with empty href', () => {
      render(<FactionAvatar faction={mockFaction} href="" />)
      
      // Empty href is falsy, so no link is created
      const link = document.querySelector('a[data-mention-id="faction-123"]')
      expect(link).not.toBeInTheDocument()
      
      // Should render plain avatar instead with mention attributes
      const avatar = screen.getByRole('img', { name: 'Jade Serpent' })
      expect(avatar).toBeInTheDocument()
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toHaveAttribute('data-mention-id', 'faction-123')
    })

    it('should handle external links', () => {
      render(<FactionAvatar faction={mockFaction} href="https://example.com" />)
      
      const link = document.querySelector('a[data-mention-id="faction-123"]')
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('should disable popup but still render avatar with mention attributes', () => {
      render(<FactionAvatar faction={mockFaction} href="/test" disablePopup />)
      
      expect(document.querySelector('a[data-mention-id="faction-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Jade Serpent' })
      expect(avatar).toBeInTheDocument()
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toHaveAttribute('data-mention-id', 'faction-123')
      expect(avatarContainer).toHaveAttribute('data-mention-class-name', 'Faction')
    })
  })
})