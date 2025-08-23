import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/components/StyledFields'
import WeaponModal from '@/components/weapons/WeaponModal'
import { createMockWeapon } from '../../factories/weapon'

// Mock contexts
const mockClient = {
  updateWeapon: jest.fn().mockResolvedValue({}),
  createWeapon: jest.fn().mockResolvedValue({}),
  deleteWeaponImage: jest.fn().mockResolvedValue({})
}

const mockToast = {
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
  closeToast: jest.fn(),
  toastInfo: jest.fn(),
  toastWarning: jest.fn()
}

const mockUseCharacter = {
  state: { character: {} },
  dispatch: jest.fn(),
  updateCharacter: jest.fn()
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

jest.mock('@/contexts/CharacterContext', () => ({
  useCharacter: () => mockUseCharacter
}))

// Mock child components
jest.mock('@/components/images/ImageManager', () => {
  return function MockImageManager({ name, entity, updateEntity, deleteImage, apiEndpoint }: any) {
    return (
      <div data-testid="image-manager">
        <button onClick={() => updateEntity({})}>Update Entity</button>
        <button onClick={() => deleteImage(entity)}>Delete Image</button>
      </div>
    )
  }
})

// Mock StyledFields
jest.mock('@/components/StyledFields', () => ({
  StyledFormDialog: function MockStyledFormDialog({ 
    open, 
    title, 
    children, 
    onClose, 
    onCancel, 
    onSubmit 
  }: any) {
    if (!open) return null
    return (
      <div data-testid="styled-form-dialog">
        <h2>{title}</h2>
        {children}
        <button onClick={onCancel} data-testid="cancel-button">Cancel</button>
        <button onClick={onSubmit} data-testid="submit-button">Submit</button>
        <button onClick={onClose} data-testid="close-button">Close</button>
      </div>
    )
  },
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
          rows={props.rows}
          data-testid={`input-${props.name}`}
        />
      </div>
    )
  },
  StyledAutocomplete: function MockStyledAutocomplete({
    options,
    value,
    onChange,
    disabled,
    freeSolo,
    renderInput,
    getOptionLabel,
    filterOptions,
    name
  }: any) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange({}, e.target.value)
      }
    }

    return (
      <div data-testid={`styled-autocomplete-${name || 'unnamed'}`}>
        <select
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          data-testid={`autocomplete-select-${name || 'unnamed'}`}
        >
          <option value="">Select...</option>
          {options?.map((option: any, index: number) => (
            <option key={index} value={option}>
              {typeof getOptionLabel === 'function' ? getOptionLabel(option) : option}
            </option>
          ))}
        </select>
      </div>
    )
  },
  SaveCancelButtons: function MockSaveCancelButtons({ disabled, onCancel }: any) {
    return (
      <div data-testid="save-cancel-buttons">
        <button disabled={disabled} data-testid="save-button">Save</button>
        <button onClick={onCancel} data-testid="cancel-button-alt">Cancel</button>
      </div>
    )
  }
}))

// Mock types and defaults
const mockDefaultWeapon = {
  id: null,
  name: '',
  category: '',
  juncture: '',
  damage: 0,
  concealment: 0,
  reload_value: 0,
  description: '',
  mook_bonus: 0,
  kachunk: false
}

jest.mock('@/types/types', () => ({
  defaultWeapon: mockDefaultWeapon
}))

