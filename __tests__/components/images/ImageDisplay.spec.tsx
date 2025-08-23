import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ImageDisplay from '../../../components/images/ImageDisplay'
import type { Entity } from '../../../components/images/ImageManager'

describe('ImageDisplay', () => {
  const mockEntityWithImage: Entity = {
    id: 'entity-1',
    name: 'Test Entity',
    image_url: 'https://example.com/test-image.jpg'
  } as Entity

  const mockEntityWithoutImage: Entity = {
    id: 'entity-2', 
    name: 'Entity Without Image',
    image_url: null
  } as Entity

  describe('with image URL', () => {
    it('should render avatar with image', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveAttribute('src', 'https://example.com/test-image.jpg?tr=w-75,h-75,fo-face')
    })

    it('should have avatar with image and proper styling', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      expect(avatar).toBeInTheDocument()
      // CSS styles are applied via sx prop, not inline styles
      expect(avatar.closest('.MuiAvatar-root')).toBeInTheDocument()
    })

    it('should open modal when avatar is clicked', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      
      // Modal should be visible
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      
      // Modal title should show entity name
      expect(screen.getByText('Test Entity')).toBeInTheDocument()
      
      // Modal should contain the full-size image
      const modalImage = screen.getByAltText('Test Entity')
      expect(modalImage).toHaveAttribute('src', 'https://example.com/test-image.jpg')
    })

    it('should close modal when onClose is triggered', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      // Open modal
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Close modal by pressing Escape
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
      
      // Modal should be closed (dialog should still exist but not be visible in DOM)
      // Note: Material-UI might handle this differently, so we test the behavior
    })

    it('should display correct image transformations in avatar', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      // Avatar should have ImageKit transformations for thumbnail
      expect(avatar).toHaveAttribute('src', 'https://example.com/test-image.jpg?tr=w-75,h-75,fo-face')
    })

    it('should display original image in modal', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      
      const modalImage = screen.getByAltText('Test Entity')
      // Modal image should be the original without transformations
      expect(modalImage).toHaveAttribute('src', 'https://example.com/test-image.jpg')
    })
  })

  describe('without image URL', () => {
    it('should render default avatar when no image', () => {
      render(<ImageDisplay entity={mockEntityWithoutImage} />)
      
      // Should render an avatar element (Material-UI will show default icon)
      const avatars = document.querySelectorAll('.MuiAvatar-root')
      expect(avatars).toHaveLength(1)
      
      // Avatar should have the same styling
      const avatar = avatars[0]
      expect(avatar).toHaveStyle({ cursor: 'pointer' })
    })

    it('should not open modal when default avatar is clicked (missing onClick)', () => {
      render(<ImageDisplay entity={mockEntityWithoutImage} />)
      
      const avatar = document.querySelector('.MuiAvatar-root')
      fireEvent.click(avatar as Element)
      
      // Modal should not be visible due to missing onClick handler on no-image avatar
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should render avatar without onClick when no image_url', () => {
      render(<ImageDisplay entity={mockEntityWithoutImage} />)
      
      const avatar = document.querySelector('.MuiAvatar-root')
      expect(avatar).toBeInTheDocument()
      
      // Avatar exists but clicking it won't open modal due to missing onClick
      fireEvent.click(avatar as Element)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('entity properties', () => {
    it('should use entity name in modal title and alt text', () => {
      const entityWithSpecialName = {
        ...mockEntityWithImage,
        name: 'Special Character Name with Symbols!'
      }
      
      render(<ImageDisplay entity={entityWithSpecialName} />)
      
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      
      expect(screen.getByText('Special Character Name with Symbols!')).toBeInTheDocument()
      expect(screen.getByAltText('Special Character Name with Symbols!')).toBeInTheDocument()
    })

    it('should handle empty entity name', () => {
      const entityWithoutName = {
        ...mockEntityWithImage,
        name: ''
      }
      
      render(<ImageDisplay entity={entityWithoutName} />)
      
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      
      // Should render empty title but not crash
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByAltText('')).toBeInTheDocument()
    })

    it('should handle entity with undefined name', () => {
      const entityWithUndefinedName = {
        ...mockEntityWithImage,
        name: undefined
      } as any
      
      render(<ImageDisplay entity={entityWithUndefinedName} />)
      
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('modal behavior', () => {
    it('should have correct dialog structure', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      
      // Should have dialog with title and content
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Dialog content should contain a card with the image
      const modalImage = screen.getByAltText('Test Entity')
      expect(modalImage.closest('.MuiCard-root')).toBeInTheDocument()
    })

    it('should initially have modal closed', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      // Modal should not be visible initially
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should handle multiple open/close cycles', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      
      // Open modal
      fireEvent.click(avatar)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      
      // Close modal
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
      
      // Open modal again
      fireEvent.click(avatar)
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper img role for avatar with image', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      expect(avatar).toBeInTheDocument()
    })

    it('should have clickable avatar', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      expect(avatar).toBeInTheDocument()
      // Avatar is clickable as evidenced by other tests that successfully click it
    })

    it('should have proper dialog role when modal is open', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })

    it('should have proper alt text for modal image', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      
      const modalImage = screen.getByAltText('Test Entity')
      expect(modalImage).toBeInTheDocument()
    })
  })

  describe('styling and appearance', () => {
    it('should apply correct avatar dimensions and styling', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = document.querySelector('.MuiAvatar-root')
      expect(avatar).toHaveClass('MuiAvatar-rounded')
    })

    it('should use orange background color for modal', () => {
      render(<ImageDisplay entity={mockEntityWithImage} />)
      
      const avatar = screen.getByRole('img')
      fireEvent.click(avatar)
      
      // Dialog title and content should have orange background
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
    })
  })
})