import React from 'react'
import { render, screen } from '@testing-library/react'
import VehicleAvatar from '../../../components/avatars/VehicleAvatar'
import { defaultVehicle } from '../../../types/types'
import type { Vehicle } from '../../../types/types'

// Mock VehicleService
jest.mock('../../../services/VehicleService', () => ({
  name: jest.fn()
}))

import VS from '../../../services/VehicleService'

describe('VehicleAvatar', () => {
  const mockVehicleName = VS.name as jest.MockedFunction<typeof VS.name>

  const mockVehicle: Vehicle = {
    ...defaultVehicle,
    id: 'vehicle-123',
    name: 'Test Vehicle',
    image_url: 'https://example.com/vehicle.jpg',
    color: 'red'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockVehicleName.mockReturnValue('Test Vehicle')
  })

  describe('rendering', () => {
    it('should render vehicle avatar with image', () => {
      render(<VehicleAvatar vehicle={mockVehicle} />)
      
      const avatar = screen.getByRole('img', { name: 'Test Vehicle' })
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', 'https://example.com/vehicle.jpg')
    })

    it('should render initials when no image provided', () => {
      const vehicleWithoutImage = { ...mockVehicle, image_url: '' }
      
      render(<VehicleAvatar vehicle={vehicleWithoutImage} />)
      
      const avatar = screen.getByText('TV') // Test Vehicle -> TV
      expect(avatar).toBeInTheDocument()
    })

    it('should handle single word names', () => {
      const singleWordVehicle = { ...mockVehicle, name: 'Motorcycle', image_url: '' }
      
      render(<VehicleAvatar vehicle={singleWordVehicle} />)
      
      const avatar = screen.getByText('M')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle multiple word names correctly', () => {
      const multiWordVehicle = { ...mockVehicle, name: 'Fast Red Sports Car', image_url: '' }
      
      render(<VehicleAvatar vehicle={multiWordVehicle} />)
      
      const avatar = screen.getByText('FRSC')
      expect(avatar).toBeInTheDocument()
    })

    it('should return empty fragment when vehicle has no id', () => {
      const vehicleWithoutId = { ...mockVehicle, id: '' }
      
      const { container } = render(<VehicleAvatar vehicle={vehicleWithoutId} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should return empty fragment when vehicle is null', () => {
      const { container } = render(<VehicleAvatar vehicle={null as any} />)
      
      expect(container.firstChild).toBeNull()
    })

    it('should handle empty vehicle name', () => {
      const vehicleWithoutName = { ...mockVehicle, name: '', image_url: '' }
      mockVehicleName.mockReturnValue('Unknown')
      
      render(<VehicleAvatar vehicle={vehicleWithoutName} />)
      
      // Should render default person icon when no name
      const avatar = screen.getByTestId('PersonIcon')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('link behavior', () => {
    it('should render as link when href provided', () => {
      render(<VehicleAvatar vehicle={mockVehicle} href="/vehicles/vehicle-123" />)
      
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/vehicles/vehicle-123')
      expect(link).toHaveAttribute('data-mention-id', 'vehicle-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Vehicle')
    })

    it('should not render link when disablePopup is true', () => {
      render(<VehicleAvatar vehicle={mockVehicle} href="/vehicles/vehicle-123" disablePopup />)
      
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      const avatar = screen.getByRole('img', { name: 'Test Vehicle' })
      expect(avatar).toBeInTheDocument()
    })

    it('should render link by default even without explicit href', () => {
      render(<VehicleAvatar vehicle={mockVehicle} />)
      
      // Material-UI Link without href doesn't get link role, use querySelector
      const link = document.querySelector('[data-mention-id="vehicle-123"]')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('data-mention-id', 'vehicle-123')
    })
  })

  describe('VehicleService integration', () => {
    it('should call VehicleService.name for tooltip', () => {
      render(<VehicleAvatar vehicle={mockVehicle} />)
      
      expect(mockVehicleName).toHaveBeenCalledWith(mockVehicle)
    })

    it('should handle VehicleService returning empty string', () => {
      mockVehicleName.mockReturnValue('')
      
      render(<VehicleAvatar vehicle={mockVehicle} />)
      
      expect(mockVehicleName).toHaveBeenCalledWith(mockVehicle)
      // Component should still render
      const avatar = screen.getByRole('img', { name: 'Test Vehicle' })
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper alt text', () => {
      render(<VehicleAvatar vehicle={mockVehicle} />)
      
      const avatar = screen.getByRole('img', { name: 'Test Vehicle' })
      expect(avatar).toHaveAttribute('alt', 'Test Vehicle')
    })

    it('should handle empty alt text gracefully', () => {
      const vehicleWithoutName = { ...mockVehicle, name: '', image_url: '' }
      
      render(<VehicleAvatar vehicle={vehicleWithoutName} />)
      
      // When name is empty, Material-UI renders default icon instead
      const avatarContainer = document.querySelector('.MuiAvatar-root')
      expect(avatarContainer).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('should apply Material-UI styling classes', () => {
      render(<VehicleAvatar vehicle={mockVehicle} />)
      
      const link = document.querySelector('.MuiLink-root')
      expect(link).toBeInTheDocument()
      
      const avatar = screen.getByRole('img')
      expect(avatar).toHaveClass('MuiAvatar-img')
    })

    it('should apply mention styling attributes', () => {
      render(<VehicleAvatar vehicle={mockVehicle} />)
      
      const link = document.querySelector('[data-mention-id="vehicle-123"]')
      expect(link).toHaveAttribute('data-mention-id', 'vehicle-123')
      expect(link).toHaveAttribute('data-mention-class-name', 'Vehicle')
    })
  })

  describe('edge cases', () => {
    it('should handle vehicle with special characters in name', () => {
      const specialCharVehicle = { ...mockVehicle, name: 'Vehicle-X @2023!', image_url: '' }
      
      render(<VehicleAvatar vehicle={specialCharVehicle} />)
      
      // Special characters are filtered out, letters only
      const avatar = screen.getByText('V@')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle very long vehicle names', () => {
      const longNameVehicle = { 
        ...mockVehicle, 
        name: 'Super Long Vehicle Name With Many Words For Testing',
        image_url: ''
      }
      
      render(<VehicleAvatar vehicle={longNameVehicle} />)
      
      const avatar = screen.getByText('SLVNWMWFT')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle lowercase names correctly', () => {
      const lowercaseVehicle = { ...mockVehicle, name: 'test vehicle', image_url: '' }
      
      render(<VehicleAvatar vehicle={lowercaseVehicle} />)
      
      const avatar = screen.getByText('TV')
      expect(avatar).toBeInTheDocument()
    })
  })
})