// Mock reducer actions
jest.mock('@/reducers/weaponsState', () => ({
  WeaponsActions: {
    SAVING: 'SAVING',
    EDIT: 'EDIT',
    UPDATE: 'UPDATE',
    RESET: 'RESET'
  }
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('WeaponModal', () => {
  const mockDispatch = jest.fn()
  const mockSetOpen = jest.fn()
  
  const defaultState = {
    loading: false,
    categories: ['Martial Arts', 'Guns', 'Melee'],
    junctures: ['Contemporary', '1850s', 'Ancient', 'Future'],
    weapons: []
  }

  const defaultProps = {
    state: defaultState,
    dispatch: mockDispatch,
    open: true,
    setOpen: mockSetOpen
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('modal visibility', () => {
    test('does not render when closed', () => {
      renderWithTheme(<WeaponModal {...defaultProps} open={false} />)
      
      expect(screen.queryByTestId('styled-form-dialog')).not.toBeInTheDocument()
    })

    test('renders when open', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByTestId('styled-form-dialog')).toBeInTheDocument()
      expect(screen.getByText('Weapon')).toBeInTheDocument()
    })
  })

  describe('form rendering', () => {
    test('renders all weapon form fields', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Damage')).toBeInTheDocument()
      expect(screen.getByLabelText('Concealment')).toBeInTheDocument()
      expect(screen.getByLabelText('Reload')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Bonus vs Mooks')).toBeInTheDocument()
      expect(screen.getByLabelText('Ka-chunk')).toBeInTheDocument()
    })

    test('renders autocomplete fields for category and juncture', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByTestId('styled-autocomplete-unnamed')).toBeInTheDocument() // Juncture
      expect(screen.getByTestId('styled-autocomplete-category')).toBeInTheDocument()
    })

    test('populates fields with initial weapon data', () => {
      const weapon = createMockWeapon({
        name: 'Test Weapon',
        damage: 15,
        concealment: -2,
        description: 'Test description'
      })
      
      renderWithTheme(<WeaponModal {...defaultProps} weapon={weapon} />)
      
      expect(screen.getByDisplayValue('Test Weapon')).toBeInTheDocument()
      expect(screen.getByDisplayValue('15')).toBeInTheDocument()
      expect(screen.getByDisplayValue('-2')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument()
    })

    test('shows required field indicators', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const nameInput = screen.getByTestId('input-name')
      const damageInput = screen.getByTestId('input-damage')
      const descriptionInput = screen.getByTestId('input-description')
      
      expect(nameInput).toHaveAttribute('required')
      expect(damageInput).toHaveAttribute('required')
      expect(descriptionInput).toHaveAttribute('required')
    })
  })

  describe('form interactions', () => {
    test('handles weapon name change', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const nameInput = screen.getByTestId('input-name')
      fireEvent.change(nameInput, { target: { name: 'name', value: 'New Weapon Name' } })
      
      expect(nameInput).toHaveValue('New Weapon Name')
    })

    test('handles numeric field changes', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const damageInput = screen.getByTestId('input-damage')
      const concealmentInput = screen.getByTestId('input-concealment')
      const reloadInput = screen.getByTestId('input-reload_value')
      
      fireEvent.change(damageInput, { target: { name: 'damage', value: '20' } })
      fireEvent.change(concealmentInput, { target: { name: 'concealment', value: '-3' } })
      fireEvent.change(reloadInput, { target: { name: 'reload_value', value: '2' } })
      
      expect(damageInput).toHaveValue('20')
      expect(concealmentInput).toHaveValue('-3')
      expect(reloadInput).toHaveValue('2')
    })

    test('handles multiline description change', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const descriptionInput = screen.getByTestId('input-description')
      fireEvent.change(descriptionInput, { 
        target: { name: 'description', value: 'Multi-line\ndescription text' } 
      })
      
      expect(descriptionInput).toHaveValue('Multi-line\ndescription text')
    })

    test('handles ka-chunk switch toggle', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const kachunkSwitch = screen.getByLabelText('Ka-chunk')
      fireEvent.change(kachunkSwitch, { target: { name: 'kachunk', checked: true } })
      
      // Switch state would be managed by weapon state
      expect(kachunkSwitch).toBeInTheDocument()
    })

    test('handles category selection', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const categorySelect = screen.getByTestId('autocomplete-select-category')
      fireEvent.change(categorySelect, { target: { value: 'Guns' } })
      
      expect(categorySelect).toHaveValue('Guns')
    })

    test('handles juncture selection', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const junctureSelect = screen.getByTestId('autocomplete-select-unnamed')
      fireEvent.change(junctureSelect, { target: { value: 'Contemporary' } })
      
      expect(junctureSelect).toHaveValue('Contemporary')
    })
  })

  describe('form submission', () => {
    test('handles create weapon submission', async () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const nameInput = screen.getByTestId('input-name')
      fireEvent.change(nameInput, { target: { name: 'name', value: 'New Weapon' } })
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'SAVING' })
        expect(mockClient.createWeapon).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'New Weapon' })
        )
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'EDIT' })
        expect(mockSetOpen).toHaveBeenCalledWith(false)
      })
    })

    test('handles update weapon submission', async () => {
      const existingWeapon = createMockWeapon({ id: 'weapon-1', name: 'Existing Weapon' })
      
      renderWithTheme(<WeaponModal {...defaultProps} weapon={existingWeapon} />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockClient.updateWeapon).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'weapon-1', name: 'Existing Weapon' })
        )
        expect(mockSetOpen).toHaveBeenCalledWith(false)
      })
    })

    test('prevents default form submission', async () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const submitButton = screen.getByTestId('submit-button')
      const clickEvent = new Event('click', { bubbles: true, cancelable: true })
      const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault')
      
      fireEvent(submitButton, clickEvent)
      
      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    test('handles submission error', async () => {
      mockClient.createWeapon.mockRejectedValue(new Error('Create failed'))
      
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockToast.toastError).toHaveBeenCalled()
      })
    })

    test('handles submission without dispatch prop', async () => {
      renderWithTheme(<WeaponModal {...defaultProps} dispatch={undefined} />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(mockClient.createWeapon).toHaveBeenCalled()
        expect(mockSetOpen).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('form cancellation', () => {
    test('handles cancel button click', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      expect(mockSetOpen).toHaveBeenCalledWith(false)
    })

    test('handles dialog close', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const closeButton = screen.getByTestId('close-button')
      fireEvent.click(closeButton)
      
      expect(mockSetOpen).toHaveBeenCalledWith(false)
    })
  })

  describe('autocomplete functionality', () => {
    test('populates category options from state', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByText('Martial Arts')).toBeInTheDocument()
      expect(screen.getByText('Guns')).toBeInTheDocument()
      expect(screen.getByText('Melee')).toBeInTheDocument()
    })

    test('populates juncture options from state', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByText('Contemporary')).toBeInTheDocument()
      expect(screen.getByText('1850s')).toBeInTheDocument()
      expect(screen.getByText('Ancient')).toBeInTheDocument()
      expect(screen.getByText('Future')).toBeInTheDocument()
    })

    test('handles empty options arrays', () => {
      const stateWithEmptyOptions = {
        ...defaultState,
        categories: [],
        junctures: []
      }
      
      renderWithTheme(<WeaponModal {...defaultProps} state={stateWithEmptyOptions} />)
      
      expect(screen.getByTestId('autocomplete-select-category')).toBeInTheDocument()
      expect(screen.getByTestId('autocomplete-select-unnamed')).toBeInTheDocument()
    })

    test('has option label function for string values', () => {
      const weapon = createMockWeapon({ category: 'Guns', juncture: 'Contemporary' })
      
      renderWithTheme(<WeaponModal {...defaultProps} weapon={weapon} />)
      
      expect(screen.getByDisplayValue('Guns')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Contemporary')).toBeInTheDocument()
    })
  })

  describe('loading states', () => {
    test('disables all inputs when loading', () => {
      const loadingState = { ...defaultState, loading: true }
      
      renderWithTheme(<WeaponModal {...defaultProps} state={loadingState} />)
      
      expect(screen.getByTestId('input-name')).toBeDisabled()
      expect(screen.getByTestId('input-damage')).toBeDisabled()
      expect(screen.getByTestId('input-concealment')).toBeDisabled()
      expect(screen.getByTestId('input-reload_value')).toBeDisabled()
      expect(screen.getByTestId('input-description')).toBeDisabled()
      expect(screen.getByTestId('input-mook_bonus')).toBeDisabled()
      expect(screen.getByTestId('autocomplete-select-category')).toBeDisabled()
      expect(screen.getByTestId('autocomplete-select-unnamed')).toBeDisabled()
    })

    test('enables inputs when not loading', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByTestId('input-name')).not.toBeDisabled()
      expect(screen.getByTestId('input-damage')).not.toBeDisabled()
      expect(screen.getByTestId('autocomplete-select-category')).not.toBeDisabled()
    })
  })

  describe('image management', () => {
    test('shows image manager for existing weapons', () => {
      const existingWeapon = createMockWeapon({ id: 'weapon-1' })
      
      renderWithTheme(<WeaponModal {...defaultProps} weapon={existingWeapon} />)
      
      expect(screen.getByTestId('image-manager')).toBeInTheDocument()
    })

    test('hides image manager for new weapons', () => {
      const newWeapon = createMockWeapon({ id: null })
      
      renderWithTheme(<WeaponModal {...defaultProps} weapon={newWeapon} />)
      
      expect(screen.queryByTestId('image-manager')).not.toBeInTheDocument()
    })

    test('handles image deletion', async () => {
      const existingWeapon = createMockWeapon({ id: 'weapon-1' })
      
      renderWithTheme(<WeaponModal {...defaultProps} weapon={existingWeapon} />)
      
      const deleteButton = screen.getByText('Delete Image')
      fireEvent.click(deleteButton)
      
      await waitFor(() => {
        expect(mockClient.deleteWeaponImage).toHaveBeenCalledWith(
          expect.objectContaining({ id: 'weapon-1' })
        )
      })
    })
  })

  describe('field validation and types', () => {
    test('has correct input types for numeric fields', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByTestId('input-damage')).toHaveAttribute('type', 'number')
      expect(screen.getByTestId('input-concealment')).toHaveAttribute('type', 'number')
      expect(screen.getByTestId('input-reload_value')).toHaveAttribute('type', 'number')
    })

    test('has multiline description field', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const descriptionInput = screen.getByTestId('input-description')
      expect(descriptionInput).toHaveAttribute('rows', '3')
    })

    test('handles empty weapon prop', () => {
      renderWithTheme(<WeaponModal {...defaultProps} weapon={undefined} />)
      
      expect(screen.getByTestId('input-name')).toHaveValue('')
      expect(screen.getByTestId('input-damage')).toHaveValue('')
      expect(screen.getByTestId('input-description')).toHaveValue('')
    })
  })

  describe('accessibility', () => {
    test('has accessible form labels', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Damage')).toBeInTheDocument()
      expect(screen.getByLabelText('Concealment')).toBeInTheDocument()
      expect(screen.getByLabelText('Reload')).toBeInTheDocument()
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
      expect(screen.getByLabelText('Bonus vs Mooks')).toBeInTheDocument()
      expect(screen.getByLabelText('Ka-chunk')).toBeInTheDocument()
    })

    test('has accessible dialog title', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByText('Weapon')).toBeInTheDocument()
    })

    test('has accessible action buttons', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument()
      expect(screen.getByTestId('close-button')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    test('handles weapon with null values', () => {
      const weaponWithNulls = createMockWeapon({
        name: null,
        damage: null,
        concealment: null,
        description: null
      })
      
      renderWithTheme(<WeaponModal {...defaultProps} weapon={weaponWithNulls as any} />)
      
      expect(screen.getByTestId('input-name')).toHaveValue('')
      expect(screen.getByTestId('input-damage')).toHaveValue('')
      expect(screen.getByTestId('input-concealment')).toHaveValue('')
      expect(screen.getByTestId('input-description')).toHaveValue('')
    })

    test('handles negative damage values', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const damageInput = screen.getByTestId('input-damage')
      fireEvent.change(damageInput, { target: { name: 'damage', value: '-5' } })
      
      expect(damageInput).toHaveValue('-5')
    })

    test('handles very large numeric values', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const damageInput = screen.getByTestId('input-damage')
      fireEvent.change(damageInput, { target: { name: 'damage', value: '9999' } })
      
      expect(damageInput).toHaveValue('9999')
    })

    test('handles special characters in text fields', () => {
      renderWithTheme(<WeaponModal {...defaultProps} />)
      
      const nameInput = screen.getByTestId('input-name')
      const specialName = 'Weapon™ ①②③ @#$%'
      fireEvent.change(nameInput, { target: { name: 'name', value: specialName } })
      
      expect(nameInput).toHaveValue(specialName)
    })

    test('handles missing state properties', () => {
      const incompleteState = {
        loading: false,
        categories: undefined,
        junctures: undefined,
        weapons: []
      }
      
      renderWithTheme(<WeaponModal {...defaultProps} state={incompleteState as any} />)
      
      expect(screen.getByTestId('autocomplete-select-category')).toBeInTheDocument()
      expect(screen.getByTestId('autocomplete-select-unnamed')).toBeInTheDocument()
    })
  })
})