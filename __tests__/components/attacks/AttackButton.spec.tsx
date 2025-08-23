import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AttackButton from '../../../components/attacks/AttackButton'
import { FightActions, initialFightState } from '../../../reducers/fightState'
import { defaultFight } from '../../../types/types'

// Mock the contexts and modals
jest.mock('../../../contexts', () => ({
  useFight: jest.fn()
}))

// Mock the heavy modal components
jest.mock('../../../components/attacks/AttackModal', () => {
  return function MockAttackModal() {
    return <div data-testid="attack-modal">Attack Modal</div>
  }
})

jest.mock('../../../components/chases/ChaseModal', () => {
  return function MockChaseModal() {
    return <div data-testid="chase-modal">Chase Modal</div>
  }
})

// Mock React Icons
jest.mock('react-icons/gi', () => ({
  GiPistolGun: () => <div data-testid="pistol-icon">Pistol</div>
}))

import { useFight } from '../../../contexts'

describe('AttackButton', () => {
  const mockDispatch = jest.fn()
  const mockUseFight = useFight as jest.MockedFunction<typeof useFight>

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseFight.mockReturnValue({
      fight: defaultFight,
      state: {
        ...initialFightState,
        attacking: false,
        chasing: false
      },
      dispatch: mockDispatch
    })
  })

  describe('rendering', () => {
    it('should render attack and chase buttons', () => {
      render(<AttackButton />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
    })

    it('should render attack button with pistol icon', () => {
      render(<AttackButton />)
      
      expect(screen.getByTestId('pistol-icon')).toBeInTheDocument()
    })

    it('should render chase button with taxi icon', () => {
      const { container } = render(<AttackButton />)
      
      // Material-UI TaxiAlertIcon should be rendered
      const taxiIcon = container.querySelector('[data-testid="TaxiAlertIcon"]')
      expect(taxiIcon).toBeInTheDocument()
    })

    it('should render buttons in a ButtonGroup', () => {
      const { container } = render(<AttackButton />)
      
      const buttonGroup = container.querySelector('.MuiButtonGroup-root')
      expect(buttonGroup).toBeInTheDocument()
    })
  })

  describe('button styling', () => {
    it('should render buttons with contained variant and error color', () => {
      const { container } = render(<AttackButton />)
      
      const buttons = container.querySelectorAll('.MuiButton-root')
      expect(buttons).toHaveLength(2)
      
      buttons.forEach(button => {
        expect(button).toHaveClass('MuiButton-contained')
        expect(button).toHaveClass('MuiButton-containedError')
      })
    })

    it('should render buttons with start icons', () => {
      const { container } = render(<AttackButton />)
      
      const startIcons = container.querySelectorAll('.MuiButton-startIcon')
      expect(startIcons).toHaveLength(2)
    })
  })

  describe('attack button interaction', () => {
    it('should dispatch ATTACK action with true when attacking is false', () => {
      mockUseFight.mockReturnValue({
        fight: defaultFight,
        state: {
          ...initialFightState,
          attacking: false,
          chasing: false
        },
        dispatch: mockDispatch
      })

      render(<AttackButton />)
      
      const attackButton = screen.getByTestId('pistol-icon').closest('button')
      fireEvent.click(attackButton!)
      
      expect(mockDispatch).toHaveBeenCalledWith({
        type: FightActions.ATTACK,
        payload: true
      })
    })

    it('should dispatch ATTACK action with false when attacking is true', () => {
      mockUseFight.mockReturnValue({
        fight: defaultFight,
        state: {
          ...initialFightState,
          attacking: true,
          chasing: false
        },
        dispatch: mockDispatch
      })

      render(<AttackButton />)
      
      const attackButton = screen.getByTestId('pistol-icon').closest('button')
      fireEvent.click(attackButton!)
      
      expect(mockDispatch).toHaveBeenCalledWith({
        type: FightActions.ATTACK,
        payload: false
      })
    })

    it('should handle multiple clicks on attack button', () => {
      render(<AttackButton />)
      
      const attackButton = screen.getByTestId('pistol-icon').closest('button')
      
      fireEvent.click(attackButton!)
      fireEvent.click(attackButton!)
      fireEvent.click(attackButton!)
      
      expect(mockDispatch).toHaveBeenCalledTimes(3)
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: FightActions.ATTACK,
        payload: true
      })
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        type: FightActions.ATTACK,
        payload: true
      })
      expect(mockDispatch).toHaveBeenNthCalledWith(3, {
        type: FightActions.ATTACK,
        payload: true
      })
    })
  })

  describe('chase button interaction', () => {
    it('should dispatch CHASE action with true when chasing is false', () => {
      mockUseFight.mockReturnValue({
        fight: defaultFight,
        state: {
          ...initialFightState,
          attacking: false,
          chasing: false
        },
        dispatch: mockDispatch
      })

      render(<AttackButton />)
      
      const chaseButton = screen.getAllByRole('button')[1] // Second button is chase
      fireEvent.click(chaseButton)
      
      expect(mockDispatch).toHaveBeenCalledWith({
        type: FightActions.CHASE,
        payload: true
      })
    })

    it('should dispatch CHASE action with false when chasing is true', () => {
      mockUseFight.mockReturnValue({
        fight: defaultFight,
        state: {
          ...initialFightState,
          attacking: false,
          chasing: true
        },
        dispatch: mockDispatch
      })

      render(<AttackButton />)
      
      const chaseButton = screen.getAllByRole('button')[1]
      fireEvent.click(chaseButton)
      
      expect(mockDispatch).toHaveBeenCalledWith({
        type: FightActions.CHASE,
        payload: false
      })
    })

    it('should handle multiple clicks on chase button', () => {
      render(<AttackButton />)
      
      const chaseButton = screen.getAllByRole('button')[1]
      
      fireEvent.click(chaseButton)
      fireEvent.click(chaseButton)
      
      expect(mockDispatch).toHaveBeenCalledTimes(2)
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: FightActions.CHASE,
        payload: true
      })
      expect(mockDispatch).toHaveBeenNthCalledWith(2, {
        type: FightActions.CHASE,
        payload: true
      })
    })
  })

  describe('context integration', () => {
    it('should use FightContext for state and dispatch', () => {
      render(<AttackButton />)
      
      expect(mockUseFight).toHaveBeenCalled()
    })

    it('should work with different fight state values', () => {
      mockUseFight.mockReturnValue({
        fight: defaultFight,
        state: {
          ...initialFightState,
          attacking: true,
          chasing: true
        },
        dispatch: mockDispatch
      })

      render(<AttackButton />)
      
      // Should render without errors with different state values
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })
  })

  describe('event handling', () => {
    it('should handle SyntheticEvent correctly for attack button', () => {
      render(<AttackButton />)
      
      const attackButton = screen.getByTestId('pistol-icon').closest('button')
      
      // Create a synthetic event-like object
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      }
      
      fireEvent.click(attackButton!, mockEvent)
      
      expect(mockDispatch).toHaveBeenCalledWith({
        type: FightActions.ATTACK,
        payload: true
      })
    })

    it('should handle SyntheticEvent correctly for chase button', () => {
      render(<AttackButton />)
      
      const chaseButton = screen.getAllByRole('button')[1]
      
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      }
      
      fireEvent.click(chaseButton, mockEvent)
      
      expect(mockDispatch).toHaveBeenCalledWith({
        type: FightActions.CHASE,
        payload: true
      })
    })
  })

  describe('accessibility', () => {
    it('should render accessible buttons', () => {
      render(<AttackButton />)
      
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button')
        expect(button).not.toHaveAttribute('disabled')
      })
    })

    it('should be keyboard accessible', () => {
      render(<AttackButton />)
      
      const attackButton = screen.getAllByRole('button')[0]
      const chaseButton = screen.getAllByRole('button')[1]
      
      // Buttons should be focusable
      attackButton.focus()
      expect(document.activeElement).toBe(attackButton)
      
      chaseButton.focus()
      expect(document.activeElement).toBe(chaseButton)
    })
  })

  describe('edge cases', () => {
    it('should handle missing dispatch function gracefully', () => {
      mockUseFight.mockReturnValue({
        fight: defaultFight,
        state: {
          ...initialFightState,
          attacking: false,
          chasing: false
        },
        dispatch: undefined as any
      })

      render(<AttackButton />)
      
      // Should render without crashing
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })

    it('should handle missing state properties', () => {
      mockUseFight.mockReturnValue({
        fight: defaultFight,
        state: {} as any,
        dispatch: mockDispatch
      })

      render(<AttackButton />)
      
      const attackButton = screen.getAllByRole('button')[0]
      fireEvent.click(attackButton)
      
      // Should default to toggling false values
      expect(mockDispatch).toHaveBeenCalledWith({
        type: FightActions.ATTACK,
        payload: true
      })
    })

    it('should handle null state', () => {
      mockUseFight.mockReturnValue({
        fight: defaultFight,
        state: null as any,
        dispatch: mockDispatch
      })

      render(<AttackButton />)
      
      // Should render without crashing
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })
  })
})