import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import KillMooksModal from '../../../components/characters/KillMooksModal'
import { defaultCharacter, defaultFight, defaultUser, CharacterTypes } from '../../../types/types'
import type { Person, Fight } from '../../../types/types'
import { FightActions } from '../../../reducers/fightState'
import CS from '../../../services/CharacterService'

// Mock contexts
const mockDispatchFight = jest.fn()
const mockToastSuccess = jest.fn()
const mockToastError = jest.fn()
const mockUpdateCharacter = jest.fn()
const mockUpdateVehicle = jest.fn()

jest.mock('../../../contexts', () => ({
  useFight: () => ({
    fight: {
      ...defaultFight,
      id: 'test-fight'
    },
    dispatch: mockDispatchFight
  }),
  useToast: () => ({
    toastSuccess: mockToastSuccess,
    toastError: mockToastError
  }),
  useClient: () => ({
    client: {
      updateCharacter: mockUpdateCharacter,
      updateVehicle: mockUpdateVehicle
    }
  })
}))

// Mock CharacterService
jest.mock('../../../services/CharacterService', () => ({
  isVehicle: jest.fn()
}))

// Mock form reducer
jest.mock('../../../reducers/formState', () => ({
  FormActions: {
    OPEN: 'open',
    SUBMIT: 'submit',
    RESET: 'reset',
    UPDATE: 'update',
    DISABLE: 'disable'
  },
  useForm: jest.fn()
}))

// Mock StyledFields
jest.mock('../../../components/StyledFields', () => ({
  StyledTextField: ({ onChange, value, ...props }: any) => (
    <input 
      data-testid="mooks-input"
      type="number"
      onChange={onChange}
      value={value || ''}
      {...props}
    />
  ),
  StyledFormDialog: ({ children, open, onSubmit, onCancel, title, disabled }: any) => (
    open ? (
      <div data-testid="kill-mooks-dialog">
        <h2>{title}</h2>
        <form onSubmit={onSubmit}>
          {children}
          <button type="submit" disabled={disabled} data-testid="submit-button">
            Save
          </button>
          <button type="button" onClick={onCancel} data-testid="cancel-button">
            Cancel
          </button>
        </form>
      </div>
    ) : null
  )
}))

import { useForm } from '../../../reducers/formState'

