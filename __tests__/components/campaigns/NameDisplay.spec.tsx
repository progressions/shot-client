import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import NameDisplay from '../../../components/campaigns/NameDisplay'
import { defaultCampaign } from '../../../types/types'
import type { Campaign } from '../../../types/types'

describe('NameDisplay', () => {
  const mockOnClick = jest.fn()

  const mockCampaign: Campaign = {
    ...defaultCampaign,
    id: 'campaign-123',
    name: 'Test Campaign'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render campaign name and start button', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      expect(screen.getByText('Test Campaign')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    })

    it('should display PlayCircleIcon in start button', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Start' })
      expect(button).toBeInTheDocument()
      
      // Check for Material-UI icon by test id or svg element
      const icon = button.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })

    it('should render with correct Material-UI components', () => {
      const { container } = render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      // Should contain Stack component
      const stackElement = container.querySelector('.MuiStack-root')
      expect(stackElement).toBeInTheDocument()
      
      // Should contain Button component
      const button = screen.getByRole('button')
      expect(button).toHaveClass('MuiButton-root')
      
      // Should contain Typography component
      const typography = container.querySelector('.MuiTypography-root')
      expect(typography).toBeInTheDocument()
    })
  })

  describe('button interaction', () => {
    it('should call onClick when start button is clicked', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      const startButton = screen.getByRole('button', { name: 'Start' })
      fireEvent.click(startButton)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple clicks', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      const startButton = screen.getByRole('button', { name: 'Start' })
      fireEvent.click(startButton)
      fireEvent.click(startButton)
      fireEvent.click(startButton)
      
      expect(mockOnClick).toHaveBeenCalledTimes(3)
    })

    it('should handle rapid clicks', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      const startButton = screen.getByRole('button', { name: 'Start' })
      
      // Simulate rapid clicking
      for (let i = 0; i < 5; i++) {
        fireEvent.click(startButton)
      }
      
      expect(mockOnClick).toHaveBeenCalledTimes(5)
    })
  })

  describe('styling', () => {
    it('should have correct button variant and color', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Start' })
      expect(button).toHaveClass('MuiButton-contained')
      expect(button).toHaveClass('MuiButton-containedSecondary')
    })

    it('should have start icon in button', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Start' })
      const startIcon = button.querySelector('.MuiButton-startIcon')
      expect(startIcon).toBeInTheDocument()
    })

    it('should have proper layout with Stack component', () => {
      const { container } = render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      const stack = container.querySelector('.MuiStack-root')
      expect(stack).toBeInTheDocument()
    })
  })

  describe('campaign data', () => {
    it('should handle empty campaign name', () => {
      const emptyCampaign = { ...mockCampaign, name: '' }
      
      render(<NameDisplay campaign={emptyCampaign} onClick={mockOnClick} />)
      
      // Empty campaign name should still render the component structure
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
      
      // Should have Typography component, even with empty text
      const { container } = render(<NameDisplay campaign={emptyCampaign} onClick={mockOnClick} />)
      const typography = container.querySelector('.MuiTypography-root')
      expect(typography).toBeInTheDocument()
    })

    it('should handle long campaign names', () => {
      const longNameCampaign = { 
        ...mockCampaign, 
        name: 'This is a very long campaign name that might wrap to multiple lines' 
      }
      
      render(<NameDisplay campaign={longNameCampaign} onClick={mockOnClick} />)
      
      expect(screen.getByText('This is a very long campaign name that might wrap to multiple lines')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    })

    it('should handle special characters in campaign name', () => {
      const specialCharCampaign = { 
        ...mockCampaign, 
        name: 'Campaign "Special" & <Dangerous> Characters!' 
      }
      
      render(<NameDisplay campaign={specialCharCampaign} onClick={mockOnClick} />)
      
      expect(screen.getByText('Campaign "Special" & <Dangerous> Characters!')).toBeInTheDocument()
    })

    it('should handle campaign with different id formats', () => {
      const uuidCampaign = { 
        ...mockCampaign, 
        id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'UUID Campaign'
      }
      
      render(<NameDisplay campaign={uuidCampaign} onClick={mockOnClick} />)
      
      expect(screen.getByText('UUID Campaign')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible button', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Start' })
      expect(button).toHaveAttribute('type', 'button')
      expect(button).not.toHaveAttribute('disabled')
    })

    it('should be keyboard accessible', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Start' })
      
      act(() => {
        button.focus()
      })
      
      expect(document.activeElement).toBe(button)
    })

    it('should have proper semantic structure', () => {
      render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      // Button should be accessible
      expect(screen.getByRole('button')).toBeInTheDocument()
      
      // Text should be rendered properly
      expect(screen.getByText('Test Campaign')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle onClick function changes', () => {
      const firstOnClick = jest.fn()
      const secondOnClick = jest.fn()
      
      const { rerender } = render(<NameDisplay campaign={mockCampaign} onClick={firstOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Start' })
      fireEvent.click(button)
      expect(firstOnClick).toHaveBeenCalledTimes(1)
      expect(secondOnClick).not.toHaveBeenCalled()
      
      rerender(<NameDisplay campaign={mockCampaign} onClick={secondOnClick} />)
      fireEvent.click(button)
      expect(secondOnClick).toHaveBeenCalledTimes(1)
      expect(firstOnClick).toHaveBeenCalledTimes(1) // Should not be called again
    })

    it('should handle campaign object changes', () => {
      const { rerender } = render(<NameDisplay campaign={mockCampaign} onClick={mockOnClick} />)
      
      expect(screen.getByText('Test Campaign')).toBeInTheDocument()
      
      const newCampaign = { ...mockCampaign, name: 'Updated Campaign' }
      rerender(<NameDisplay campaign={newCampaign} onClick={mockOnClick} />)
      
      expect(screen.getByText('Updated Campaign')).toBeInTheDocument()
      expect(screen.queryByText('Test Campaign')).not.toBeInTheDocument()
    })

    it('should handle null or undefined campaign name gracefully', () => {
      const nullNameCampaign = { ...mockCampaign, name: null as any }
      
      render(<NameDisplay campaign={nullNameCampaign} onClick={mockOnClick} />)
      
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
      // Component should still render without crashing
    })
  })
})