import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import RollInitiative from '../../../components/fights/RollInitiative'
import { defaultFight, defaultCharacter, CharacterTypes } from '../../../types/types'
import type { Fight, Character, ShotType } from '../../../types/types'
import { FightActions } from '../../../reducers/fightState'
import CS from '../../../services/CharacterService'
import FES from '../../../services/FightEventService'
import { useFight } from '../../../contexts/FightContext'

// Mock contexts
const mockFight = {
  ...defaultFight,
  id: 'fight-123',
  sequence: 1,
  shot_order: [
    [5, []],
    [6, []],
    [7, []]
  ] as ShotType[]
}

const mockClient = {
  updateFight: jest.fn(),
  updateCharacter: jest.fn(),
  updateVehicle: jest.fn(),
  touchFight: jest.fn()
}

const mockDispatchFight = jest.fn()
const mockToastSuccess = jest.fn()
const mockToastError = jest.fn()

jest.mock('../../../contexts/FightContext', () => ({
  useFight: jest.fn()
}))

jest.mock('../../../contexts/ToastContext', () => ({
  useToast: () => ({
    toastSuccess: mockToastSuccess,
    toastError: mockToastError
  })
}))

jest.mock('../../../contexts/ClientContext', () => ({
  useClient: () => ({
    client: mockClient
  })
}))

// Mock services
jest.mock('../../../services/CharacterService', () => ({
  isType: jest.fn(),
  actionValue: jest.fn(),
  isCharacter: jest.fn(),
  rollInitiative: jest.fn()
}))

jest.mock('../../../services/FightEventService', () => ({
  startSequence: jest.fn()
}))

