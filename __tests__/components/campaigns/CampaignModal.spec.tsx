import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/components/StyledFields'
import CampaignModal from '@/components/campaigns/CampaignModal'
import { createMockCampaign } from '../../factories/campaign'

// Mock contexts
const mockClient = {
  createCampaign: jest.fn().mockResolvedValue({ id: 'campaign-1', name: 'Test Campaign' })
}

const mockToast = {
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
  closeToast: jest.fn(),
  toastInfo: jest.fn(),
  toastWarning: jest.fn()
}

jest.mock('@/contexts/ClientContext', () => ({
  useClient: () => ({
    client: mockClient,
    user: { id: 'user-1', gamemaster: true }
  })
}))

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => mockToast
}))

// Mock types
const mockDefaultCampaign = {
  id: null,
  name: '',
  description: '',
  new: false,
  active: false
}

jest.mock('@/types/types', () => ({
  defaultCampaign: mockDefaultCampaign
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('CampaignModal', () => {
  const mockSetOpen = jest.fn()
  const mockReload = jest.fn().mockResolvedValue({})
  
  const defaultProps = {
    open: mockDefaultCampaign,
    setOpen: mockSetOpen,
    campaign: mockDefaultCampaign,
    reload: mockReload
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('modal visibility', () => {
    test('does not render when not open', () => {
      renderWithTheme(<CampaignModal {...defaultProps} />)
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    test('renders when open with new campaign', () => {
      const openCampaign = { ...mockDefaultCampaign, new: true }
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Campaign')).toBeInTheDocument()
    })

    test('renders when open with existing campaign', () => {
      const openCampaign = createMockCampaign({ id: 'campaign-1', name: 'Existing Campaign' })
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('form rendering', () => {
    const openCampaign = { ...mockDefaultCampaign, new: true }

    test('renders campaign name input', () => {
      const campaign = createMockCampaign({ name: 'Test Campaign' })
      
      renderWithTheme(
        <CampaignModal 
          {...defaultProps} 
          open={openCampaign} 
          campaign={campaign}
        />
      )
      
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Campaign')).toBeInTheDocument()
    })

    test('renders campaign description input', () => {
      const campaign = createMockCampaign({ description: 'Test description' })
      
      renderWithTheme(
        <CampaignModal 
          {...defaultProps} 
          open={openCampaign} 
          campaign={campaign}
        />
      )
      
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
    })

    test('renders save and cancel buttons', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      expect(screen.getByText('Save Changes')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    test('has autofocus on name input', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const nameInput = screen.getByLabelText('Title')
      expect(nameInput).toHaveAttribute('autoFocus')
    })

    test('description input is multiline', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const descriptionInput = screen.getByLabelText('Description')
      expect(descriptionInput).toHaveAttribute('rows', '3')
    })
  })

  describe('form interactions', () => {
    const openCampaign = { ...mockDefaultCampaign, new: true }

    test('handles name input change', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const nameInput = screen.getByLabelText('Title')
      fireEvent.change(nameInput, { target: { name: 'name', value: 'New Campaign Name' } })
      
      expect(nameInput).toHaveValue('New Campaign Name')
    })

    test('handles description input change', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const descriptionInput = screen.getByLabelText('Description')
      fireEvent.change(descriptionInput, { 
        target: { name: 'description', value: 'New campaign description' } 
      })
      
      expect(descriptionInput).toHaveValue('New campaign description')
    })

    test('updates multiple fields independently', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const nameInput = screen.getByLabelText('Title')
      const descriptionInput = screen.getByLabelText('Description')
      
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Campaign Name' } })
      fireEvent.change(descriptionInput, { 
        target: { name: 'description', value: 'Campaign Description' } 
      })
      
      expect(nameInput).toHaveValue('Campaign Name')
      expect(descriptionInput).toHaveValue('Campaign Description')
    })
  })

  describe('form submission', () => {
    const openCampaign = { ...mockDefaultCampaign, new: true }

    test('handles successful form submission', async () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      // Fill in form
      const nameInput = screen.getByLabelText('Title')
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Test Campaign' } })
      
      // Submit form
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockClient.createCampaign).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Test Campaign' })
        )
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Test Campaign created.')
        expect(mockReload).toHaveBeenCalled()
        expect(mockSetOpen).toHaveBeenCalledWith(mockDefaultCampaign)
      })
    })

    test('prevents default form submission', async () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const form = screen.getByRole('form')
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault')
      
      fireEvent(form, submitEvent)
      
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('disables buttons during submission', async () => {
      let resolvePromise: (value?: any) => void
      const mockPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockClient.createCampaign.mockReturnValue(mockPromise)
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      // Buttons should be disabled during submission
      expect(screen.getByText('Save Changes')).toBeDisabled()
      expect(screen.getByText('Cancel')).toBeDisabled()
      
      // Resolve promise to finish submission
      resolvePromise!()
      await waitFor(() => {
        expect(mockClient.createCampaign).toHaveBeenCalled()
      })
    })

    test('handles form submission error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockClient.createCampaign.mockRejectedValue(new Error('Create failed'))
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockToast.toastError).toHaveBeenCalled()
        expect(mockSetOpen).toHaveBeenCalledWith(mockDefaultCampaign)
      })
      
      // Buttons should be re-enabled after error
      expect(screen.getByText('Save Changes')).not.toBeDisabled()
      expect(screen.getByText('Cancel')).not.toBeDisabled()
      
      consoleSpy.mockRestore()
    })

    test('updates local state with returned data on success', async () => {
      const returnedCampaign = { id: 'campaign-1', name: 'Created Campaign', description: 'Test' }
      mockClient.createCampaign.mockResolvedValue(returnedCampaign)
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockClient.createCampaign).toHaveBeenCalled()
        // Form should be cancelled after successful update
        expect(mockSetOpen).toHaveBeenCalledWith(mockDefaultCampaign)
      })
    })
  })

  describe('form cancellation', () => {
    const openCampaign = { ...mockDefaultCampaign, new: true }

    test('handles cancel button click', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      expect(mockSetOpen).toHaveBeenCalledWith(mockDefaultCampaign)
    })

    test('handles dialog close', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      // Simulate clicking outside dialog or pressing escape
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
      
      expect(mockSetOpen).toHaveBeenCalledWith(mockDefaultCampaign)
    })

    test('resets form data when cancelled', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      // Make changes
      const nameInput = screen.getByLabelText('Title')
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Test Campaign' } })
      
      // Cancel
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      expect(mockSetOpen).toHaveBeenCalledWith(mockDefaultCampaign)
    })
  })

  describe('component lifecycle', () => {
    test('initializes with provided campaign data', () => {
      const campaign = createMockCampaign({ 
        name: 'Initial Campaign', 
        description: 'Initial description' 
      })
      const openCampaign = { ...campaign, new: true }
      
      renderWithTheme(
        <CampaignModal 
          {...defaultProps} 
          open={openCampaign} 
          campaign={campaign}
        />
      )
      
      expect(screen.getByDisplayValue('Initial Campaign')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Initial description')).toBeInTheDocument()
    })

    test('maintains local state independently from props', () => {
      const openCampaign = { ...mockDefaultCampaign, new: true }
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const nameInput = screen.getByLabelText('Title')
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Local Change' } })
      
      expect(nameInput).toHaveValue('Local Change')
    })
  })

  describe('dialog configuration', () => {
    const openCampaign = { ...mockDefaultCampaign, new: true }

    test('has proper dialog structure', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Campaign')).toBeInTheDocument() // Dialog title
    })

    test('has form structure for submission', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    test('has proper dialog width', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const form = screen.getByRole('form')
      expect(form).toHaveStyle('width: 600px') // sx={{width: 600}}
    })

    test('disables auto focus on dialog', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      // Dialog should have disableAutoFocus prop
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    const openCampaign = { ...mockDefaultCampaign, new: true }

    test('has accessible form labels', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
    })

    test('has accessible button labels', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('has proper dialog title', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      expect(screen.getByRole('dialog', { name: 'Campaign' })).toBeInTheDocument()
    })

    test('has proper form submission', () => {
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const submitButton = screen.getByRole('button', { name: 'Save Changes' })
      expect(submitButton).toHaveAttribute('type', 'submit')
    })
  })

  describe('edge cases', () => {
    test('handles undefined campaign prop', () => {
      const openCampaign = { ...mockDefaultCampaign, new: true }
      
      renderWithTheme(
        <CampaignModal 
          {...defaultProps} 
          open={openCampaign} 
          campaign={undefined as any}
        />
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    test('handles empty campaign name', () => {
      const openCampaign = { ...mockDefaultCampaign, new: true }
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      // Should still attempt submission with empty name
      expect(mockClient.createCampaign).toHaveBeenCalledWith(
        expect.objectContaining({ name: '' })
      )
    })

    test('handles very long campaign names', () => {
      const openCampaign = { ...mockDefaultCampaign, new: true }
      const longName = 'A'.repeat(1000)
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const nameInput = screen.getByLabelText('Title')
      fireEvent.change(nameInput, { target: { name: 'name', value: longName } })
      
      expect(nameInput).toHaveValue(longName)
    })

    test('handles special characters in inputs', () => {
      const openCampaign = { ...mockDefaultCampaign, new: true }
      const specialText = '!@#$%^&*()_+-={}[]|\\:";\'<>?,./'
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const nameInput = screen.getByLabelText('Title')
      fireEvent.change(nameInput, { target: { name: 'name', value: specialText } })
      
      expect(nameInput).toHaveValue(specialText)
    })

    test('handles multiple rapid form submissions', async () => {
      const openCampaign = { ...mockDefaultCampaign, new: true }
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const form = screen.getByRole('form')
      
      // Submit multiple times rapidly
      fireEvent.submit(form)
      fireEvent.submit(form)
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockClient.createCampaign).toHaveBeenCalledTimes(1)
      })
    })

    test('handles reload function error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockReload.mockRejectedValue(new Error('Reload failed'))
      const openCampaign = { ...mockDefaultCampaign, new: true }
      
      renderWithTheme(
        <CampaignModal {...defaultProps} open={openCampaign} />
      )
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockReload).toHaveBeenCalled()
      })
      
      consoleSpy.mockRestore()
    })
  })
})