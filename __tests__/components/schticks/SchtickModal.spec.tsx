import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/components/StyledFields'
import SchtickModal from '@/components/schticks/SchtickModal'
import { createMockSchtick } from '../../factories/schtick'

// Mock contexts
const mockClient = {
  updateSchtick: jest.fn().mockResolvedValue({}),
  createSchtick: jest.fn().mockResolvedValue({})
}

const mockToast = {
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
  closeToast: jest.fn(),
  toastInfo: jest.fn(),
  toastWarning: jest.fn()
}

jest.mock('@/contexts', () => ({
  useClient: () => ({
    client: mockClient,
    user: { id: 'user-1', gamemaster: true }
  }),
  useToast: () => mockToast
}))

// Mock child components
jest.mock('@/components/editor', () => ({
  Editor: function MockEditor({ name, value, onChange }: any) {
    return (
      <div data-testid="editor">
        <label>Description Editor</label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          data-testid="editor-textarea"
        />
      </div>
    )
  }
}))

// Mock StyledFields
jest.mock('@/components/StyledFields', () => ({
  StyledTextField: function MockStyledTextField(props: any) {
    return (
      <div data-testid="styled-text-field">
        <label>{props.label}</label>
        <input
          type={props.type || 'text'}
          name={props.name}
          value={props.value || ''}
          onChange={props.onChange}
          required={props.required}
          disabled={props.disabled}
          data-testid={`input-${props.name}`}
        />
      </div>
    )
  },
  StyledDialog: function MockStyledDialog({ 
    open, 
    title, 
    children, 
    onClose, 
    onSubmit, 
    disabled 
  }: any) {
    if (!open) return null
    return (
      <div data-testid="styled-dialog">
        <h2>{title}</h2>
        <form onSubmit={onSubmit} data-testid="schtick-form">
          {children}
        </form>
        <button onClick={onClose} data-testid="close-dialog">Close</button>
      </div>
    )
  },
  SaveCancelButtons: function MockSaveCancelButtons({ disabled, onCancel }: any) {
    return (
      <div data-testid="save-cancel-buttons">
        <button type="submit" disabled={disabled} data-testid="save-button">
          Save
        </button>
        <button type="button" onClick={onCancel} data-testid="cancel-button">
          Cancel
        </button>
      </div>
    )
  }
}))

// Mock types and defaults
const mockDefaultSchtick = {
  id: null,
  name: '',
  category: '',
  path: '',
  description: ''
}

jest.mock('@/types/types', () => ({
  defaultSchtick: mockDefaultSchtick
}))

// Mock form reducer
const mockInitialFormState = {
  open: false,
  saving: false,
  disabled: false,
  formData: { schtick: mockDefaultSchtick }
}

const mockDispatchForm = jest.fn()

jest.mock('@/reducers/formState', () => ({
  FormActions: {
    UPDATE: 'UPDATE',
    SUBMIT: 'SUBMIT',
    RESET: 'RESET'
  },
  useForm: jest.fn(() => ({
    formState: mockInitialFormState,
    dispatchForm: mockDispatchForm,
    initialFormState: mockInitialFormState
  }))
}))

