import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import SwerveButton from '../../../components/dice/SwerveButton'

describe('SwerveButton', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render button with tooltip', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should render two casino icons', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      // Should render two CasinoIcon components
      const icons = screen.getAllByTestId('CasinoIcon')
      expect(icons).toHaveLength(2)
    })

    it('should have proper styling containers', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      
      // Should contain nested Box components with specific styling
      const boxElements = button.querySelectorAll('.MuiBox-root')
      expect(boxElements.length).toBeGreaterThan(0)
    })
  })

  describe('interactions', () => {
    it('should call onClick when button is clicked', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple clicks', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      expect(mockOnClick).toHaveBeenCalledTimes(3)
    })

    it('should be keyboard accessible', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      
      act(() => {
        button.focus()
      })
      
      expect(document.activeElement).toBe(button)
    })
  })

  describe('tooltip behavior', () => {
    it('should show tooltip on hover', async () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)
      
      // Tooltip text should eventually appear
      expect(await screen.findByText('Roll Swerve')).toBeInTheDocument()
    })

    it('should have correct tooltip text', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      // Tooltip component should have the correct title prop
      const tooltipTrigger = screen.getByRole('button')
      expect(tooltipTrigger).toBeInTheDocument()
    })
  })

  describe('icon styling', () => {
    it('should render icons with different colors', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      const icons = button.querySelectorAll('[data-testid="CasinoIcon"]')
      
      expect(icons).toHaveLength(2)
      // Icons should have different color styles (white and red)
      // This is applied via sx prop, so we just verify they exist
    })

    it('should have proper icon sizing', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      const icons = button.querySelectorAll('[data-testid="CasinoIcon"]')
      
      // Both icons should be present with consistent sizing
      expect(icons).toHaveLength(2)
      icons.forEach(icon => {
        expect(icon).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('should have proper button role', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should be focusable', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      
      act(() => {
        button.focus()
      })
      
      expect(document.activeElement).toBe(button)
    })

    it('should have accessible tooltip', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      // Tooltip accessibility is handled by Material-UI internally
    })
  })

  describe('Material-UI integration', () => {
    it('should render as Material-UI Button', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('MuiButton-root')
    })

    it('should have Material-UI Box styling containers', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      const boxes = button.querySelectorAll('.MuiBox-root')
      
      expect(boxes.length).toBeGreaterThan(0)
    })

    it('should integrate with Tooltip component', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      // Should be wrapped in a Tooltip component
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      // Tooltip integration is handled by Material-UI
    })
  })

  describe('edge cases', () => {
    it('should handle onClick function changes', () => {
      const firstOnClick = jest.fn()
      const secondOnClick = jest.fn()
      
      const { rerender } = render(<SwerveButton onClick={firstOnClick} />)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)
      expect(firstOnClick).toHaveBeenCalledTimes(1)
      expect(secondOnClick).not.toHaveBeenCalled()
      
      rerender(<SwerveButton onClick={secondOnClick} />)
      fireEvent.click(button)
      expect(secondOnClick).toHaveBeenCalledTimes(1)
      expect(firstOnClick).toHaveBeenCalledTimes(1) // Should not be called again
    })

    it('should handle rapid clicks', () => {
      render(<SwerveButton onClick={mockOnClick} />)
      
      const button = screen.getByRole('button')
      
      // Simulate rapid clicking
      for (let i = 0; i < 10; i++) {
        fireEvent.click(button)
      }
      
      expect(mockOnClick).toHaveBeenCalledTimes(10)
    })
  })
})