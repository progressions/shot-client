import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import RollInitiative from '../../../components/fights/RollInitiative'
import { FightContext } from '../../../contexts/FightContext'
import { ClientContext } from '../../../contexts/ClientContext'
import { ToastContext } from '../../../contexts/ToastContext'
import { createMockFight, createMockCharacter, createMockVehicle } from '../../factories/MockFactories'
import Client from '../../../utils/Client'
import { FightActions } from '../../../reducers/fightState'

// Mock the services
jest.mock('../../../services/CharacterService', () => ({
  isType: jest.fn(),
  actionValue: jest.fn(),
  isCharacter: jest.fn(),
  rollInitiative: jest.fn()
}))

jest.mock('../../../services/FightEventService', () => ({
  startSequence: jest.fn()
}))

// Import mocked services
import CS from '../../../services/CharacterService'
import FES from '../../../services/FightEventService'

const theme = createTheme()

const MockedCS = CS as jest.Mocked<typeof CS>
const MockedFES = FES as jest.Mocked<typeof FES>

describe('RollInitiative Extended Tests', () => {
  let mockClient: jest.Mocked<Client>
  let mockToast: any
  let mockFightDispatch: jest.Mock
  let mockFight: any

  const renderWithProviders = (fightData = mockFight) => {
    const fightContextValue = {
      fight: fightData,
      dispatch: mockFightDispatch
    }

    const clientContextValue = {
      client: mockClient,
      user: null,
      setUser: jest.fn()
    }

    return render(
      <ThemeProvider theme={theme}>
        <ToastContext.Provider value={mockToast}>
          <ClientContext.Provider value={clientContextValue}>
            <FightContext.Provider value={fightContextValue}>
              <RollInitiative />
            </FightContext.Provider>
          </ClientContext.Provider>
        </ToastContext.Provider>
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    mockClient = {
      updateFight: jest.fn(),
      touchFight: jest.fn(),
      updateCharacter: jest.fn(),
      updateVehicle: jest.fn()
    } as any

    mockToast = {
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
      toastInfo: jest.fn(),
      toastWarning: jest.fn(),
      closeToast: jest.fn()
    }

    mockFightDispatch = jest.fn()

    mockFight = createMockFight({
      id: '123',
      sequence: 1,
      shot_order: [[0, [createMockCharacter({ id: '1' }), createMockCharacter({ id: '2' })]]]
    })

    jest.clearAllMocks()
  })

  describe('component renders with fight data', () => {
    it('should render the initiative button with correct label', () => {
      renderWithProviders()
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('Initiative')
      expect(button).not.toBeDisabled()
    })

    it('should render "Start" button when at start of sequence', () => {
      const startOfSequenceFight = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [[0, [createMockCharacter({ id: '1' })]]]
      })

      renderWithProviders(startOfSequenceFight)
      
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Start')
    })

    it('should render play arrow icon', () => {
      renderWithProviders()
      
      const playIcon = screen.getByTestId('PlayArrowIcon')
      expect(playIcon).toBeInTheDocument()
    })

    it('should be disabled during processing', async () => {
      MockedCS.isType.mockReturnValue(false)
      MockedCS.actionValue.mockReturnValue(10)
      MockedCS.isCharacter.mockReturnValue(true)
      MockedCS.rollInitiative.mockReturnValue(createMockCharacter({ id: '1' }))
      
      mockClient.updateFight.mockResolvedValue(mockFight)
      mockClient.updateCharacter.mockResolvedValue(createMockCharacter({ id: '1' }))
      mockClient.touchFight.mockResolvedValue(mockFight)

      renderWithProviders()
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Button should be disabled during processing
      await waitFor(() => {
        expect(button).toBeDisabled()
      })

      // Wait for processing to complete
      await waitFor(() => {
        expect(button).not.toBeDisabled()
      })
    })
  })

  describe('initiative roll button click', () => {
    it('should handle successful initiative roll for characters', async () => {
      const character1 = createMockCharacter({ id: '1', character_type: 'npc' })
      const character2 = createMockCharacter({ id: '2', character_type: 'npc' })
      
      const fightWithNPCs = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [[0, [character1, character2]]]
      })

      MockedCS.isType.mockReturnValue(false) // Not PC
      MockedCS.actionValue.mockReturnValue(10) // Has speed
      MockedCS.isCharacter.mockReturnValue(true)
      MockedCS.rollInitiative.mockImplementation((char) => ({ ...char, current_shot: 5 }))

      mockClient.updateCharacter.mockResolvedValue(character1)
      mockClient.touchFight.mockResolvedValue(fightWithNPCs)

      renderWithProviders(fightWithNPCs)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(MockedCS.rollInitiative).toHaveBeenCalledWith(character1)
        expect(MockedCS.rollInitiative).toHaveBeenCalledWith(character2)
        expect(mockClient.updateCharacter).toHaveBeenCalledWith(expect.objectContaining({ current_shot: 5 }), fightWithNPCs)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Initiative updated')
      })
    })

    it('should handle successful initiative roll for vehicles', async () => {
      const vehicle1 = createMockVehicle({ id: '1' })
      const vehicle2 = createMockVehicle({ id: '2' })
      
      const fightWithVehicles = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [[0, [vehicle1, vehicle2]]]
      })

      MockedCS.isType.mockReturnValue(false) // Not PC
      MockedCS.actionValue.mockReturnValue(8) // Has acceleration
      MockedCS.isCharacter.mockReturnValue(false) // Is vehicle

      mockClient.updateVehicle.mockResolvedValue(vehicle1)
      mockClient.touchFight.mockResolvedValue(fightWithVehicles)

      renderWithProviders(fightWithVehicles)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.updateVehicle).toHaveBeenCalledWith(expect.objectContaining({ current_shot: 0 }), fightWithVehicles)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Initiative updated')
      })
    })

    it('should handle sequence start correctly', async () => {
      const startOfSequenceFight = createMockFight({
        id: '123',
        sequence: 0,
        shot_order: [[0, [createMockCharacter({ id: '1', character_type: 'npc' })]]]
      })

      MockedCS.isType.mockReturnValue(false)
      MockedCS.actionValue.mockReturnValue(10)
      MockedCS.isCharacter.mockReturnValue(true)
      MockedCS.rollInitiative.mockReturnValue(createMockCharacter({ id: '1' }))

      mockClient.updateFight.mockResolvedValue(startOfSequenceFight)
      mockClient.updateCharacter.mockResolvedValue(createMockCharacter({ id: '1' }))
      mockClient.touchFight.mockResolvedValue(startOfSequenceFight)
      MockedFES.startSequence.mockResolvedValue(undefined)

      renderWithProviders(startOfSequenceFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.updateFight).toHaveBeenCalledWith({ id: '123', sequence: 1 })
        expect(MockedFES.startSequence).toHaveBeenCalledWith(mockClient, startOfSequenceFight, 1)
        expect(mockFightDispatch).toHaveBeenCalledWith({ type: FightActions.EDIT })
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Sequence increased.')
      })
    })

    it('should filter out PCs from initiative rolls', async () => {
      const pc = createMockCharacter({ id: '1', character_type: 'pc' })
      const npc = createMockCharacter({ id: '2', character_type: 'npc' })
      
      const mixedFight = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [[0, [pc, npc]]]
      })

      MockedCS.isType.mockImplementation((char, type) => char.character_type === 'pc')
      MockedCS.actionValue.mockReturnValue(10)
      MockedCS.isCharacter.mockReturnValue(true)
      MockedCS.rollInitiative.mockReturnValue(npc)

      mockClient.updateCharacter.mockResolvedValue(npc)
      mockClient.touchFight.mockResolvedValue(mixedFight)

      renderWithProviders(mixedFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        // Should only roll for NPC, not PC
        expect(MockedCS.rollInitiative).toHaveBeenCalledTimes(1)
        expect(MockedCS.rollInitiative).toHaveBeenCalledWith(npc)
        expect(mockClient.updateCharacter).toHaveBeenCalledTimes(1)
      })
    })

    it('should filter out characters without speed values', async () => {
      const withSpeed = createMockCharacter({ id: '1', character_type: 'npc' })
      const withoutSpeed = createMockCharacter({ id: '2', character_type: 'npc' })
      
      const speedFight = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [[0, [withSpeed, withoutSpeed]]]
      })

      MockedCS.isType.mockReturnValue(false) // Not PC
      MockedCS.actionValue.mockImplementation((char, action) => {
        if (char.id === '1') return 10 // Has speed
        return 0 // No speed
      })
      MockedCS.isCharacter.mockReturnValue(true)
      MockedCS.rollInitiative.mockReturnValue(withSpeed)

      mockClient.updateCharacter.mockResolvedValue(withSpeed)
      mockClient.touchFight.mockResolvedValue(speedFight)

      renderWithProviders(speedFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        // Should only roll for character with speed
        expect(MockedCS.rollInitiative).toHaveBeenCalledTimes(1)
        expect(MockedCS.rollInitiative).toHaveBeenCalledWith(withSpeed)
      })
    })
  })

  describe('error handling for failed rolls', () => {
    it('should handle character update failures gracefully', async () => {
      const character = createMockCharacter({ id: '1', character_type: 'npc' })
      
      const errorFight = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [[0, [character]]]
      })

      MockedCS.isType.mockReturnValue(false)
      MockedCS.actionValue.mockReturnValue(10)
      MockedCS.isCharacter.mockReturnValue(true)
      MockedCS.rollInitiative.mockReturnValue(character)

      mockClient.updateCharacter.mockRejectedValue(new Error('Update failed'))
      mockClient.touchFight.mockResolvedValue(errorFight)

      renderWithProviders(errorFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        // Should still call touchFight and show success message even if individual updates fail
        expect(mockClient.touchFight).toHaveBeenCalled()
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Initiative updated')
      })
    })

    it('should handle vehicle update failures gracefully', async () => {
      const vehicle = createMockVehicle({ id: '1' })
      
      const vehicleErrorFight = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [[0, [vehicle]]]
      })

      MockedCS.isType.mockReturnValue(false)
      MockedCS.actionValue.mockReturnValue(8)
      MockedCS.isCharacter.mockReturnValue(false)

      mockClient.updateVehicle.mockRejectedValue(new Error('Vehicle update failed'))
      mockClient.touchFight.mockResolvedValue(vehicleErrorFight)

      renderWithProviders(vehicleErrorFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Initiative updated')
      })
    })

    it('should handle sequence increase failures', async () => {
      const startFight = createMockFight({
        id: '123',
        sequence: 0,
        shot_order: [[0, [createMockCharacter({ id: '1', character_type: 'npc' })]]]
      })

      MockedCS.isType.mockReturnValue(false)
      MockedCS.actionValue.mockReturnValue(10)
      MockedCS.isCharacter.mockReturnValue(true)
      MockedCS.rollInitiative.mockReturnValue(createMockCharacter({ id: '1' }))

      const sequenceError = new Error('Sequence update failed')
      mockClient.updateFight.mockRejectedValue(sequenceError)
      mockClient.updateCharacter.mockResolvedValue(createMockCharacter({ id: '1' }))
      mockClient.touchFight.mockResolvedValue(startFight)

      renderWithProviders(startFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockFightDispatch).toHaveBeenCalledWith({ 
          type: FightActions.ERROR, 
          payload: sequenceError 
        })
        expect(mockToast.toastError).toHaveBeenCalled()
      })
    })

    it('should handle FightEventService failures', async () => {
      const startFight = createMockFight({
        id: '123',
        sequence: 0,
        shot_order: [[0, [createMockCharacter({ id: '1', character_type: 'npc' })]]]
      })

      MockedCS.isType.mockReturnValue(false)
      MockedCS.actionValue.mockReturnValue(10)
      MockedCS.isCharacter.mockReturnValue(true)
      MockedCS.rollInitiative.mockReturnValue(createMockCharacter({ id: '1' }))

      mockClient.updateFight.mockResolvedValue(startFight)
      mockClient.updateCharacter.mockResolvedValue(createMockCharacter({ id: '1' }))
      mockClient.touchFight.mockResolvedValue(startFight)
      MockedFES.startSequence.mockRejectedValue(new Error('FES failed'))

      renderWithProviders(startFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Should continue processing despite FES failure
      await waitFor(() => {
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Initiative updated')
      })
    })
  })

  describe('multiple character handling', () => {
    it('should handle mixed character and vehicle types', async () => {
      const character = createMockCharacter({ id: '1', character_type: 'npc' })
      const vehicle = createMockVehicle({ id: '2' })
      
      const mixedFight = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [[0, [character, vehicle]]]
      })

      MockedCS.isType.mockReturnValue(false)
      MockedCS.actionValue.mockReturnValue(10)
      MockedCS.isCharacter.mockImplementation((entity) => entity.id === '1')
      MockedCS.rollInitiative.mockReturnValue(character)

      mockClient.updateCharacter.mockResolvedValue(character)
      mockClient.updateVehicle.mockResolvedValue(vehicle)
      mockClient.touchFight.mockResolvedValue(mixedFight)

      renderWithProviders(mixedFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.updateCharacter).toHaveBeenCalledWith(character, mixedFight)
        expect(mockClient.updateVehicle).toHaveBeenCalledWith(expect.objectContaining({ current_shot: 0 }), mixedFight)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Initiative updated')
      })
    })

    it('should process multiple shots with different entities', async () => {
      const character1 = createMockCharacter({ id: '1', character_type: 'npc' })
      const character2 = createMockCharacter({ id: '2', character_type: 'npc' })
      const vehicle1 = createMockVehicle({ id: '3' })
      
      const multiShotFight = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [
          [0, [character1]], 
          [-1, [character2, vehicle1]]
        ]
      })

      MockedCS.isType.mockReturnValue(false)
      MockedCS.actionValue.mockReturnValue(10)
      MockedCS.isCharacter.mockImplementation((entity) => entity.id === '1' || entity.id === '2')
      MockedCS.rollInitiative.mockImplementation((char) => ({ ...char, current_shot: 5 }))

      mockClient.updateCharacter.mockResolvedValue(character1)
      mockClient.updateVehicle.mockResolvedValue(vehicle1)
      mockClient.touchFight.mockResolvedValue(multiShotFight)

      renderWithProviders(multiShotFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        expect(MockedCS.rollInitiative).toHaveBeenCalledTimes(2) // Both characters
        expect(mockClient.updateCharacter).toHaveBeenCalledTimes(2)
        expect(mockClient.updateVehicle).toHaveBeenCalledTimes(1)
      })
    })

    it('should skip shots with positive numbers', async () => {
      const character1 = createMockCharacter({ id: '1', character_type: 'npc' })
      const character2 = createMockCharacter({ id: '2', character_type: 'npc' })
      
      const positiveShotFight = createMockFight({
        id: '123',
        sequence: 1,
        shot_order: [
          [0, [character1]], 
          [5, [character2]] // Positive shot should be skipped
        ]
      })

      MockedCS.isType.mockReturnValue(false)
      MockedCS.actionValue.mockReturnValue(10)
      MockedCS.isCharacter.mockReturnValue(true)
      MockedCS.rollInitiative.mockReturnValue(character1)

      mockClient.updateCharacter.mockResolvedValue(character1)
      mockClient.touchFight.mockResolvedValue(positiveShotFight)

      renderWithProviders(positiveShotFight)
      
      const button = screen.getByRole('button')
      fireEvent.click(button)

      await waitFor(() => {
        // Should only roll for character on shot 0, not shot 5
        expect(MockedCS.rollInitiative).toHaveBeenCalledTimes(1)
        expect(MockedCS.rollInitiative).toHaveBeenCalledWith(character1)
      })
    })
  })
})