// Mock schticks reducer
jest.mock('@/reducers/schticksState', () => ({
  SchticksActions: {
    EDIT: 'EDIT',
    UPDATE: 'UPDATE',
    CREATE: 'CREATE'
  }
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('SchtickModal', () => {
  const mockDispatch = jest.fn()
  const mockSetOpen = jest.fn()
  
  const defaultState = {
    loading: false,
    category: 'Martial Arts',
    path: 'Tiger',
    schticks: []
  }

  const defaultProps = {
    open: true,
    setOpen: mockSetOpen,
    state: defaultState,
    dispatch: mockDispatch
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset form state mock
    const mockUseForm = require('@/reducers/formState').useForm
    mockUseForm.mockReturnValue({
      formState: {
        saving: false,
        disabled: false,
        formData: { schtick: mockDefaultSchtick }
      },
      dispatchForm: mockDispatchForm,
      initialFormState: mockInitialFormState
    })
  })

  describe('modal visibility', () => {
    test('does not render when closed', () => {
      renderWithTheme(<SchtickModal {...defaultProps} open={false} />)
      
      expect(screen.queryByTestId('styled-dialog')).not.toBeInTheDocument()
    })

    test('renders when open', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('styled-dialog')).toBeInTheDocument()
      expect(screen.getByText('Schtick')).toBeInTheDocument()
    })
  })

  describe('form rendering', () => {
    test('renders all schtick form fields', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Category')).toBeInTheDocument()
      expect(screen.getByLabelText('Path')).toBeInTheDocument()
      expect(screen.getByLabelText('Description Editor')).toBeInTheDocument()
    })

    test('renders save and cancel buttons', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('save-button')).toBeInTheDocument()
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument()
    })

    test('populates fields with initial schtick data', () => {
      const schtick = createMockSchtick({
        name: 'Test Schtick',
        category: 'Martial Arts',
        path: 'Tiger',
        description: 'Test description'
      })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          saving: false,
          disabled: false,
          formData: { schtick }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<SchtickModal {...defaultProps} schtick={schtick} />)
      
      expect(screen.getByDisplayValue('Test Schtick')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Martial Arts')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Tiger')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
    })

    test('has proper form structure', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('schtick-form')).toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    test('handles schtick name change', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const nameInput = screen.getByTestId('input-name')
      fireEvent.change(nameInput, { target: { name: 'name', value: 'New Schtick Name' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'schtick',
        value: expect.objectContaining({
          name: 'New Schtick Name'
        })
      })
    })

    test('handles category change', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const categoryInput = screen.getByTestId('input-category')
      fireEvent.change(categoryInput, { target: { name: 'category', value: 'Guns' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'schtick',
        value: expect.objectContaining({
          category: 'Guns'
        })
      })
    })

    test('handles path change', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const pathInput = screen.getByTestId('input-path')
      fireEvent.change(pathInput, { target: { name: 'path', value: 'Dragon' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'schtick',
        value: expect.objectContaining({
          path: 'Dragon'
        })
      })
    })

    test('handles description change through editor', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const editorTextarea = screen.getByTestId('editor-textarea')
      fireEvent.change(editorTextarea, { 
        target: { name: 'description', value: 'New description content' } 
      })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'schtick',
        value: expect.objectContaining({
          description: 'New description content'
        })
      })
    })

    test('updates multiple fields independently', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const nameInput = screen.getByTestId('input-name')
      const categoryInput = screen.getByTestId('input-category')
      
      fireEvent.change(nameInput, { target: { name: 'name', value: 'Schtick Name' } })
      fireEvent.change(categoryInput, { target: { name: 'category', value: 'Sorcery' } })
      
      expect(mockDispatchForm).toHaveBeenCalledTimes(2)
    })
  })

  describe('form submission', () => {
    test('handles create schtick submission', async () => {
      const newSchtick = createMockSchtick({ id: null, name: 'New Schtick' })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          saving: false,
          disabled: false,
          formData: { schtick: newSchtick }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const form = screen.getByTestId('schtick-form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockClient.createSchtick).toHaveBeenCalledWith(newSchtick)
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'EDIT' })
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Schtick updated.')
        expect(mockDispatchForm).toHaveBeenCalledWith({
          type: 'RESET',
          payload: mockInitialFormState
        })
        expect(mockSetOpen).toHaveBeenCalledWith(false)
      })
    })

    test('handles update schtick submission', async () => {
      const existingSchtick = createMockSchtick({ id: 'schtick-1', name: 'Existing Schtick' })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          saving: false,
          disabled: false,
          formData: { schtick: existingSchtick }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const form = screen.getByTestId('schtick-form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockClient.updateSchtick).toHaveBeenCalledWith(existingSchtick)
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'EDIT' })
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Schtick updated.')
      })
    })

    test('prevents default form submission', async () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const form = screen.getByTestId('schtick-form')
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault')
      
      fireEvent(form, submitEvent)
      
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('handles submission error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockClient.createSchtick.mockRejectedValue(new Error('Create failed'))
      
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const form = screen.getByTestId('schtick-form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
        expect(mockToast.toastError).toHaveBeenCalled()
        expect(mockDispatchForm).toHaveBeenCalledWith({
          type: 'RESET',
          payload: mockInitialFormState
        })
        expect(mockSetOpen).toHaveBeenCalledWith(false)
      })
      
      consoleSpy.mockRestore()
    })

    test('closes modal after successful submission', async () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const form = screen.getByTestId('schtick-form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockSetOpen).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('form cancellation', () => {
    test('handles cancel button click', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'RESET',
        payload: mockInitialFormState
      })
      expect(mockSetOpen).toHaveBeenCalledWith(false)
    })

    test('handles dialog close', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const closeButton = screen.getByTestId('close-dialog')
      fireEvent.click(closeButton)
      
      expect(mockSetOpen).toHaveBeenCalledWith(false)
    })

    test('resets form state when cancelled', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'RESET',
        payload: mockInitialFormState
      })
    })
  })

  describe('form state management', () => {
    test('initializes form with provided schtick', () => {
      const schtick = createMockSchtick({ name: 'Initial Schtick' })
      
      renderWithTheme(<SchtickModal {...defaultProps} schtick={schtick} />)
      
      const mockUseForm = require('@/reducers/formState').useForm
      expect(mockUseForm).toHaveBeenCalledWith({ schtick })
    })

    test('initializes form with default schtick when none provided', () => {
      renderWithTheme(<SchtickModal {...defaultProps} schtick={undefined} />)
      
      const mockUseForm = require('@/reducers/formState').useForm
      expect(mockUseForm).toHaveBeenCalledWith({ schtick: mockDefaultSchtick })
    })

    test('uses form state for rendering', () => {
      const formSchtick = createMockSchtick({ name: 'Form State Schtick' })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          saving: false,
          disabled: false,
          formData: { schtick: formSchtick }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByDisplayValue('Form State Schtick')).toBeInTheDocument()
    })
  })

  describe('disabled states', () => {
    test('disables buttons when saving', () => {
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          saving: true,
          disabled: false,
          formData: { schtick: mockDefaultSchtick }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('save-button')).toBeDisabled()
    })

    test('disables buttons when disabled flag is set', () => {
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          saving: false,
          disabled: true,
          formData: { schtick: mockDefaultSchtick }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('save-button')).toBeDisabled()
    })

    test('enables buttons when not saving or disabled', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('save-button')).not.toBeDisabled()
    })
  })

  describe('editor integration', () => {
    test('renders rich text editor for description', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('editor')).toBeInTheDocument()
      expect(screen.getByTestId('editor-textarea')).toBeInTheDocument()
    })

    test('passes correct props to editor', () => {
      const schtick = createMockSchtick({ description: 'Editor content' })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          saving: false,
          disabled: false,
          formData: { schtick }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByDisplayValue('Editor content')).toBeInTheDocument()
    })

    test('handles editor content changes', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const editorTextarea = screen.getByTestId('editor-textarea')
      fireEvent.change(editorTextarea, { 
        target: { name: 'description', value: 'Rich text content' } 
      })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'schtick',
        value: expect.objectContaining({
          description: 'Rich text content'
        })
      })
    })
  })

  describe('accessibility', () => {
    test('has accessible form labels', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByLabelText('Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Category')).toBeInTheDocument()
      expect(screen.getByLabelText('Path')).toBeInTheDocument()
      expect(screen.getByLabelText('Description Editor')).toBeInTheDocument()
    })

    test('has accessible dialog title', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByText('Schtick')).toBeInTheDocument()
    })

    test('has accessible action buttons', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test('has proper form structure for screen readers', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('schtick-form')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    test('handles schtick with null values', () => {
      const schtickWithNulls = createMockSchtick({
        name: null,
        category: null,
        path: null,
        description: null
      })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          saving: false,
          disabled: false,
          formData: { schtick: schtickWithNulls }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('input-name')).toHaveValue('')
      expect(screen.getByTestId('input-category')).toHaveValue('')
      expect(screen.getByTestId('input-path')).toHaveValue('')
      expect(screen.getByTestId('editor-textarea')).toHaveValue('')
    })

    test('handles special characters in text fields', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const nameInput = screen.getByTestId('input-name')
      const specialName = 'Schtick™ ①②③ @#$%'
      fireEvent.change(nameInput, { target: { name: 'name', value: specialName } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'schtick',
        value: expect.objectContaining({
          name: specialName
        })
      })
    })

    test('handles very long text content', () => {
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      const longText = 'A'.repeat(1000)
      const nameInput = screen.getByTestId('input-name')
      fireEvent.change(nameInput, { target: { name: 'name', value: longText } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'schtick',
        value: expect.objectContaining({
          name: longText
        })
      })
    })

    test('handles missing state properties', () => {
      const incompleteState = {
        loading: false,
        category: undefined,
        path: undefined,
        schticks: []
      }
      
      renderWithTheme(<SchtickModal {...defaultProps} state={incompleteState as any} />)
      
      expect(screen.getByTestId('styled-dialog')).toBeInTheDocument()
    })

    test('handles empty schtick object', () => {
      const emptySchtick = {} as any
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          saving: false,
          disabled: false,
          formData: { schtick: emptySchtick }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<SchtickModal {...defaultProps} />)
      
      expect(screen.getByTestId('input-name')).toHaveValue('')
      expect(screen.getByTestId('input-category')).toHaveValue('')
      expect(screen.getByTestId('input-path')).toHaveValue('')
    })
  })
})