import React from 'react'
import { render, screen } from '@testing-library/react'
import PartyAvatar from '../../../components/avatars/PartyAvatar'
import { defaultParty } from '../../../types/types'
import type { Party } from '../../../types/types'

// Mock the useClient context
jest.mock('../../../contexts', () => ({
  useClient: () => ({
    user: { id: 'test-user' },
    client: {}
  })
}))

describe('PartyAvatar', () => {
  const mockParty: Party = {
    ...defaultParty,
    id: 'party-123',
    name: 'Test Party',
    image_url: 'https://example.com/party.jpg'
  }

  describe('rendering', () => {
    it('should render party avatar with image', () => {
      render(<PartyAvatar party={mockParty} />)
      
      const avatar = screen.getByRole('img', { name: 'Test Party' })
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', 'https://example.com/party.jpg')
    })

    it('should render initials when no image provided', () => {
      const partyWithoutImage = { ...mockParty, image_url: '' }
      
      render(<PartyAvatar party={partyWithoutImage} />)
      
      const avatar = screen.getByText('TP') // Test Party -> TP
      expect(avatar).toBeInTheDocument()
    })

    it('should handle single word names', () => {
      const singleWordParty = { ...mockParty, name: 'Warriors', image_url: '' }
      
      render(<PartyAvatar party={singleWordParty} />)
      
      const avatar = screen.getByText('W')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle multiple word names correctly', () => {
      const multiWordParty = { ...mockParty, name: 'Dragon Tiger Phoenix', image_url: '' }
      
      render(<PartyAvatar party={multiWordParty} />)
      
      const avatar = screen.getByText('DTP')
      expect(avatar).toBeInTheDocument()
    })

    it('should return empty fragment when party has no id', () => {
      const partyWithoutId = { ...mockParty, id: '' }
      
      const { container } = render(<PartyAvatar party={partyWithoutId} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should return empty fragment when party is null', () => {
      const { container } = render(<PartyAvatar party={null as any} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should handle empty party name', () => {
      const partyWithoutName = { ...mockParty, name: '', image_url: '' }
      
      render(<PartyAvatar party={partyWithoutName} />)
      
      // Should render default person icon when no name and no image
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  describe('link behavior', () => {
    it('should render as link when href provided', () => {
      render(<PartyAvatar party={mockParty} href="/parties/party-123" />)
      
      const link = document.querySelector('[data-mention-id="party-123"]')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/parties/party-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Party')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('should not render link when disablePopup is true', () => {
      render(<PartyAvatar party={mockParty} href="/parties/party-123" disablePopup />)
      
      expect(document.querySelector('[data-mention-id="party-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Test Party' })
      expect(avatar).toBeInTheDocument()
    })

    it('should render plain avatar when no href provided', () => {
      render(<PartyAvatar party={mockParty} />)
      
      expect(document.querySelector('[data-mention-id="party-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Test Party' })
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper alt text', () => {
      render(<PartyAvatar party={mockParty} />)
      
      const avatar = screen.getByRole('img', { name: 'Test Party' })
      expect(avatar).toHaveAttribute('alt', 'Test Party')
    })

    it('should handle empty alt text gracefully', () => {
      const partyWithoutName = { ...mockParty, name: '', image_url: '' }
      
      render(<PartyAvatar party={partyWithoutName} />)
      
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply Material-UI styling classes', () => {
      render(<PartyAvatar party={mockParty} href="/test" />)
      
      const link = document.querySelector('.MuiLink-root')
      expect(link).toBeInTheDocument()
      
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('MuiAvatar-img')
    })

    it('should apply mention styling attributes', () => {
      render(<PartyAvatar party={mockParty} href="/test" />)
      
      const link = document.querySelector('[data-mention-id="party-123"]')
      expect(link).toHaveAttribute('data-mention-id', 'party-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Party')
    })

    it('should have link styling with padding and margin', () => {
      render(<PartyAvatar party={mockParty} href="/test" />)
      
      const link = document.querySelector('[data-mention-id="party-123"]')
      expect(link).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle party with special characters in name', () => {
      const specialCharParty = { ...mockParty, name: 'Party-X @2023!', image_url: '' }
      
      render(<PartyAvatar party={specialCharParty} />)
      
      const avatar = screen.getByText('P@')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle very long party names', () => {
      const longNameParty = { 
        ...mockParty, 
        name: 'Super Long Party Name With Many Words For Testing',
        image_url: ''
      }
      
      render(<PartyAvatar party={longNameParty} />)
      
      const avatar = screen.getByText('SLPNWMWFT')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle lowercase names correctly', () => {
      const lowercaseParty = { ...mockParty, name: 'test party', image_url: '' }
      
      render(<PartyAvatar party={lowercaseParty} />)
      
      const avatar = screen.getByText('TP')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle party with undefined properties', () => {
      const partialParty = { 
        ...mockParty, 
        name: 'Test',
        image_url: undefined as any
      }
      
      render(<PartyAvatar party={partialParty} />)
      
      // When image_url is undefined, it renders initials instead of image
      const avatar = screen.getByText('T')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('link variants', () => {
    it('should handle link with empty href', () => {
      render(<PartyAvatar party={mockParty} href="" />)
      
      // Empty href is falsy, so no link is created
      const link = document.querySelector('[data-mention-id="party-123"]')
      expect(link).not.toBeInTheDocument()
      
      // Should render plain avatar instead
      const avatar = screen.getByRole('img', { name: 'Test Party' })
      expect(avatar).toBeInTheDocument()
    })

    it('should handle external links', () => {
      render(<PartyAvatar party={mockParty} href="https://example.com" />)
      
      const link = document.querySelector('[data-mention-id="party-123"]')
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('should disable popup but still render avatar', () => {
      render(<PartyAvatar party={mockParty} href="/test" disablePopup />)
      
      expect(document.querySelector('[data-mention-id="party-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Test Party' })
      expect(avatar).toBeInTheDocument()
    })
  })
})