describe('KillMooksModal', () => {
  const mockCharacter: Person = {
    ...defaultCharacter,
    id: 'character-123',
    name: 'Mook Squad',
    category: 'character' as const,
    count: 10,
    action_values: {
      ...defaultCharacter.action_values,
      Type: CharacterTypes.Mook
    }
  }

  const mockVehicle: Person = {
    ...defaultCharacter,
    id: 'vehicle-123',
    name: 'Tank Squad',
    category: 'vehicle' as const,
    count: 5
  }

  const mockDispatchForm = jest.fn()
  const mockUseForm = useForm as jest.MockedFunction<typeof useForm>
  const mockIsVehicle = CS.isVehicle as jest.MockedFunction<typeof CS.isVehicle>

  const theme = createTheme()

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    )
  }

  const createFormState = (overrides: any = {}) => ({
    edited: false,
    loading: false,
    saving: false,
    disabled: true,
    open: false,
    error: null,
    success: null,
    formData: { mooks: 0 },
    ...overrides
  })

  const createFormReturn = (formStateOverrides: any = {}) => ({
    formState: createFormState(formStateOverrides),
    dispatchForm: mockDispatchForm,
    initialFormState: createFormState()
  } as any)

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default form state
    mockUseForm.mockReturnValue(createFormReturn())
    mockIsVehicle.mockReturnValue(false)
    mockUpdateCharacter.mockResolvedValue(undefined)
    mockUpdateVehicle.mockResolvedValue(undefined)
  })

  describe('rendering', () => {
    it('should render kill mooks button', () => {
      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeInTheDocument()
    })

    it('should render HeartBrokenIcon in button', () => {
      const { container } = renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const icon = container.querySelector('[data-testid="HeartBrokenIcon"]')
      expect(icon).toBeInTheDocument()
    })

    it('should not render dialog when closed', () => {
      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      expect(screen.queryByTestId('kill-mooks-dialog')).not.toBeInTheDocument()
    })

    it('should render dialog when open', () => {
      mockUseForm.mockReturnValue(createFormReturn({ open: true }))

      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      expect(screen.getByTestId('kill-mooks-dialog')).toBeInTheDocument()
      expect(screen.getByText('Kill Mooks')).toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    beforeEach(() => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { mooks: 3 } 
      }))
    })

    it('should handle opening the modal', () => {
      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const buttons = screen.getAllByRole('button')
      fireEvent.click(buttons[0])
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'open',
        payload: true
      })
    })

    it('should handle input changes', () => {
      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const input = screen.getByTestId('mooks-input')
      fireEvent.change(input, { target: { value: '5' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'update',
        name: 'mooks',
        value: 5
      })
    })

    it('should handle form cancellation', () => {
      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'reset',
        payload: expect.objectContaining({ formData: { mooks: 0 } })
      })
    })
  })

  describe('form submission for characters', () => {
    beforeEach(() => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { mooks: 3 } 
      }))
      mockIsVehicle.mockReturnValue(false)
    })

    it('should handle successful character submission', async () => {
      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const form = screen.getByTestId('kill-mooks-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'submit' })
        expect(mockIsVehicle).toHaveBeenCalledWith(mockCharacter)
        expect(mockUpdateCharacter).toHaveBeenCalledWith(
          expect.objectContaining({ 
            ...mockCharacter, 
            count: 7  // 10 - 3
          }), 
          expect.objectContaining({ id: 'test-fight' })
        )
        expect(mockDispatchFight).toHaveBeenCalledWith({ type: FightActions.EDIT })
        expect(mockToastSuccess).toHaveBeenCalledWith('Mook Squad lost 3 mooks.')
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'reset', payload: expect.objectContaining({ formData: { mooks: 0 } }) })
      })
    })

    it('should handle character submission errors', async () => {
      const error = new Error('Network error')
      mockUpdateCharacter.mockRejectedValue(error)
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const form = screen.getByTestId('kill-mooks-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(error)
        expect(mockToastError).toHaveBeenCalled()
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'reset', payload: expect.objectContaining({ formData: { mooks: 0 } }) })
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('form submission for vehicles', () => {
    beforeEach(() => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { mooks: 2 } 
      }))
      mockIsVehicle.mockReturnValue(true)
    })

    it('should handle successful vehicle submission', async () => {
      renderWithTheme(<KillMooksModal character={mockVehicle} />)
      
      const form = screen.getByTestId('kill-mooks-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'submit' })
        expect(mockIsVehicle).toHaveBeenCalledWith(mockVehicle)
        expect(mockUpdateVehicle).toHaveBeenCalledWith(
          expect.objectContaining({ 
            ...mockVehicle, 
            count: 3  // 5 - 2
          }), 
          expect.objectContaining({ id: 'test-fight' })
        )
        expect(mockDispatchFight).toHaveBeenCalledWith({ type: FightActions.EDIT })
        expect(mockToastSuccess).toHaveBeenCalledWith('Tank Squad lost 2 mooks.')
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'reset', payload: expect.objectContaining({ formData: { mooks: 0 } }) })
      })
    })

    it('should handle vehicle submission errors', async () => {
      const error = new Error('Vehicle update failed')
      mockUpdateVehicle.mockRejectedValue(error)
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      renderWithTheme(<KillMooksModal character={mockVehicle} />)
      
      const form = screen.getByTestId('kill-mooks-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(error)
        expect(mockToastError).toHaveBeenCalled()
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'reset', payload: expect.objectContaining({ formData: { mooks: 0 } }) })
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('form validation', () => {
    it('should disable form when mooks is 0', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: true, 
        formData: { mooks: 0 } 
      }))

      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeDisabled()
    })

    it('should enable form when mooks is greater than 0', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { mooks: 3 } 
      }))

      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).not.toBeDisabled()
    })

    it('should disable form when saving', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        saving: true, 
        disabled: false, 
        formData: { mooks: 3 } 
      }))

      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeDisabled()
    })
  })

  describe('mook count calculations', () => {
    it('should calculate correct remaining mooks for characters', async () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { mooks: 4 } 
      }))
      mockIsVehicle.mockReturnValue(false)

      const characterWithMooks = { ...mockCharacter, count: 15 }
      renderWithTheme(<KillMooksModal character={characterWithMooks} />)
      
      const form = screen.getByTestId('kill-mooks-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockUpdateCharacter).toHaveBeenCalledWith(
          expect.objectContaining({ count: 11 }), // 15 - 4
          expect.any(Object)
        )
      })
    })

    it('should calculate correct remaining mooks for vehicles', async () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { mooks: 2 } 
      }))
      mockIsVehicle.mockReturnValue(true)

      const vehicleWithMooks = { ...mockVehicle, count: 8 }
      renderWithTheme(<KillMooksModal character={vehicleWithMooks} />)
      
      const form = screen.getByTestId('kill-mooks-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockUpdateVehicle).toHaveBeenCalledWith(
          expect.objectContaining({ count: 6 }), // 8 - 2
          expect.any(Object)
        )
      })
    })
  })

  describe('edge cases', () => {
    it('should handle null character gracefully', () => {
      renderWithTheme(<KillMooksModal character={null as any} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeInTheDocument()
    })

    it('should handle invalid mooks input', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { mooks: 3 } 
      }))

      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const input = screen.getByTestId('mooks-input')
      fireEvent.change(input, { target: { value: 'invalid' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'update',
        name: 'mooks',
        value: NaN
      })
    })

    it('should handle zero mooks value', () => {
      mockUseForm.mockReturnValue(createFormReturn({
        open: true,
        saving: false,
        disabled: false,
        formData: { mooks: 0 }
      }))

      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const input = screen.getByTestId('mooks-input')
      expect(input).toHaveAttribute('value', '')
    })

    it('should handle large mooks values', async () => {
      mockUseForm.mockReturnValue(createFormReturn({
        open: true,
        saving: false,
        disabled: false,
        formData: { mooks: 999 }
      }))
      mockIsVehicle.mockReturnValue(false)

      const characterWithManyMooks = { ...mockCharacter, count: 1000 }
      renderWithTheme(<KillMooksModal character={characterWithManyMooks} />)
      
      const form = screen.getByTestId('kill-mooks-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockUpdateCharacter).toHaveBeenCalledWith(
          expect.objectContaining({ count: 1 }), // 1000 - 999
          expect.any(Object)
        )
      })
    })

    it('should handle negative result (killing more mooks than available)', async () => {
      mockUseForm.mockReturnValue(createFormReturn({
        open: true,
        saving: false,
        disabled: false,
        formData: { mooks: 15 }
      }))
      mockIsVehicle.mockReturnValue(false)

      const characterWithFewMooks = { ...mockCharacter, count: 10 }
      renderWithTheme(<KillMooksModal character={characterWithFewMooks} />)
      
      const form = screen.getByTestId('kill-mooks-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockUpdateCharacter).toHaveBeenCalledWith(
          expect.objectContaining({ count: -5 }), // 10 - 15
          expect.any(Object)
        )
      })
    })
  })

  describe('accessibility', () => {
    it('should render accessible form elements', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { mooks: 3 } 
      }))

      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByTestId('mooks-input')).toBeInTheDocument()
    })

    it('should have accessible button', () => {
      renderWithTheme(<KillMooksModal character={mockCharacter} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeInTheDocument()
    })
  })
})