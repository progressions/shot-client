import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/components/StyledFields'
import Initiative from '@/components/initiative/Initiative'
import { createMockCharacter } from '../../factories/character'
import { createMockFight } from '../../factories/fight'
import { createMockVehicle } from '../../factories/vehicle'

// Mock contexts
const mockDispatchFight = jest.fn()
const mockUseFight = {
  fight: createMockFight(),
  dispatch: mockDispatchFight,
  state: { initiative: true, attacking: false, saving: false }
}

const mockClient = {
  updateCharacter: jest.fn().mockResolvedValue({}),
  touchFight: jest.fn().mockResolvedValue({})
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
jest.mock('@/services/FightService', () => ({
  playerCharactersForInitiative: jest.fn(() => [
    createMockCharacter({ 
      name: 'Test Character 1', 
      current_shot: 15,
      shot_id: 'shot-1',
      category: 'character',
      action_values: { Speed: 7 }
    }),
    createMockCharacter({ 
      name: 'Test Character 2', 
      current_shot: 12,
      shot_id: 'shot-2',
      category: 'character',
      action_values: { Speed: 8 }
    })
  ])
}))

jest.mock('@/services/CharacterService', () => ({
  isCharacter: jest.fn(() => true),
  setInitiative: jest.fn((char, init) => ({ ...char, initiative: init })),
  speed: jest.fn((char) => char.action_values?.Speed || 7)
}))

jest.mock('@/services/VehicleService', () => ({
  isVehicle: jest.fn(() => false),
  speed: jest.fn((vehicle) => vehicle.action_values?.Acceleration || 8)
}))

// Mock child components
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
          disabled={props.disabled}
          data-testid={`initiative-input-${props.name}`}
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
  }
}))