describe('RollInitiative', () => {
  const mockIsType = CS.isType as jest.MockedFunction<typeof CS.isType>
  const mockActionValue = CS.actionValue as jest.MockedFunction<typeof CS.actionValue>
  const mockIsCharacter = CS.isCharacter as jest.MockedFunction<typeof CS.isCharacter>
  const mockRollInitiative = CS.rollInitiative as jest.MockedFunction<typeof CS.rollInitiative>
  const mockStartSequence = FES.startSequence as jest.MockedFunction<typeof FES.startSequence>

  const theme = createTheme()

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    )
  }

  const createTestCharacter = (type: string = 'Boss', speed: number = 6): Character => ({
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Character',
    category: 'character',
    action_values: {
      ...defaultCharacter.action_values,
      Type: type as any,
      Speed: speed
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useFight as jest.Mock).mockReturnValue({
      fight: mockFight,
      dispatch: mockDispatchFight
    })
    mockClient.updateFight.mockResolvedValue(mockFight)
    mockClient.updateCharacter.mockResolvedValue(defaultCharacter)
    mockClient.updateVehicle.mockResolvedValue({})
    mockClient.touchFight.mockResolvedValue({})
    mockStartSequence.mockResolvedValue({ id: 'event-1', event_type: 'sequence_started' } as any)
    mockRollInitiative.mockReturnValue(defaultCharacter)
  })

  describe('basic rendering', () => {
    it('should render initiative button', () => {
      renderWithTheme(<RollInitiative />)

      expect(screen.getByRole('button', { name: /initiative/i })).toBeInTheDocument()
    })

    it('should show Initiative label when not at start of sequence', () => {
      renderWithTheme(<RollInitiative />)

      expect(screen.getByText('Initiative')).toBeInTheDocument()
    })

    it('should show Start label when at start of sequence', () => {
      // Mock fight with shot 0 to indicate start of sequence
      const startFight = {
        ...mockFight,
        shot_order: [[0, []] as ShotType]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: startFight,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      expect(screen.getByText('Start')).toBeInTheDocument()
    })

    it('should render with PlayArrow icon', () => {
      renderWithTheme(<RollInitiative />)

      expect(screen.getByTestId('PlayArrowIcon')).toBeInTheDocument()
    })

    it('should be enabled by default', () => {
      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      expect(button).not.toBeDisabled()
    })
  })

  describe('start of sequence detection', () => {
    it('should detect start of sequence when first shot is 0', () => {
      const startFight = {
        ...mockFight,
        shot_order: [[0, []] as ShotType, [1, []] as ShotType]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: startFight,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      expect(screen.getByText('Start')).toBeInTheDocument()
    })

    it('should not detect start of sequence when first shot is not 0', () => {
      const midFight = {
        ...mockFight,
        shot_order: [[5, []] as ShotType, [6, []] as ShotType]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: midFight,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      expect(screen.getByText('Initiative')).toBeInTheDocument()
    })

    it('should handle empty shot order gracefully', () => {
      const emptyFight = {
        ...mockFight,
        shot_order: []
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: emptyFight,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('button click handling', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should disable button during processing', async () => {
      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      expect(button).toBeDisabled()
    })

    it('should call appropriate methods for non-start sequence', async () => {
      const fightWithCharacters = {
        ...mockFight,
        shot_order: [
          [0, [createTestCharacter('Boss', 6)]] as ShotType,
          [1, []] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithCharacters,
        dispatch: mockDispatchFight
      })

      mockIsType.mockReturnValue(false) // Not a PC
      mockActionValue.mockReturnValue(6) // Has Speed
      mockIsCharacter.mockReturnValue(true) // Is a character

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalledWith(fightWithCharacters)
      })

      expect(mockDispatchFight).toHaveBeenCalledWith({ type: FightActions.EDIT })
      expect(mockToastSuccess).toHaveBeenCalledWith('Initiative updated')
    })

    it('should handle start of sequence properly', async () => {
      const startFight = {
        ...mockFight,
        shot_order: [[0, []] as ShotType]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: startFight,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /start/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.updateFight).toHaveBeenCalledWith({
          id: 'fight-123',
          sequence: 2
        })
      })

      expect(mockStartSequence).toHaveBeenCalledWith(mockClient, startFight, 2)
    })
  })

  describe('character filtering and processing', () => {
    const pcCharacter = createTestCharacter('PC', 6)
    const npcCharacter = createTestCharacter('Boss', 6)
    const characterWithoutSpeed = createTestCharacter('Boss', 0)

    beforeEach(() => {
      mockIsType.mockImplementation((char, type) => {
        return char.action_values?.Type === type
      })
      mockActionValue.mockImplementation((char, stat) => {
        const value = char.action_values?.[stat as keyof typeof char.action_values]
        return typeof value === 'number' ? value : 0
      })
      mockIsCharacter.mockReturnValue(true)
    })

    it('should filter out PC characters from initiative rolling', async () => {
      const fightWithPCs = {
        ...mockFight,
        shot_order: [
          [0, [pcCharacter, npcCharacter]] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithPCs,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
      })

      // Should only process the non-PC character
      expect(mockRollInitiative).toHaveBeenCalledTimes(1)
      expect(mockRollInitiative).toHaveBeenCalledWith(npcCharacter)
    })

    it('should filter out characters without Speed', async () => {
      const fightWithoutSpeed = {
        ...mockFight,
        shot_order: [
          [0, [npcCharacter, characterWithoutSpeed]] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithoutSpeed,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
      })

      // Should only process the character with Speed
      expect(mockRollInitiative).toHaveBeenCalledTimes(1)
      expect(mockRollInitiative).toHaveBeenCalledWith(npcCharacter)
    })

    it('should only process shots with shot <= 0', async () => {
      const fightWithMixedShots = {
        ...mockFight,
        shot_order: [
          [-1, [npcCharacter]] as ShotType, // Should process
          [0, [createTestCharacter('Boss', 7)]] as ShotType, // Should process
          [1, [createTestCharacter('Boss', 8)]] as ShotType, // Should NOT process
          [5, [createTestCharacter('Boss', 9)]] as ShotType  // Should NOT process
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithMixedShots,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
      })

      // Should process 2 characters (from shots -1 and 0)
      expect(mockRollInitiative).toHaveBeenCalledTimes(2)
    })
  })

  describe('character vs vehicle handling', () => {
    const testCharacter = createTestCharacter('Boss', 6)
    const testVehicle = {
      ...createTestCharacter('Boss', 6),
      category: 'vehicle' as const,
      action_values: {
        ...createTestCharacter('Boss', 6).action_values,
        Acceleration: 8
      }
    }

    beforeEach(() => {
      mockIsType.mockReturnValue(false) // Not PC
      mockActionValue.mockImplementation((char, stat) => {
        const value = char.action_values?.[stat as keyof typeof char.action_values]
        return typeof value === 'number' ? value : 0
      })
    })

    it('should handle characters separately from vehicles', async () => {
      const fightWithMixed = {
        ...mockFight,
        shot_order: [
          [0, [testCharacter, testVehicle]] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithMixed,
        dispatch: mockDispatchFight
      })

      mockIsCharacter.mockImplementation((char) => char.category === 'character')

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
      })

      expect(mockClient.updateCharacter).toHaveBeenCalledWith(expect.anything(), fightWithMixed)
      expect(mockClient.updateVehicle).toHaveBeenCalledWith(
        { ...testVehicle, current_shot: 0 }, 
        fightWithMixed
      )
    })

    it('should handle vehicles with Acceleration instead of Speed', async () => {
      const vehicleWithAcceleration = {
        ...testVehicle,
        action_values: {
          ...testVehicle.action_values,
          Speed: 0,
          Acceleration: 8
        }
      }

      const fightWithVehicle = {
        ...mockFight,
        shot_order: [
          [0, [vehicleWithAcceleration]] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithVehicle,
        dispatch: mockDispatchFight
      })

      mockIsCharacter.mockReturnValue(false) // Is a vehicle

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.updateVehicle).toHaveBeenCalledWith(
          { ...vehicleWithAcceleration, current_shot: 0 }, 
          fightWithVehicle
        )
      })
    })
  })

  describe('error handling', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should handle updateFight errors', async () => {
      const startFight = {
        ...mockFight,
        shot_order: [[0, []] as ShotType]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: startFight,
        dispatch: mockDispatchFight
      })

      mockClient.updateFight.mockRejectedValue(new Error('Update failed'))

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /start/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockDispatchFight).toHaveBeenCalledWith({
          type: FightActions.ERROR,
          payload: expect.any(Error)
        })
      })

      expect(mockToastError).toHaveBeenCalled()
    })

    it('should handle updateCharacter errors gracefully', async () => {
      const fightWithCharacter = {
        ...mockFight,
        shot_order: [
          [0, [createTestCharacter('Boss', 6)]] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithCharacter,
        dispatch: mockDispatchFight
      })

      mockIsType.mockReturnValue(false)
      mockActionValue.mockReturnValue(6)
      mockIsCharacter.mockReturnValue(true)
      mockClient.updateCharacter.mockRejectedValue(new Error('Character update failed'))

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      // Should still complete processing despite character update error
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Initiative updated')
      })
    })

    it('should handle updateVehicle errors gracefully', async () => {
      const testVehicle = {
        ...createTestCharacter('Boss', 0),
        category: 'vehicle' as const,
        action_values: {
          ...createTestCharacter('Boss', 0).action_values,
          Acceleration: 8
        }
      }

      const fightWithVehicle = {
        ...mockFight,
        shot_order: [
          [0, [testVehicle]] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithVehicle,
        dispatch: mockDispatchFight
      })

      mockIsType.mockReturnValue(false)
      mockActionValue.mockReturnValue(8)
      mockIsCharacter.mockReturnValue(false)
      mockClient.updateVehicle.mockRejectedValue(new Error('Vehicle update failed'))

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      // Should still complete processing despite vehicle update error
      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Initiative updated')
      })
    })
  })

  describe('sequence management', () => {
    it('should increment sequence at start', async () => {
      const startFight = {
        ...mockFight,
        sequence: 3,
        shot_order: [[0, []] as ShotType]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: startFight,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /start/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.updateFight).toHaveBeenCalledWith({
          id: 'fight-123',
          sequence: 4
        })
      })

      expect(mockStartSequence).toHaveBeenCalledWith(mockClient, startFight, 4)
    })

    it('should not increment sequence when not at start', async () => {
      const midFight = {
        ...mockFight,
        sequence: 2,
        shot_order: [[5, []] as ShotType]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: midFight,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
      })

      expect(mockClient.updateFight).not.toHaveBeenCalled()
      expect(mockStartSequence).not.toHaveBeenCalled()
    })
  })

  describe('accessibility and styling', () => {
    it('should have proper button styling', () => {
      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      expect(button).toHaveClass('MuiButton-contained')
    })

    it('should have accessible button text', () => {
      renderWithTheme(<RollInitiative />)

      expect(screen.getByRole('button', { name: /initiative/i })).toBeInTheDocument()
    })

    it('should handle button focus correctly', () => {
      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      button.focus()

      expect(document.activeElement).toBe(button)
    })
  })

  describe('edge cases', () => {
    it('should handle null shot values', async () => {
      const fightWithNullShot = {
        ...mockFight,
        shot_order: [
          [null, [createTestCharacter('Boss', 6)]] as any,
          [0, [createTestCharacter('Boss', 7)]] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithNullShot,
        dispatch: mockDispatchFight
      })

      mockIsType.mockReturnValue(false)
      mockActionValue.mockReturnValue(6)
      mockIsCharacter.mockReturnValue(true)

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
      })

      // Should only process the shot with value 0, not the null shot
      expect(mockRollInitiative).toHaveBeenCalledTimes(1)
    })

    it('should handle undefined shot values', async () => {
      const fightWithUndefinedShot = {
        ...mockFight,
        shot_order: [
          [undefined, [createTestCharacter('Boss', 6)]] as any,
          [-1, [createTestCharacter('Boss', 7)]] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithUndefinedShot,
        dispatch: mockDispatchFight
      })

      mockIsType.mockReturnValue(false)
      mockActionValue.mockReturnValue(6)
      mockIsCharacter.mockReturnValue(true)

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
      })

      // Should only process the shot with value -1
      expect(mockRollInitiative).toHaveBeenCalledTimes(1)
    })

    it('should handle empty character arrays in shots', async () => {
      const fightWithEmptyShots = {
        ...mockFight,
        shot_order: [
          [0, []] as ShotType,
          [-1, []] as ShotType
        ]
      }
      
      ;(useFight as jest.Mock).mockReturnValue({
        fight: fightWithEmptyShots,
        dispatch: mockDispatchFight
      })

      renderWithTheme(<RollInitiative />)

      const button = screen.getByRole('button', { name: /initiative/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalled()
      })

      expect(mockRollInitiative).not.toHaveBeenCalled()
      expect(mockToastSuccess).toHaveBeenCalledWith('Initiative updated')
    })
  })
})