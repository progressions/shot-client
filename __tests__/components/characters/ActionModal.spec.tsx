import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import ActionModal from '../../../components/characters/ActionModal'
import * as ContextHooks from '../../../contexts'
import { createMockCharacter, createMockVehicle, createMockFight } from '../../factories/MockFactories'
import { CharacterTypes } from '../../../types/types'
import { FightActions } from '../../../reducers/fightState'
import Client from '../../../utils/Client'

// Mock the services
jest.mock('../../../services/CharacterService', () => ({
  isType: jest.fn(),
  isVehicle: jest.fn()
}))

jest.mock('../../../services/FightEventService', () => ({
  spendShots: jest.fn()
}))

// Import mocked services
import CS from '../../../services/CharacterService'
import FES from '../../../services/FightEventService'

const MockedCS = CS as jest.Mocked<typeof CS>
const MockedFES = FES as jest.Mocked<typeof FES>

const theme = createTheme()

describe.skip('ActionModal Component', () => {
  let mockClient: jest.Mocked<Client>
  let mockToast: any
  let mockFightDispatch: jest.Mock
  let mockFight: any

  const renderWithProviders = (character: any) => {
    return render(
      <ThemeProvider theme={theme}>
        <ActionModal character={character} />
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    mockClient = {
      actCharacter: jest.fn(),
      actVehicle: jest.fn()
    } as any

    mockToast = {
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
      toastInfo: jest.fn(),
      toastWarning: jest.fn(),
      closeToast: jest.fn()
    }

    mockFightDispatch = jest.fn()
    mockFight = createMockFight({ id: '123' })

    jest.clearAllMocks()

    // Mock the context hooks after clearing mocks
    jest.spyOn(ContextHooks, 'useFight').mockReturnValue({
      fight: mockFight,
      dispatch: mockFightDispatch
    } as any)

    jest.spyOn(ContextHooks, 'useClient').mockReturnValue({
      client: mockClient,
      user: null,
      setUser: jest.fn()
    } as any)

    jest.spyOn(ContextHooks, 'useToast').mockReturnValue(mockToast)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('modal open/close behavior', () => {
    it('should initially render closed modal with action button', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      // Should show the action button
      const actionButton = screen.getByRole('button')
      expect(actionButton).toBeInTheDocument()
      expect(actionButton).toHaveAttribute('title', 'Take Action')

      // Modal should not be visible initially
      expect(screen.queryByText('Spend Shots')).not.toBeInTheDocument()
    })

    it('should open modal when action button is clicked', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      // Modal should now be visible
      expect(screen.getByText('Spend Shots')).toBeInTheDocument()
      expect(screen.getByLabelText('Shots')).toBeInTheDocument()
    })

    it('should close modal when cancel is clicked', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      // Open modal
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      // Close modal
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      // Modal should be closed
      expect(screen.queryByText('Spend Shots')).not.toBeInTheDocument()
    })

    it('should display bolt icon on action button', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      const boltIcon = screen.getByTestId('BoltIcon')
      expect(boltIcon).toBeInTheDocument()
    })
  })

  describe('action form rendering', () => {
    it('should render shots input field with default value', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      MockedCS.isType.mockReturnValue(false) // Not boss/uber boss
      
      renderWithProviders(character)

      // Open modal
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      expect(shotsInput).toBeInTheDocument()
      expect(shotsInput).toHaveValue(3) // Default value
      expect(shotsInput).toHaveAttribute('type', 'number')
      expect(shotsInput).toBeRequired()
    })

    it('should set shots to 2 for boss characters', () => {
      const bossCharacter = createMockCharacter({ 
        id: '1', 
        name: 'Boss Character',
        action_values: { ...createMockCharacter().action_values, Type: CharacterTypes.Boss }
      })
      MockedCS.isType.mockReturnValue(true) // Is boss
      
      renderWithProviders(bossCharacter)

      // Open modal
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      expect(shotsInput).toHaveValue(2) // Boss default
    })

    it('should set shots to 2 for uber boss characters', () => {
      const uberBossCharacter = createMockCharacter({ 
        id: '1', 
        name: 'Uber Boss Character',
        action_values: { ...createMockCharacter().action_values, Type: CharacterTypes.UberBoss }
      })
      MockedCS.isType.mockReturnValue(true) // Is uber boss
      
      renderWithProviders(uberBossCharacter)

      // Open modal
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      expect(shotsInput).toHaveValue(2) // Uber boss default
    })

    it('should have submit button that is disabled when shots is 0', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      // Open modal
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      // Change shots to 0
      const shotsInput = screen.getByLabelText('Shots')
      fireEvent.change(shotsInput, { target: { value: '0' } })

      // Submit button should be disabled
      const submitButton = screen.getByText('Submit')
      expect(submitButton).toBeDisabled()
    })

    it('should enable submit button when shots is greater than 0', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      // Open modal
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      // Shots should be 3 by default, submit should be enabled
      const submitButton = screen.getByText('Submit')
      expect(submitButton).not.toBeDisabled()
    })
  })

  describe('shots input handling', () => {
    it('should update shots value when input changes', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      // Open modal
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      fireEvent.change(shotsInput, { target: { value: '5' } })

      expect(shotsInput).toHaveValue(5)
    })

    it('should handle non-numeric input gracefully', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      // Open modal
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      fireEvent.change(shotsInput, { target: { value: 'abc' } })

      // Should handle NaN gracefully
      expect(shotsInput).toHaveValue(null)
    })

    it('should handle negative values', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      // Open modal
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      fireEvent.change(shotsInput, { target: { value: '-1' } })

      expect(shotsInput).toHaveValue(-1)
    })
  })

  describe('character action submission', () => {
    it('should call actCharacter for regular characters', async () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      MockedCS.isVehicle.mockReturnValue(false)
      mockClient.actCharacter.mockResolvedValue(character)
      MockedFES.spendShots.mockResolvedValue({ id: 'test-event', event_type: 'Shots_spent' } as any)

      renderWithProviders(character)

      // Open modal and submit
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockClient.actCharacter).toHaveBeenCalledWith(character, mockFight, 3)
        expect(MockedFES.spendShots).toHaveBeenCalledWith(mockClient, mockFight, character, 3)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Test Character spent 3 shots.')
        expect(mockFightDispatch).toHaveBeenCalledWith({ type: FightActions.EDIT })
      })
    })

    it('should call actVehicle for vehicle characters', async () => {
      const vehicle = createMockVehicle({ id: '1', name: 'Test Vehicle' })
      MockedCS.isVehicle.mockReturnValue(true)
      mockClient.actVehicle.mockResolvedValue(vehicle)
      MockedFES.spendShots.mockResolvedValue({ id: 'test-event', event_type: 'Shots_spent' } as any)

      renderWithProviders(vehicle)

      // Open modal and submit
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockClient.actVehicle).toHaveBeenCalledWith(vehicle, mockFight, 3)
        expect(MockedFES.spendShots).toHaveBeenCalledWith(mockClient, mockFight, vehicle, 3)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Test Vehicle spent 3 shots.')
      })
    })

    it('should handle custom shot amounts', async () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      MockedCS.isVehicle.mockReturnValue(false)
      mockClient.actCharacter.mockResolvedValue(character)
      MockedFES.spendShots.mockResolvedValue({ id: 'test-event', event_type: 'Shots_spent' } as any)

      renderWithProviders(character)

      // Open modal and change shots
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      fireEvent.change(shotsInput, { target: { value: '7' } })

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockClient.actCharacter).toHaveBeenCalledWith(character, mockFight, 7)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Test Character spent 7 shots.')
      })
    })

    it('should not submit when shots is 0', async () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      // Open modal and set shots to 0
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      fireEvent.change(shotsInput, { target: { value: '0' } })

      // Submit button should be disabled, but try to click anyway
      const submitButton = screen.getByText('Submit')
      expect(submitButton).toBeDisabled()

      // Should not have called any client methods
      expect(mockClient.actCharacter).not.toHaveBeenCalled()
      expect(mockClient.actVehicle).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should handle actCharacter failures', async () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      MockedCS.isVehicle.mockReturnValue(false)
      
      const error = new Error('Character action failed')
      mockClient.actCharacter.mockRejectedValue(error)

      renderWithProviders(character)

      // Open modal and submit
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToast.toastError).toHaveBeenCalled()
        // Should not call FES.spendShots if client action fails
        expect(MockedFES.spendShots).not.toHaveBeenCalled()
      })
    })

    it('should handle actVehicle failures', async () => {
      const vehicle = createMockVehicle({ id: '1', name: 'Test Vehicle' })
      MockedCS.isVehicle.mockReturnValue(true)
      
      const error = new Error('Vehicle action failed')
      mockClient.actVehicle.mockRejectedValue(error)

      renderWithProviders(vehicle)

      // Open modal and submit
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockToast.toastError).toHaveBeenCalled()
        expect(MockedFES.spendShots).not.toHaveBeenCalled()
      })
    })

    it('should handle FES.spendShots failures', async () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      MockedCS.isVehicle.mockReturnValue(false)
      mockClient.actCharacter.mockResolvedValue(character)
      MockedFES.spendShots.mockRejectedValue(new Error('FES failed'))

      renderWithProviders(character)

      // Open modal and submit
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockClient.actCharacter).toHaveBeenCalledWith(character, mockFight, 3)
        expect(MockedFES.spendShots).toHaveBeenCalledWith(mockClient, mockFight, character, 3)
        expect(mockToast.toastError).toHaveBeenCalled()
      })
    })

    it('should disable form during submission', async () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      MockedCS.isVehicle.mockReturnValue(false)
      
      // Make the client call hang to test disabled state
      mockClient.actCharacter.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      MockedFES.spendShots.mockResolvedValue({ id: 'test-event', event_type: 'Shots_spent' } as any)

      renderWithProviders(character)

      // Open modal and submit
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // Form should be disabled during submission
      await waitFor(() => {
        const shotsInput = screen.getByLabelText('Shots')
        expect(shotsInput).toBeDisabled()
        expect(submitButton).toBeDisabled()
      })
    })
  })

  describe('form reset after actions', () => {
    it('should reset form after successful submission', async () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      MockedCS.isVehicle.mockReturnValue(false)
      mockClient.actCharacter.mockResolvedValue(character)
      MockedFES.spendShots.mockResolvedValue({ id: 'test-event', event_type: 'Shots_spent' } as any)

      renderWithProviders(character)

      // Open modal, change shots, and submit
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      fireEvent.change(shotsInput, { target: { value: '5' } })

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      await waitFor(() => {
        // Modal should be closed after successful submission
        expect(screen.queryByText('Spend Shots')).not.toBeInTheDocument()
      })

      // If we open the modal again, it should be reset to default
      fireEvent.click(actionButton)
      const resetShotsInput = screen.getByLabelText('Shots')
      expect(resetShotsInput).toHaveValue(3) // Back to default
    })

    it('should reset form when cancelled', () => {
      const character = createMockCharacter({ id: '1', name: 'Test Character' })
      renderWithProviders(character)

      // Open modal and change shots
      const actionButton = screen.getByRole('button')
      fireEvent.click(actionButton)

      const shotsInput = screen.getByLabelText('Shots')
      fireEvent.change(shotsInput, { target: { value: '7' } })

      // Cancel
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)

      // Reopen modal - should be reset
      fireEvent.click(actionButton)
      const resetShotsInput = screen.getByLabelText('Shots')
      expect(resetShotsInput).toHaveValue(3) // Back to default
    })
  })
})