// Mock reducers
jest.mock('@/reducers/fightState', () => ({
  FightActions: {
    INITIATIVE: 'INITIATIVE',
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

describe('Initiative', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseFight.fight = createMockFight()
    mockUseFight.state.initiative = true
  })

  describe('conditional rendering', () => {
    test('renders nothing when initiative is false', () => {
      mockUseFight.state.initiative = false
      
      const { container } = renderWithTheme(<Initiative />)
      
      expect(container.firstChild).toBeNull()
    })

    test('renders initiative form when initiative is true', () => {
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText(/Ask each player to roll Initiative/)).toBeInTheDocument()
    })

    test('shows no characters message when no combatants available', () => {
      const mockPlayerChars = require('@/services/FightService').playerCharactersForInitiative
      mockPlayerChars.mockReturnValue([])
      
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText('No characters available for Initiative.')).toBeInTheDocument()
    })

    test('renders initiative inputs when combatants are available', () => {
      renderWithTheme(<Initiative />)
      
      expect(screen.getAllByLabelText('Initiative')).toHaveLength(2)
      expect(screen.getByText('Test Character 1')).toBeInTheDocument()
      expect(screen.getByText('Test Character 2')).toBeInTheDocument()
    })
  })

  describe('combatant display', () => {
    test('displays character names', () => {
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText('Test Character 1')).toBeInTheDocument()
      expect(screen.getByText('Test Character 2')).toBeInTheDocument()
    })

    test('displays current shot values', () => {
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText('15')).toBeInTheDocument()
      expect(screen.getByText('12')).toBeInTheDocument()
    })

    test('displays speed values for characters not driving', () => {
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText('Speed 7')).toBeInTheDocument()
      expect(screen.getByText('Speed 8')).toBeInTheDocument()
    })

    test('displays acceleration values for characters driving vehicles', () => {
      const drivingCharacter = createMockCharacter({ 
        name: 'Driving Character',
        current_shot: 10,
        shot_id: 'shot-3',
        category: 'character',
        driving: { id: 'vehicle-1', name: 'Test Vehicle' }
      })
      
      const mockPlayerChars = require('@/services/FightService').playerCharactersForInitiative
      mockPlayerChars.mockReturnValue([drivingCharacter])
      
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText('Acc 8')).toBeInTheDocument()
    })

    test('filters out vehicles from display', () => {
      const mockVehicle = createMockVehicle({ 
        name: 'Test Vehicle',
        shot_id: 'shot-vehicle',
        category: 'vehicle'
      })
      
      const mockIsVehicle = require('@/services/VehicleService').isVehicle
      mockIsVehicle.mockImplementation((combatant) => combatant.category === 'vehicle')
      
      const mockPlayerChars = require('@/services/FightService').playerCharactersForInitiative
      mockPlayerChars.mockReturnValue([
        createMockCharacter({ name: 'Character', shot_id: 'shot-1', category: 'character' }),
        mockVehicle
      ])
      
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText('Character')).toBeInTheDocument()
      expect(screen.queryByText('Test Vehicle')).not.toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    test('handles initiative input changes', () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInputs = screen.getAllByLabelText('Initiative')
      const firstInput = initiativeInputs[0]
      
      fireEvent.change(firstInput, { target: { value: '18' } })
      
      expect(firstInput).toHaveValue('18')
    })

    test('updates multiple initiative values independently', () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInputs = screen.getAllByLabelText('Initiative')
      const firstInput = initiativeInputs[0]
      const secondInput = initiativeInputs[1]
      
      fireEvent.change(firstInput, { target: { value: '18' } })
      fireEvent.change(secondInput, { target: { value: '22' } })
      
      expect(firstInput).toHaveValue('18')
      expect(secondInput).toHaveValue('22')
    })

    test('enables save button when values are entered', () => {
      renderWithTheme(<Initiative />)
      
      const saveButton = screen.getByTestId('save-button')
      expect(saveButton).toBeDisabled()
      
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      fireEvent.change(initiativeInput, { target: { value: '15' } })
      
      expect(saveButton).not.toBeDisabled()
    })

    test('keeps save button disabled when no values entered', () => {
      renderWithTheme(<Initiative />)
      
      const saveButton = screen.getByTestId('save-button')
      expect(saveButton).toBeDisabled()
    })

    test('disables inputs when saving', () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      fireEvent.change(initiativeInput, { target: { value: '15' } })
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      // During save, inputs should be disabled
      expect(screen.getAllByLabelText('Initiative')[0]).toBeDisabled()
    })
  })

  describe('form submission', () => {
    test('handles form submission successfully', async () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      fireEvent.change(initiativeInput, { target: { value: '18' } })
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockClient.updateCharacter).toHaveBeenCalled()
        expect(mockClient.touchFight).toHaveBeenCalledWith(mockUseFight.fight)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Initiative updated.')
        expect(mockDispatchFight).toHaveBeenCalledWith({ type: 'EDIT' })
      })
    })

    test('calls CharacterService.setInitiative for each character', async () => {
      const mockSetInitiative = require('@/services/CharacterService').setInitiative
      
      renderWithTheme(<Initiative />)
      
      const initiativeInputs = screen.getAllByLabelText('Initiative')
      fireEvent.change(initiativeInputs[0], { target: { value: '18' } })
      fireEvent.change(initiativeInputs[1], { target: { value: '22' } })
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockSetInitiative).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Test Character 1' }),
          18
        )
        expect(mockSetInitiative).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Test Character 2' }),
          22
        )
      })
    })

    test('updates multiple characters concurrently', async () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInputs = screen.getAllByLabelText('Initiative')
      fireEvent.change(initiativeInputs[0], { target: { value: '15' } })
      fireEvent.change(initiativeInputs[1], { target: { value: '20' } })
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockClient.updateCharacter).toHaveBeenCalledTimes(2)
      })
    })

    test('closes initiative modal after successful submission', async () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      fireEvent.change(initiativeInput, { target: { value: '18' } })
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockDispatchFight).toHaveBeenCalledWith({ 
          type: 'INITIATIVE', 
          payload: false 
        })
      })
    })

    test('prevents form submission when no values entered', () => {
      renderWithTheme(<Initiative />)
      
      const saveButton = screen.getByTestId('save-button')
      expect(saveButton).toBeDisabled()
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      expect(mockClient.updateCharacter).not.toHaveBeenCalled()
    })
  })

  describe('cancel functionality', () => {
    test('handles cancel button click', () => {
      renderWithTheme(<Initiative />)
      
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      expect(mockDispatchFight).toHaveBeenCalledWith({ 
        type: 'INITIATIVE', 
        payload: false 
      })
    })

    test('resets form values when cancelled', () => {
      renderWithTheme(<Initiative />)
      
      // Enter some values
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      fireEvent.change(initiativeInput, { target: { value: '18' } })
      
      // Cancel
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      // Values should be reset
      expect(initiativeInput).toHaveValue('')
    })

    test('resets saving state when cancelled', () => {
      renderWithTheme(<Initiative />)
      
      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)
      
      // Should not be in saving state
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      expect(initiativeInput).not.toBeDisabled()
    })
  })

  describe('service integration', () => {
    test('calls FightService.playerCharactersForInitiative', () => {
      const mockPlayerChars = require('@/services/FightService').playerCharactersForInitiative
      
      renderWithTheme(<Initiative />)
      
      expect(mockPlayerChars).toHaveBeenCalledWith(mockUseFight.fight)
    })

    test('calls CharacterService.isCharacter for each combatant', async () => {
      const mockIsCharacter = require('@/services/CharacterService').isCharacter
      
      renderWithTheme(<Initiative />)
      
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      fireEvent.change(initiativeInput, { target: { value: '18' } })
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockIsCharacter).toHaveBeenCalled()
      })
    })

    test('calls CharacterService.speed for character speed display', () => {
      const mockSpeed = require('@/services/CharacterService').speed
      
      renderWithTheme(<Initiative />)
      
      expect(mockSpeed).toHaveBeenCalled()
    })

    test('calls VehicleService.speed for driving characters', () => {
      const drivingCharacter = createMockCharacter({ 
        name: 'Driving Character',
        driving: { id: 'vehicle-1', name: 'Test Vehicle' }
      })
      
      const mockPlayerChars = require('@/services/FightService').playerCharactersForInitiative
      mockPlayerChars.mockReturnValue([drivingCharacter])
      
      const mockVehicleSpeed = require('@/services/VehicleService').speed
      
      renderWithTheme(<Initiative />)
      
      expect(mockVehicleSpeed).toHaveBeenCalledWith(drivingCharacter.driving)
    })
  })

  describe('key generation and state management', () => {
    test('generates unique keys for each combatant', () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInputs = screen.getAllByLabelText('Initiative')
      
      fireEvent.change(initiativeInputs[0], { target: { value: '15' } })
      fireEvent.change(initiativeInputs[1], { target: { value: '20' } })
      
      expect(initiativeInputs[0]).toHaveValue('15')
      expect(initiativeInputs[1]).toHaveValue('20')
    })

    test('maintains separate state for each character', () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInputs = screen.getAllByLabelText('Initiative')
      
      // Set first character initiative
      fireEvent.change(initiativeInputs[0], { target: { value: '18' } })
      
      // Clear and set again
      fireEvent.change(initiativeInputs[0], { target: { value: '' } })
      fireEvent.change(initiativeInputs[0], { target: { value: '22' } })
      
      expect(initiativeInputs[0]).toHaveValue('22')
      expect(initiativeInputs[1]).toHaveValue('')
    })

    test('tracks savable state based on any non-empty values', () => {
      renderWithTheme(<Initiative />)
      
      const saveButton = screen.getByTestId('save-button')
      const initiativeInputs = screen.getAllByLabelText('Initiative')
      
      // Initially disabled
      expect(saveButton).toBeDisabled()
      
      // Enter value in first input
      fireEvent.change(initiativeInputs[0], { target: { value: '15' } })
      expect(saveButton).not.toBeDisabled()
      
      // Clear value
      fireEvent.change(initiativeInputs[0], { target: { value: '' } })
      expect(saveButton).toBeDisabled()
      
      // Enter value in second input
      fireEvent.change(initiativeInputs[1], { target: { value: '20' } })
      expect(saveButton).not.toBeDisabled()
    })
  })

  describe('error handling', () => {
    test('handles API errors during character update', async () => {
      mockClient.updateCharacter.mockRejectedValue(new Error('API Error'))
      
      renderWithTheme(<Initiative />)
      
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      fireEvent.change(initiativeInput, { target: { value: '18' } })
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        // Should attempt the update despite error
        expect(mockClient.updateCharacter).toHaveBeenCalled()
      })
    })

    test('handles API errors during fight touch', async () => {
      mockClient.touchFight.mockRejectedValue(new Error('API Error'))
      
      renderWithTheme(<Initiative />)
      
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      fireEvent.change(initiativeInput, { target: { value: '18' } })
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
      })
    })
  })

  describe('edge cases', () => {
    test('handles characters without shot_id', () => {
      const characterWithoutShotId = createMockCharacter({ 
        name: 'No Shot ID',
        shot_id: undefined,
        category: 'character'
      })
      
      const mockPlayerChars = require('@/services/FightService').playerCharactersForInitiative
      mockPlayerChars.mockReturnValue([characterWithoutShotId])
      
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText('No Shot ID')).toBeInTheDocument()
    })

    test('handles characters without category', () => {
      const characterWithoutCategory = createMockCharacter({ 
        name: 'No Category',
        shot_id: 'shot-1',
        category: undefined
      })
      
      const mockPlayerChars = require('@/services/FightService').playerCharactersForInitiative
      mockPlayerChars.mockReturnValue([characterWithoutCategory])
      
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText('No Category')).toBeInTheDocument()
    })

    test('handles empty initiative values in form submission', async () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      
      // Enter and clear value
      fireEvent.change(initiativeInput, { target: { value: '18' } })
      fireEvent.change(initiativeInput, { target: { value: '' } })
      
      // Should not be savable
      const saveButton = screen.getByTestId('save-button')
      expect(saveButton).toBeDisabled()
    })

    test('handles non-numeric initiative values', () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInput = screen.getAllByLabelText('Initiative')[0]
      fireEvent.change(initiativeInput, { target: { value: 'abc' } })
      
      expect(initiativeInput).toHaveValue('abc')
    })

    test('handles missing driving vehicle data', () => {
      const characterWithNullDriving = createMockCharacter({ 
        name: 'Null Driving',
        driving: null
      })
      
      const mockPlayerChars = require('@/services/FightService').playerCharactersForInitiative
      mockPlayerChars.mockReturnValue([characterWithNullDriving])
      
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText('Speed 7')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    test('has proper form structure', () => {
      renderWithTheme(<Initiative />)
      
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    test('has accessible input labels', () => {
      renderWithTheme(<Initiative />)
      
      const initiativeInputs = screen.getAllByLabelText('Initiative')
      expect(initiativeInputs).toHaveLength(2)
    })

    test('has accessible button labels', () => {
      renderWithTheme(<Initiative />)
      
      expect(screen.getByTestId('save-button')).toBeInTheDocument()
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument()
    })

    test('provides clear instructions to users', () => {
      renderWithTheme(<Initiative />)
      
      expect(screen.getByText(/Ask each player to roll Initiative/)).toBeInTheDocument()
    })
  })
})