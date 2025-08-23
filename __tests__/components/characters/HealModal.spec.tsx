import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import HealModal from '../../../components/characters/HealModal'
import { defaultCharacter, defaultFight, defaultUser } from '../../../types/types'
import type { Person, Fight } from '../../../types/types'
import { FightActions } from '../../../reducers/fightState'
import CS from '../../../services/CharacterService'

// Mock contexts
const mockDispatchFight = jest.fn()
const mockToastSuccess = jest.fn()
const mockToastError = jest.fn()
const mockUpdateCharacter = jest.fn()

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
      updateCharacter: mockUpdateCharacter
    }
  })
}))

// Mock CharacterService
jest.mock('../../../services/CharacterService', () => ({
  healWounds: jest.fn()
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
      data-testid="healing-input"
      type="number"
      onChange={onChange}
      value={value || ''}
      {...props}
    />
  ),
  StyledFormDialog: ({ children, open, onSubmit, onCancel, title, disabled }: any) => (
    open ? (
      <div data-testid="heal-dialog">
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
  ),
  SaveCancelButtons: () => <div data-testid="save-cancel-buttons" />
}))

import { useForm } from '../../../reducers/formState'

describe('HealModal', () => {
  const mockCharacter: Person = {
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Character',
    category: 'character' as const
  }

  const mockDispatchForm = jest.fn()
  const mockUseForm = useForm as jest.MockedFunction<typeof useForm>
  const mockHealWounds = CS.healWounds as jest.MockedFunction<typeof CS.healWounds>

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
    formData: { healing: 0 },
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
    mockHealWounds.mockReturnValue(mockCharacter)
    mockUpdateCharacter.mockResolvedValue(undefined)
  })

  describe('rendering', () => {
    it('should render heal button', () => {
      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeInTheDocument()
    })

    it('should render FavoriteIcon in button', () => {
      const { container } = renderWithTheme(<HealModal character={mockCharacter} />)
      
      const icon = container.querySelector('[data-testid="FavoriteIcon"]')
      expect(icon).toBeInTheDocument()
    })

    it('should not render dialog when closed', () => {
      renderWithTheme(<HealModal character={mockCharacter} />)
      
      expect(screen.queryByTestId('heal-dialog')).not.toBeInTheDocument()
    })

    it('should render dialog when open', () => {
      mockUseForm.mockReturnValue(createFormReturn({ open: true }))

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      expect(screen.getByTestId('heal-dialog')).toBeInTheDocument()
      expect(screen.getByText('Heal Wounds')).toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    beforeEach(() => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { healing: 5 } 
      }))
    })

    it('should handle opening the modal', () => {
      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const buttons = screen.getAllByRole('button')
      fireEvent.click(buttons[0])
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'open',
        payload: true
      })
    })

    it('should handle input changes', () => {
      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const input = screen.getByTestId('healing-input')
      fireEvent.change(input, { target: { value: '3' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'update',
        name: 'healing',
        value: 3
      })
    })

    it('should handle form cancellation', () => {
      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'reset',
        payload: expect.objectContaining({ formData: { healing: 0 } })
      })
    })
  })

  describe('form submission', () => {
    beforeEach(() => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { healing: 5 } 
      }))
    })

    it('should handle successful form submission', async () => {
      const healedCharacter = { ...mockCharacter, action_values: { ...mockCharacter.action_values, Wounds: 0 } }
      mockHealWounds.mockReturnValue(healedCharacter)

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const form = screen.getByTestId('heal-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'submit' })
        expect(mockHealWounds).toHaveBeenCalledWith(mockCharacter, 5)
        expect(mockUpdateCharacter).toHaveBeenCalledWith(healedCharacter, expect.objectContaining({ id: 'test-fight' }))
        expect(mockDispatchFight).toHaveBeenCalledWith({ type: FightActions.EDIT })
        expect(mockToastSuccess).toHaveBeenCalledWith('Test Character healed 5 Wounds.')
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'reset', payload: expect.objectContaining({ formData: { healing: 0 } }) })
      })
    })

    it('should handle form submission errors', async () => {
      const error = new Error('Network error')
      mockUpdateCharacter.mockRejectedValue(error)
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const form = screen.getByTestId('heal-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error healing wounds:', error)
        expect(mockToastError).toHaveBeenCalled()
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'reset', payload: expect.objectContaining({ formData: { healing: 0 } }) })
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('form validation', () => {
    it('should disable form when healing is 0', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: true, 
        formData: { healing: 0 } 
      }))

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeDisabled()
    })

    it('should enable form when healing is greater than 0', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { healing: 5 } 
      }))

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).not.toBeDisabled()
    })

    it('should disable form when saving', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        saving: true, 
        disabled: false, 
        formData: { healing: 5 } 
      }))

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeDisabled()
    })
  })

  describe('service integration', () => {
    beforeEach(() => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        saving: false, 
        disabled: false, 
        formData: { healing: 3 } 
      }))
    })

    it('should call CharacterService.healWounds with correct parameters', async () => {
      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const form = screen.getByTestId('heal-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      expect(mockHealWounds).toHaveBeenCalledWith(mockCharacter, 3)
    })

    it('should call client.updateCharacter with healed character', async () => {
      const healedCharacter = { ...mockCharacter, action_values: { ...mockCharacter.action_values, Wounds: 2 } }
      mockHealWounds.mockReturnValue(healedCharacter)

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const form = screen.getByTestId('heal-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockUpdateCharacter).toHaveBeenCalledWith(healedCharacter, expect.objectContaining({ id: 'test-fight' }))
      })
    })
  })

  describe('edge cases', () => {
    it('should handle null character gracefully', () => {
      renderWithTheme(<HealModal character={null as any} />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should handle invalid healing input', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { healing: 5 } 
      }))

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const input = screen.getByTestId('healing-input')
      fireEvent.change(input, { target: { value: 'invalid' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'update',
        name: 'healing',
        value: NaN
      })
    })

    it('should handle zero healing value', () => {
      mockUseForm.mockReturnValue(createFormReturn({
        open: true,
        saving: false,
        disabled: false,
        formData: { healing: 0 }
      }))

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const input = screen.getByTestId('healing-input')
      expect(input).toHaveAttribute('value', '')
    })

    it('should handle large healing values', async () => {
      mockUseForm.mockReturnValue(createFormReturn({
        open: true,
        saving: false,
        disabled: false,
        formData: { healing: 999 }
      }))

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const form = screen.getByTestId('heal-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      expect(mockHealWounds).toHaveBeenCalledWith(mockCharacter, 999)
    })
  })

  describe('accessibility', () => {
    it('should render accessible form elements', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { healing: 5 } 
      }))

      renderWithTheme(<HealModal character={mockCharacter} />)
      
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByTestId('healing-input')).toBeInTheDocument()
    })

    it('should have accessible button', () => {
      renderWithTheme(<HealModal character={mockCharacter} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeInTheDocument()
    })
  })
})