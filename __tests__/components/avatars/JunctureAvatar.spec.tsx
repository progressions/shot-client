import React from 'react'
import { render, screen } from '@testing-library/react'
import JunctureAvatar from '../../../components/avatars/JunctureAvatar'
import { defaultJuncture } from '../../../types/types'
import type { Juncture } from '../../../types/types'

describe('JunctureAvatar', () => {
  const mockJuncture: Juncture = {
    ...defaultJuncture,
    id: 'juncture-123',
    name: 'Ancient Juncture',
    image_url: 'https://example.com/juncture.jpg'
  }

  describe('rendering', () => {
    it('should render juncture avatar with image', () => {
      render(<JunctureAvatar juncture={mockJuncture} />)
      
      const avatar = screen.getByRole('img', { name: 'Ancient Juncture' })
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', 'https://example.com/juncture.jpg')
    })

    it('should render initials when no image provided', () => {
      const junctureWithoutImage = { ...mockJuncture, image_url: '' }
      
      render(<JunctureAvatar juncture={junctureWithoutImage} />)
      
      const avatar = screen.getByText('AJ') // Ancient Juncture -> AJ
      expect(avatar).toBeInTheDocument()
    })

    it('should handle single word names', () => {
      const singleWordJuncture = { ...mockJuncture, name: 'Contemporary', image_url: '' }
      
      render(<JunctureAvatar juncture={singleWordJuncture} />)
      
      const avatar = screen.getByText('C')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle multiple word names correctly', () => {
      const multiWordJuncture = { ...mockJuncture, name: 'Future Tech Era', image_url: '' }
      
      render(<JunctureAvatar juncture={multiWordJuncture} />)
      
      const avatar = screen.getByText('FTE')
      expect(avatar).toBeInTheDocument()
    })

    it('should return empty fragment when juncture has no id', () => {
      const junctureWithoutId = { ...mockJuncture, id: '' }
      
      const { container } = render(<JunctureAvatar juncture={junctureWithoutId} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should return empty fragment when juncture is null', () => {
      const { container } = render(<JunctureAvatar juncture={null as any} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should handle empty juncture name', () => {
      const junctureWithoutName = { ...mockJuncture, name: '', image_url: '' }
      
      render(<JunctureAvatar juncture={junctureWithoutName} />)
      
      // Should render default person icon when no name and no image
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  describe('link behavior', () => {
    it('should render as link when href provided', () => {
      render(<JunctureAvatar juncture={mockJuncture} href="/junctures/juncture-123" />)
      
      const link = document.querySelector('[data-mention-id="juncture-123"]')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/junctures/juncture-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Juncture')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('should not render link when disablePopup is true', () => {
      render(<JunctureAvatar juncture={mockJuncture} href="/junctures/juncture-123" disablePopup />)
      
      expect(document.querySelector('[data-mention-id="juncture-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Ancient Juncture' })
      expect(avatar).toBeInTheDocument()
    })

    it('should render plain avatar when no href provided', () => {
      render(<JunctureAvatar juncture={mockJuncture} />)
      
      expect(document.querySelector('[data-mention-id="juncture-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Ancient Juncture' })
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper alt text', () => {
      render(<JunctureAvatar juncture={mockJuncture} />)
      
      const avatar = screen.getByRole('img', { name: 'Ancient Juncture' })
      expect(avatar).toHaveAttribute('alt', 'Ancient Juncture')
    })

    it('should handle empty alt text gracefully', () => {
      const junctureWithoutName = { ...mockJuncture, name: '', image_url: '' }
      
      render(<JunctureAvatar juncture={junctureWithoutName} />)
      
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply Material-UI styling classes', () => {
      render(<JunctureAvatar juncture={mockJuncture} href="/test" />)
      
      const link = document.querySelector('.MuiLink-root')
      expect(link).toBeInTheDocument()
      
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('MuiAvatar-img')
    })

    it('should apply mention styling attributes', () => {
      render(<JunctureAvatar juncture={mockJuncture} href="/test" />)
      
      const link = document.querySelector('[data-mention-id="juncture-123"]')
      expect(link).toHaveAttribute('data-mention-id', 'juncture-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Juncture')
    })

    it('should have link styling with padding and margin', () => {
      render(<JunctureAvatar juncture={mockJuncture} href="/test" />)
      
      const link = document.querySelector('[data-mention-id="juncture-123"]')
      expect(link).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle juncture with special characters in name', () => {
      const specialCharJuncture = { ...mockJuncture, name: 'Juncture-X @2023!', image_url: '' }
      
      render(<JunctureAvatar juncture={specialCharJuncture} />)
      
      const avatar = screen.getByText('J@')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle very long juncture names', () => {
      const longNameJuncture = { 
        ...mockJuncture, 
        name: 'Super Long Juncture Name With Many Words For Testing',
        image_url: ''
      }
      
      render(<JunctureAvatar juncture={longNameJuncture} />)
      
      const avatar = screen.getByText('SLJNWMWFT')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle lowercase names correctly', () => {
      const lowercaseJuncture = { ...mockJuncture, name: 'test juncture', image_url: '' }
      
      render(<JunctureAvatar juncture={lowercaseJuncture} />)
      
      const avatar = screen.getByText('TJ')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle juncture with undefined properties', () => {
      const partialJuncture = { 
        ...mockJuncture, 
        name: 'Test',
        image_url: undefined as any
      }
      
      render(<JunctureAvatar juncture={partialJuncture} />)
      
      // When image_url is undefined, it renders initials instead of image
      const avatar = screen.getByText('T')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('link variants', () => {
    it('should handle link with empty href', () => {
      render(<JunctureAvatar juncture={mockJuncture} href="" />)
      
      // Empty href is falsy, so no link is created
      const link = document.querySelector('[data-mention-id="juncture-123"]')
      expect(link).not.toBeInTheDocument()
      
      // Should render plain avatar instead
      const avatar = screen.getByRole('img', { name: 'Ancient Juncture' })
      expect(avatar).toBeInTheDocument()
    })

    it('should handle external links', () => {
      render(<JunctureAvatar juncture={mockJuncture} href="https://example.com" />)
      
      const link = document.querySelector('[data-mention-id="juncture-123"]')
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
    })

    it('should disable popup but still render avatar', () => {
      render(<JunctureAvatar juncture={mockJuncture} href="/test" disablePopup />)
      
      expect(document.querySelector('[data-mention-id="juncture-123"]')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Ancient Juncture' })
      expect(avatar).toBeInTheDocument()
    })
  })
})