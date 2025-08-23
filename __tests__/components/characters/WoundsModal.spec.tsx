import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import WoundsModal from '../../../components/characters/WoundsModal'
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
  calculateWounds: jest.fn(),
  takeSmackdown: jest.fn()
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
      data-testid="smackdown-input"
      type="number"
      onChange={onChange}
      value={value || ''}
      {...props}
    />
  ),
  StyledFormDialog: ({ children, open, onSubmit, onCancel, title, disabled }: any) => (
    open ? (
      <div data-testid="wounds-dialog">
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

describe('WoundsModal', () => {
  const mockCharacter: Person = {
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Character',
    category: 'character' as const
  }

  const mockDispatchForm = jest.fn()
  const mockUseForm = useForm as jest.MockedFunction<typeof useForm>
  const mockCalculateWounds = CS.calculateWounds as jest.MockedFunction<typeof CS.calculateWounds>
  const mockTakeSmackdown = CS.takeSmackdown as jest.MockedFunction<typeof CS.takeSmackdown>

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
    formData: { smackdown: 0 },
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
    mockCalculateWounds.mockReturnValue(3)
    mockTakeSmackdown.mockReturnValue(mockCharacter)
    mockUpdateCharacter.mockResolvedValue(undefined)
  })

  describe('rendering', () => {
    it('should render wounds button', () => {
      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeInTheDocument()
    })

    it('should render HeartBrokenIcon in button', () => {
      const { container } = renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const icon = container.querySelector('[data-testid="HeartBrokenIcon"]')
      expect(icon).toBeInTheDocument()
    })

    it('should not render dialog when closed', () => {
      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      expect(screen.queryByTestId('wounds-dialog')).not.toBeInTheDocument()
    })

    it('should render dialog when open', () => {
      mockUseForm.mockReturnValue(createFormReturn({ open: true }))

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      expect(screen.getByTestId('wounds-dialog')).toBeInTheDocument()
      expect(screen.getByText('Smackdown')).toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    beforeEach(() => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { smackdown: 5 } 
      }))
    })

    it('should handle opening the modal', () => {
      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const buttons = screen.getAllByRole('button')
      fireEvent.click(buttons[0])
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'open',
        payload: true
      })
    })

    it('should handle input changes', () => {
      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const input = screen.getByTestId('smackdown-input')
      fireEvent.change(input, { target: { value: '8' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'update',
        name: 'smackdown',
        value: 8
      })
    })

    it('should handle form cancellation', () => {
      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'reset',
        payload: expect.objectContaining({ formData: { smackdown: 0 } })
      })
    })
  })

  describe('form submission', () => {
    beforeEach(() => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { smackdown: 8 } 
      }))
    })

    it('should handle successful form submission', async () => {
      const damagedCharacter = { ...mockCharacter, action_values: { ...mockCharacter.action_values, Wounds: 3 } }
      mockCalculateWounds.mockReturnValue(3)
      mockTakeSmackdown.mockReturnValue(damagedCharacter)

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const form = screen.getByTestId('wounds-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'submit' })
        expect(mockCalculateWounds).toHaveBeenCalledWith(mockCharacter, 8)
        expect(mockTakeSmackdown).toHaveBeenCalledWith(mockCharacter, 8)
        expect(mockUpdateCharacter).toHaveBeenCalledWith(damagedCharacter, expect.objectContaining({ id: 'test-fight' }))
        expect(mockDispatchFight).toHaveBeenCalledWith({ type: FightActions.EDIT })
        expect(mockToastSuccess).toHaveBeenCalledWith('Test Character took a smackdown of 8, causing 3 wounds.')
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'reset', payload: expect.objectContaining({ formData: { smackdown: 0 } }) })
      })
    })

    it('should handle form submission errors', async () => {
      const error = new Error('Network error')
      mockUpdateCharacter.mockRejectedValue(error)
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const form = screen.getByTestId('wounds-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(error)
        expect(mockToastError).toHaveBeenCalled()
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'reset', payload: expect.objectContaining({ formData: { smackdown: 0 } }) })
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('form validation', () => {
    it('should disable form when smackdown is 0', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: true, 
        formData: { smackdown: 0 } 
      }))

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeDisabled()
    })

    it('should enable form when smackdown is greater than 0', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { smackdown: 8 } 
      }))

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).not.toBeDisabled()
    })

    it('should disable form when saving', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        saving: true, 
        disabled: false, 
        formData: { smackdown: 8 } 
      }))

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
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
        formData: { smackdown: 6 } 
      }))
    })

    it('should call CharacterService methods with correct parameters', async () => {
      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const form = screen.getByTestId('wounds-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      expect(mockCalculateWounds).toHaveBeenCalledWith(mockCharacter, 6)
      expect(mockTakeSmackdown).toHaveBeenCalledWith(mockCharacter, 6)
    })

    it('should call client.updateCharacter with damaged character', async () => {
      const damagedCharacter = { ...mockCharacter, action_values: { ...mockCharacter.action_values, Wounds: 5 } }
      mockTakeSmackdown.mockReturnValue(damagedCharacter)

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const form = screen.getByTestId('wounds-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      await waitFor(() => {
        expect(mockUpdateCharacter).toHaveBeenCalledWith(damagedCharacter, expect.objectContaining({ id: 'test-fight' }))
      })
    })
  })

  describe('edge cases', () => {
    it('should handle null character gracefully', () => {
      renderWithTheme(<WoundsModal character={null as any} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeInTheDocument()
    })

    it('should handle invalid smackdown input', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { smackdown: 8 } 
      }))

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const input = screen.getByTestId('smackdown-input')
      fireEvent.change(input, { target: { value: 'invalid' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'update',
        name: 'smackdown',
        value: NaN
      })
    })

    it('should handle zero smackdown value', () => {
      mockUseForm.mockReturnValue(createFormReturn({
        open: true,
        saving: false,
        disabled: false,
        formData: { smackdown: 0 }
      }))

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const input = screen.getByTestId('smackdown-input')
      expect(input).toHaveAttribute('value', '')
    })

    it('should handle large smackdown values', async () => {
      mockUseForm.mockReturnValue(createFormReturn({
        open: true,
        saving: false,
        disabled: false,
        formData: { smackdown: 999 }
      }))

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const form = screen.getByTestId('wounds-dialog').querySelector('form')
      
      await act(async () => {
        fireEvent.submit(form!)
      })

      expect(mockCalculateWounds).toHaveBeenCalledWith(mockCharacter, 999)
      expect(mockTakeSmackdown).toHaveBeenCalledWith(mockCharacter, 999)
    })
  })

  describe('accessibility', () => {
    it('should render accessible form elements', () => {
      mockUseForm.mockReturnValue(createFormReturn({ 
        open: true, 
        disabled: false, 
        formData: { smackdown: 8 } 
      }))

      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByTestId('smackdown-input')).toBeInTheDocument()
    })

    it('should have accessible button', () => {
      renderWithTheme(<WoundsModal character={mockCharacter} />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons[0]).toBeInTheDocument()
    })
  })
})