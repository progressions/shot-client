import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/components/StyledFields'
import VehicleModal from '@/components/vehicles/VehicleModal'
import { createMockVehicle } from '../../factories/vehicle'
import { createMockCharacter } from '../../factories/character'
import { createMockFight } from '../../factories/fight'

// Mock contexts
const mockDispatchFight = jest.fn()
const mockUseFight = {
  fight: createMockFight(),
  dispatch: mockDispatchFight,
  state: { attacking: false, saving: false, initiative: false }
}

const mockClient = {
  createVehicle: jest.fn().mockResolvedValue({ id: 'vehicle-1', name: 'Test Vehicle' }),
  updateVehicle: jest.fn().mockResolvedValue({ id: 'vehicle-1', name: 'Updated Vehicle' })
}

const mockToast = {
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
  closeToast: jest.fn(),
  toastInfo: jest.fn(),
  toastWarning: jest.fn()
}

jest.mock('@/contexts/FightContext', () => ({
  useFight: () => mockUseFight
}))

jest.mock('@/contexts/ClientContext', () => ({
  useClient: () => ({
    client: mockClient,
    user: { id: 'user-1', gamemaster: true }
  })
}))

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => mockToast
}))

// Mock services
jest.mock('@/services/VehicleService', () => ({
  isType: jest.fn((vehicle, type) => vehicle?.action_values?.Type === type),
  updateActionValue: jest.fn((vehicle, name, value) => ({
    ...vehicle,
    action_values: { ...vehicle.action_values, [name]: value }
  })),
  updateDriver: jest.fn((vehicle, driver) => ({ ...vehicle, driver })),
  updateFromArchetype: jest.fn((vehicle, archetype) => ({
    ...vehicle,
    archetype: archetype.name,
    action_values: { ...vehicle.action_values, ...archetype.action_values }
  }))
}))

// Mock child components
jest.mock('@/components/characters/edit/ColorPicker', () => {
  return function MockColorPicker({ character, onChange, setCharacter }: any) {
    return (
      <div data-testid="color-picker">
        <button onClick={() => onChange({ target: { name: 'color', value: '#ff0000' } })}>
          Change Color
        </button>
      </div>
    )
  }
})

jest.mock('@/components/PlayerTypeOnly', () => {
  return function MockPlayerTypeOnly({ character, only, except, children }: any) {
    const characterType = character?.action_values?.Type || 'Vehicle'
    
    if (only && characterType !== only) return null
    if (except && characterType === except) return null
    
    return <div data-testid="player-type-only">{children}</div>
  }
})

jest.mock('@/components/characters/edit/CharacterType', () => {
  return function MockCharacterType({ value, onChange }: any) {
    return (
      <div data-testid="character-type">
        <select
          value={value}
          onChange={(e) => onChange(e, e.target.value)}
          data-testid="character-type-select"
        >
          <option value="Vehicle">Vehicle</option>
          <option value="Mook">Mook</option>
        </select>
      </div>
    )
  }
})

jest.mock('@/components/vehicles/PositionSelector', () => {
  return function MockPositionSelector({ character, onChange }: any) {
    return (
      <div data-testid="position-selector">
        <input
          data-testid="position-input"
          onChange={(e) => onChange({ target: { name: 'Position', value: e.target.value } })}
          name="Position"
        />
      </div>
    )
  }
})

jest.mock('@/components/vehicles/PursuerSelector', () => {
  return function MockPursuerSelector({ character, onChange }: any) {
    return (
      <div data-testid="pursuer-selector">
        <input
          data-testid="pursuer-input"
          onChange={(e) => onChange({ target: { name: 'Pursuer', value: e.target.value } })}
          name="Pursuer"
        />
      </div>
    )
  }
})

jest.mock('@/components/vehicles/DriverSelector', () => {
  return function MockDriverSelector({ vehicle, onChange }: any) {
    return (
      <div data-testid="driver-selector">
        <button onClick={() => onChange(createMockCharacter({ name: 'Test Driver' }))}>
          Set Driver
        </button>
      </div>
    )
  }
})

