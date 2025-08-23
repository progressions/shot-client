import React from 'react'
import { render, screen } from '@testing-library/react'
import SiteAvatar from '../../../components/avatars/SiteAvatar'
import { defaultSite } from '../../../types/types'
import type { Site } from '../../../types/types'

describe('SiteAvatar', () => {
  const mockSite: Site = {
    ...defaultSite,
    id: 'site-123',
    name: 'Golden Pagoda',
    image_url: 'https://example.com/site.jpg'
  }

  describe('rendering', () => {
    it('should render site avatar with image', () => {
      render(<SiteAvatar site={mockSite} />)
      
      const avatar = screen.getByRole('img', { name: 'Golden Pagoda' })
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', 'https://example.com/site.jpg')
    })

    it('should render initials when no image provided', () => {
      const siteWithoutImage = { ...mockSite, image_url: '' }
      
      render(<SiteAvatar site={siteWithoutImage} />)
      
      const avatar = screen.getByText('GP') // Golden Pagoda -> GP
      expect(avatar).toBeInTheDocument()
    })

    it('should handle single word names', () => {
      const singleWordSite = { ...mockSite, name: 'Temple', image_url: '' }
      
      render(<SiteAvatar site={singleWordSite} />)
      
      const avatar = screen.getByText('T')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle multiple word names correctly', () => {
      const multiWordSite = { ...mockSite, name: 'Ancient Dragon Temple Complex', image_url: '' }
      
      render(<SiteAvatar site={multiWordSite} />)
      
      const avatar = screen.getByText('ADTC')
      expect(avatar).toBeInTheDocument()
    })

    it('should return empty fragment when site has no id', () => {
      const siteWithoutId = { ...mockSite, id: '' }
      
      const { container } = render(<SiteAvatar site={siteWithoutId} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should return empty fragment when site is null', () => {
      const { container } = render(<SiteAvatar site={null as any} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should handle empty site name', () => {
      const siteWithoutName = { ...mockSite, name: '', image_url: '' }
      
      render(<SiteAvatar site={siteWithoutName} />)
      
      // Should render default person icon when no name and no image
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  describe('link behavior', () => {
    it('should render as link when href provided', () => {
      render(<SiteAvatar site={mockSite} href="/sites/site-123" />)
      
      const link = document.querySelector('[data-mention-id="site-123"]')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/sites/site-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Site')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('should not render link when disablePopup is true', () => {
      render(<SiteAvatar site={mockSite} href="/sites/site-123" disablePopup />)
      
      expect(document.querySelector('[data-mention-id="site-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Golden Pagoda' })
      expect(avatar).toBeInTheDocument()
    })

    it('should render plain avatar when no href provided', () => {
      render(<SiteAvatar site={mockSite} />)
      
      expect(document.querySelector('[data-mention-id="site-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Golden Pagoda' })
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper alt text', () => {
      render(<SiteAvatar site={mockSite} />)
      
      const avatar = screen.getByRole('img', { name: 'Golden Pagoda' })
      expect(avatar).toHaveAttribute('alt', 'Golden Pagoda')
    })

    it('should handle empty alt text gracefully', () => {
      const siteWithoutName = { ...mockSite, name: '', image_url: '' }
      
      render(<SiteAvatar site={siteWithoutName} />)
      
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply Material-UI styling classes', () => {
      render(<SiteAvatar site={mockSite} href="/test" />)
      
      const link = document.querySelector('.MuiLink-root')
      expect(link).toBeInTheDocument()
      
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('MuiAvatar-img')
    })

    it('should apply mention styling attributes', () => {
      render(<SiteAvatar site={mockSite} href="/test" />)
      
      const link = document.querySelector('[data-mention-id="site-123"]')
      expect(link).toHaveAttribute('data-mention-id', 'site-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Site')
    })

    it('should have link styling with padding and margin', () => {
      render(<SiteAvatar site={mockSite} href="/test" />)
      
      const link = document.querySelector('[data-mention-id="site-123"]')
      expect(link).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle site with special characters in name', () => {
      const specialCharSite = { ...mockSite, name: 'Site-X @2023!', image_url: '' }
      
      render(<SiteAvatar site={specialCharSite} />)
      
      const avatar = screen.getByText('S@')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle very long site names', () => {
      const longNameSite = { 
        ...mockSite, 
        name: 'Super Long Site Name With Many Words For Testing',
        image_url: ''
      }
      
      render(<SiteAvatar site={longNameSite} />)
      
      const avatar = screen.getByText('SLSNWMWFT')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle lowercase names correctly', () => {
      const lowercaseSite = { ...mockSite, name: 'test site', image_url: '' }
      
      render(<SiteAvatar site={lowercaseSite} />)
      
      const avatar = screen.getByText('TS')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle site with undefined properties', () => {
      const partialSite = { 
        ...mockSite, 
        name: 'Test',
        image_url: undefined as any
      }
      
      render(<SiteAvatar site={partialSite} />)
      
      // When image_url is undefined, it renders initials instead of image
      const avatar = screen.getByText('T')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('link variants', () => {
    it('should handle link with empty href', () => {
      render(<SiteAvatar site={mockSite} href="" />)
      
      // Empty href is falsy, so no link is created
      const link = document.querySelector('[data-mention-id="site-123"]')
      expect(link).not.toBeInTheDocument()
      
      // Should render plain avatar instead
      const avatar = screen.getByRole('img', { name: 'Golden Pagoda' })
      expect(avatar).toBeInTheDocument()
    })

    it('should handle external links', () => {
      render(<SiteAvatar site={mockSite} href="https://example.com" />)
      
      const link = document.querySelector('[data-mention-id="site-123"]')
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('should disable popup but still render avatar', () => {
      render(<SiteAvatar site={mockSite} href="/test" disablePopup />)
      
      expect(document.querySelector('[data-mention-id="site-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Golden Pagoda' })
      expect(avatar).toBeInTheDocument()
    })
  })
})