jest.mock('@/components/vehicles/VehicleArchetypeSelector', () => {
  return function MockArchetypeSelector({ vehicle, onChange }: any) {
    return (
      <div data-testid="archetype-selector">
        <select
          onChange={(e) => onChange({ 
            name: e.target.value, 
            action_values: { Type: 'Vehicle', Acceleration: 8, Handling: 7 }
          })}
          data-testid="archetype-select"
        >
          <option value="">Select Archetype</option>
          <option value="Sports Car">Sports Car</option>
          <option value="Motorcycle">Motorcycle</option>
        </select>
      </div>
    )
  }
})

// Mock StyledFields
jest.mock('@/components/StyledFields', () => ({
  StyledTextField: function MockStyledTextField(props: any) {
    return (
      <div data-testid="styled-text-field">
        <label>{props.label}</label>
        <input
          type={props.type}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          required={props.required}
          autoFocus={props.autoFocus}
          data-testid={`styled-input-${props.name?.replace(/\s+/g, '-')?.toLowerCase()}`}
        />
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
  },
  StyledDialog: function MockStyledDialog({ open, title, children, onClose, onSubmit }: any) {
    if (!open) return null
    return (
      <div data-testid="styled-dialog">
        <h2>{title}</h2>
        <form onSubmit={onSubmit} data-testid="vehicle-form">
          {children}
        </form>
        <button onClick={onClose} data-testid="close-dialog">Close</button>
      </div>
    )
  }
}))

// Mock form reducer
const mockInitialFormState = {
  open: false,
  saving: false,
  disabled: false,
  formData: { character: createMockVehicle() }
}

jest.mock('@/reducers/formState', () => ({
  FormActions: {
    UPDATE: 'UPDATE',
    OPEN: 'OPEN',
    SUBMIT: 'SUBMIT',
    RESET: 'RESET'
  },
  useForm: jest.fn(() => ({
    formState: mockInitialFormState,
    dispatchForm: jest.fn(),
    initialFormState: mockInitialFormState
  }))
}))

jest.mock('@/reducers/fightState', () => ({
  FightActions: {
    EDIT: 'EDIT'
  }
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('VehicleModal', () => {
  const mockDispatchForm = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset mock form state
    const mockUseForm = require('@/reducers/formState').useForm
    mockUseForm.mockReturnValue({
      formState: {
        open: true,
        saving: false,
        disabled: false,
        formData: { 
          character: createMockVehicle({ 
            name: 'Test Vehicle',
            action_values: {
              Type: 'Vehicle',
              'Chase Points': 30,
              'Condition Points': 40,
              Acceleration: 8,
              Handling: 7,
              Squeal: 6,
              Frame: 9,
              Crunch: 10
            }
          })
        }
      },
      dispatchForm: mockDispatchForm,
      initialFormState: mockInitialFormState
    })
  })

  describe('basic rendering', () => {
    test('renders vehicle modal dialog when open', () => {
      const vehicle = createMockVehicle({ name: 'Test Vehicle', id: 'vehicle-1' })
      
      renderWithTheme(<VehicleModal character={vehicle} />)
      
      expect(screen.getByTestId('styled-dialog')).toBeInTheDocument()
      expect(screen.getByText('Update Vehicle')).toBeInTheDocument()
    })

    test('shows create dialog for new vehicles', () => {
      const newVehicle = createMockVehicle({ name: 'New Vehicle', id: null })
      
      renderWithTheme(<VehicleModal character={newVehicle} />)
      
      expect(screen.getByText('Create Vehicle')).toBeInTheDocument()
    })

    test('renders vehicle name input', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByTestId('styled-input-name')).toHaveAttribute('required')
      expect(screen.getByTestId('styled-input-name')).toHaveAttribute('autofocus')
    })

    test('renders task switch', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByLabelText('Task')).toBeInTheDocument()
    })

    test('renders all action value inputs', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByLabelText('Acceleration')).toBeInTheDocument()
      expect(screen.getByLabelText('Handling')).toBeInTheDocument()
      expect(screen.getByLabelText('Squeal')).toBeInTheDocument()
      expect(screen.getByLabelText('Frame')).toBeInTheDocument()
      expect(screen.getByLabelText('Crunch')).toBeInTheDocument()
    })

    test('renders vehicle-specific components', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByTestId('archetype-selector')).toBeInTheDocument()
      expect(screen.getByTestId('color-picker')).toBeInTheDocument()
      expect(screen.getByTestId('position-selector')).toBeInTheDocument()
      expect(screen.getByTestId('pursuer-selector')).toBeInTheDocument()
    })
  })

  describe('conditional rendering', () => {
    test('shows chase points and condition points for non-mook vehicles', () => {
      const vehicle = createMockVehicle({ action_values: { Type: 'Vehicle' } })
      
      renderWithTheme(<VehicleModal character={vehicle} />)
      
      expect(screen.getByLabelText('Chase')).toBeInTheDocument()
      expect(screen.getByLabelText('Condition')).toBeInTheDocument()
    })

    test('shows mook count for mook vehicles', () => {
      const mockIsType = require('@/services/VehicleService').isType
      mockIsType.mockImplementation((vehicle, type) => type === 'Mook')
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: false,
          disabled: false,
          formData: { 
            character: createMockVehicle({ 
              action_values: { Type: 'Mook' },
              count: 5
            })
          }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByLabelText('Mooks')).toBeInTheDocument()
    })

    test('shows driver selector only for existing vehicles', () => {
      const existingVehicle = createMockVehicle({ id: 'vehicle-1' })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: false,
          disabled: false,
          formData: { character: existingVehicle }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={existingVehicle} />)
      
      expect(screen.getByTestId('driver-selector')).toBeInTheDocument()
    })

    test('hides driver selector for new vehicles', () => {
      const newVehicle = createMockVehicle({ id: null })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: false,
          disabled: false,
          formData: { character: newVehicle }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={newVehicle} />)
      
      expect(screen.queryByTestId('driver-selector')).not.toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    test('handles vehicle name change', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const nameInput = screen.getByTestId('styled-input-name')
      fireEvent.change(nameInput, { target: { name: 'name', value: 'New Vehicle Name' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: expect.objectContaining({
          name: 'New Vehicle Name'
        })
      })
    })

    test('handles task switch toggle', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const taskSwitch = screen.getByLabelText('Task')
      fireEvent.change(taskSwitch, { target: { name: 'task', checked: true } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: expect.objectContaining({
          task: true
        })
      })
    })

    test('handles action value changes', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const accelerationInput = screen.getByTestId('styled-input-acceleration')
      fireEvent.change(accelerationInput, { target: { name: 'Acceleration', value: '10' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: expect.objectContaining({
          action_values: expect.objectContaining({
            Acceleration: '10'
          })
        })
      })
    })

    test('handles impairments change', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const impairmentsInput = screen.getByLabelText('Impairments')
      fireEvent.change(impairmentsInput, { target: { name: 'impairments', value: '2' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: expect.objectContaining({
          impairments: '2'
        })
      })
    })

    test('handles color picker changes', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const changeColorButton = screen.getByText('Change Color')
      fireEvent.click(changeColorButton)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: expect.objectContaining({
          color: '#ff0000'
        })
      })
    })
  })

  describe('specialized handlers', () => {
    test('handles driver selection', () => {
      const existingVehicle = createMockVehicle({ id: 'vehicle-1' })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: false,
          disabled: false,
          formData: { character: existingVehicle }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={existingVehicle} />)
      
      const setDriverButton = screen.getByText('Set Driver')
      fireEvent.click(setDriverButton)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: expect.objectContaining({
          driver: expect.objectContaining({
            name: 'Test Driver'
          })
        })
      })
    })

    test('handles archetype selection', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const archetypeSelect = screen.getByTestId('archetype-select')
      fireEvent.change(archetypeSelect, { target: { value: 'Sports Car' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: expect.objectContaining({
          archetype: 'Sports Car',
          action_values: expect.objectContaining({
            Type: 'Vehicle',
            Acceleration: 8,
            Handling: 7
          })
        })
      })
    })

    test('handles position selector changes', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const positionInput = screen.getByTestId('position-input')
      fireEvent.change(positionInput, { target: { value: 'Leading' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: expect.objectContaining({
          action_values: expect.objectContaining({
            Position: 'Leading'
          })
        })
      })
    })

    test('handles pursuer selector changes', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const pursuerInput = screen.getByTestId('pursuer-input')
      fireEvent.change(pursuerInput, { target: { value: 'Cops' } })
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: expect.objectContaining({
          action_values: expect.objectContaining({
            Pursuer: 'Cops'
          })
        })
      })
    })
  })

  describe('form submission', () => {
    test('handles create vehicle submission', async () => {
      const newVehicle = createMockVehicle({ id: null, name: 'New Vehicle' })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: false,
          disabled: false,
          formData: { character: newVehicle }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={newVehicle} />)
      
      const form = screen.getByTestId('vehicle-form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockDispatchForm).toHaveBeenCalledWith({ type: 'SUBMIT' })
        expect(mockClient.createVehicle).toHaveBeenCalledWith(newVehicle, mockUseFight.fight)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('New Vehicle created.')
      })
    })

    test('handles update vehicle submission', async () => {
      const existingVehicle = createMockVehicle({ id: 'vehicle-1', name: 'Existing Vehicle' })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: false,
          disabled: false,
          formData: { character: existingVehicle }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={existingVehicle} />)
      
      const form = screen.getByTestId('vehicle-form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockClient.updateVehicle).toHaveBeenCalledWith(existingVehicle, mockUseFight.fight)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Existing Vehicle updated.')
      })
    })

    test('triggers fight edit after successful submission with fight', async () => {
      const vehicle = createMockVehicle({ name: 'Test Vehicle' })
      mockUseFight.fight.id = 'fight-1'
      
      renderWithTheme(<VehicleModal character={vehicle} />)
      
      const form = screen.getByTestId('vehicle-form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockDispatchFight).toHaveBeenCalledWith({ type: 'EDIT' })
      })
    })

    test('calls reload function after successful submission without fight', async () => {
      const mockReload = jest.fn().mockResolvedValue({})
      mockUseFight.fight.id = null
      
      renderWithTheme(<VehicleModal character={null} reload={mockReload} />)
      
      const form = screen.getByTestId('vehicle-form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockReload).toHaveBeenCalled()
      })
    })

    test('handles submission errors', async () => {
      mockClient.createVehicle.mockRejectedValue(new Error('API Error'))
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      renderWithTheme(<VehicleModal character={null} />)
      
      const form = screen.getByTestId('vehicle-form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
        expect(mockToast.toastError).toHaveBeenCalled()
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('form cancellation', () => {
    test('handles cancel button click', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'RESET',
        payload: mockInitialFormState
      })
    })

    test('handles dialog close', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const closeButton = screen.getByTestId('close-dialog')
      fireEvent.click(closeButton)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'RESET',
        payload: mockInitialFormState
      })
    })
  })

  describe('component lifecycle', () => {
    test('opens modal and updates form when vehicle is provided', () => {
      const vehicle = createMockVehicle({ id: 'vehicle-1', name: 'Test Vehicle' })
      
      renderWithTheme(<VehicleModal character={vehicle} />)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: vehicle
      })
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'OPEN',
        payload: true
      })
    })

    test('opens modal for new vehicles', () => {
      const newVehicle = createMockVehicle({ new: true })
      
      renderWithTheme(<VehicleModal character={newVehicle} />)
      
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'character',
        value: newVehicle
      })
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: 'OPEN',
        payload: true
      })
    })

    test('does not open modal when no vehicle provided', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      // Should not call OPEN action
      expect(mockDispatchForm).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: 'OPEN' })
      )
    })
  })

  describe('service integration', () => {
    test('calls VehicleService.isType for wound label determination', () => {
      const mockIsType = require('@/services/VehicleService').isType
      
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(mockIsType).toHaveBeenCalled()
    })

    test('calls VehicleService.updateActionValue for action value changes', () => {
      const mockUpdateActionValue = require('@/services/VehicleService').updateActionValue
      
      renderWithTheme(<VehicleModal character={null} />)
      
      const accelerationInput = screen.getByTestId('styled-input-acceleration')
      fireEvent.change(accelerationInput, { target: { name: 'Acceleration', value: '10' } })
      
      expect(mockUpdateActionValue).toHaveBeenCalled()
    })

    test('calls VehicleService.updateDriver for driver changes', () => {
      const mockUpdateDriver = require('@/services/VehicleService').updateDriver
      const existingVehicle = createMockVehicle({ id: 'vehicle-1' })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: false,
          disabled: false,
          formData: { character: existingVehicle }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={existingVehicle} />)
      
      const setDriverButton = screen.getByText('Set Driver')
      fireEvent.click(setDriverButton)
      
      expect(mockUpdateDriver).toHaveBeenCalled()
    })

    test('calls VehicleService.updateFromArchetype for archetype changes', () => {
      const mockUpdateFromArchetype = require('@/services/VehicleService').updateFromArchetype
      
      renderWithTheme(<VehicleModal character={null} />)
      
      const archetypeSelect = screen.getByTestId('archetype-select')
      fireEvent.change(archetypeSelect, { target: { value: 'Sports Car' } })
      
      expect(mockUpdateFromArchetype).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    test('has accessible form structure', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByTestId('vehicle-form')).toBeInTheDocument()
    })

    test('has accessible input labels', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Task')).toBeInTheDocument()
      expect(screen.getByLabelText('Acceleration')).toBeInTheDocument()
      expect(screen.getByLabelText('Handling')).toBeInTheDocument()
      expect(screen.getByLabelText('Impairments')).toBeInTheDocument()
    })

    test('has required field indicators', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      const nameInput = screen.getByTestId('styled-input-name')
      expect(nameInput).toHaveAttribute('required')
    })

    test('has proper button labels', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByTestId('save-button')).toBeInTheDocument()
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    test('handles vehicle without action values', () => {
      const vehicleWithoutAV = createMockVehicle({ action_values: {} })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: false,
          disabled: false,
          formData: { character: vehicleWithoutAV }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={vehicleWithoutAV} />)
      
      expect(screen.getByTestId('styled-input-acceleration')).toHaveValue('')
      expect(screen.getByTestId('styled-input-handling')).toHaveValue('')
    })

    test('handles null vehicle prop', () => {
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByTestId('styled-dialog')).toBeInTheDocument()
    })

    test('handles vehicle without count for mook display', () => {
      const mookVehicle = createMockVehicle({ 
        action_values: { Type: 'Mook' },
        count: null
      })
      
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: false,
          disabled: false,
          formData: { character: mookVehicle }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={mookVehicle} />)
      
      expect(screen.getByTestId('styled-dialog')).toBeInTheDocument()
    })

    test('handles empty fight context', () => {
      mockUseFight.fight = null
      
      renderWithTheme(<VehicleModal character={null} />)
      
      expect(screen.getByTestId('styled-dialog')).toBeInTheDocument()
    })
  })

  describe('disabled states', () => {
    test('disables save button when form is saving', () => {
      const mockUseForm = require('@/reducers/formState').useForm
      mockUseForm.mockReturnValue({
        formState: {
          open: true,
          saving: true,
          disabled: false,
          formData: { character: createMockVehicle() }
        },
        dispatchForm: mockDispatchForm,
        initialFormState: mockInitialFormState
      })
      
      renderWithTheme(<VehicleModal character={null} />)
      
      const saveButton = screen.getByTestId('save-button')
      expect(saveButton).toBeDisabled()
    })
  })
})