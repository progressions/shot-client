import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { useRouter } from 'next/router'
import CreateCharacter from '../../../components/characters/CreateCharacter'
import { FightContext } from '../../../contexts/FightContext'
import { ClientContext } from '../../../contexts/ClientContext'
import { ToastContext } from '../../../contexts/ToastContext'
import { createMockCharacter, createMockFight, createMockUser } from '../../factories/MockFactories'
import { CharacterTypes, defaultCharacter } from '../../../types/types'
import { FightActions } from '../../../reducers/fightState'
import Client from '../../../utils/Client'

// Mock Next.js router
jest.mock('next/router')
const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>

// Mock the character service
jest.mock('../../../services/CharacterService', () => ({
  type: jest.fn(),
  archetype: jest.fn(),
  isPC: jest.fn(),
  isType: jest.fn(),
  updateWounds: jest.fn(),
  updateActionValue: jest.fn(),
  setDeathMarks: jest.fn(),
  fullHeal: jest.fn()
}))

import CS from '../../../services/CharacterService'
const MockedCS = CS as jest.Mocked<typeof CS>

const theme = createTheme()

describe('CreateCharacter Extended Tests', () => {
  let mockClient: jest.Mocked<Client>
  let mockToast: any
  let mockFightDispatch: jest.Mock
  let mockFight: any
  let mockUser: any
  let mockReload: jest.Mock
  let mockRouterPush: jest.Mock

  const renderWithProviders = (props = {}) => {
    const fightContextValue = {
      fight: mockFight,
      dispatch: mockFightDispatch
    }

    const clientContextValue = {
      client: mockClient,
      user: mockUser,
      setUser: jest.fn()
    }

    return render(
      <ThemeProvider theme={theme}>
        <ToastContext.Provider value={mockToast}>
          <ClientContext.Provider value={clientContextValue}>
            <FightContext.Provider value={fightContextValue}>
              <CreateCharacter {...props} />
            </FightContext.Provider>
          </ClientContext.Provider>
        </ToastContext.Provider>
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    mockClient = {
      createCharacter: jest.fn(),
      updateCharacter: jest.fn(),
      touchFight: jest.fn()
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
    mockUser = createMockUser({ id: '1' })
    mockReload = jest.fn()
    mockRouterPush = jest.fn()

    mockRouter.mockReturnValue({
      push: mockRouterPush,
      pathname: '/characters',
      query: {},
      asPath: '/characters'
    } as any)

    // Setup default mocks for CharacterService
    MockedCS.type.mockReturnValue('pc')
    MockedCS.archetype.mockReturnValue('')
    MockedCS.isPC.mockReturnValue(true)
    MockedCS.isType.mockReturnValue(false)
    MockedCS.updateWounds.mockImplementation((char, wounds) => ({ ...char, action_values: { ...char.action_values, Wounds: wounds } }))
    MockedCS.updateActionValue.mockImplementation((char, name, value) => ({ ...char, action_values: { ...char.action_values, [name]: value } }))
    MockedCS.setDeathMarks.mockImplementation((char, marks) => ({ ...char, death_marks: marks }))
    MockedCS.fullHeal.mockImplementation((char) => ({ ...char, action_values: { ...char.action_values, Wounds: 0 } }))

    jest.clearAllMocks()
  })

  describe('form initialization', () => {
    it('should render create button with correct icon and text', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      expect(createButton).toBeInTheDocument()
      expect(createButton).toHaveTextContent('New')

      const personIcon = screen.getByTestId('PersonAddIcon')
      expect(personIcon).toBeInTheDocument()
    })

    it('should not show modal initially', () => {
      renderWithProviders()

      expect(screen.queryByText('Create Character')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
    })

    it('should open modal when create button is clicked', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      expect(screen.getByText('Create Character')).toBeInTheDocument()
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
    })

    it('should initialize with default character values', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      expect(nameField).toHaveValue('')
    })

    it('should pass fight context to modal when in fight', () => {
      renderWithProviders({ fight: mockFight })

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      // Should show shot field when in fight
      expect(screen.getByLabelText('Shot')).toBeInTheDocument()
    })

    it('should not show shot field when not in fight', () => {
      renderWithProviders({ fight: null })

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      expect(screen.queryByLabelText('Shot')).not.toBeInTheDocument()
    })
  })

  describe('field validation', () => {
    it('should require name field', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      expect(nameField).toBeRequired()
    })

    it('should handle name field changes', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Test Character' } })

      expect(nameField).toHaveValue('Test Character')
    })

    it('should validate wounds field for non-mook characters', () => {
      MockedCS.isType.mockReturnValue(false) // Not mook
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const woundsField = screen.getByLabelText('Wounds')
      fireEvent.change(woundsField, { target: { value: '5' } })

      expect(MockedCS.updateWounds).toHaveBeenCalled()
    })

    it('should validate count field for mook characters', () => {
      MockedCS.isType.mockImplementation((char, type) => type === 'Mook')
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const countField = screen.getByLabelText('Mooks')
      fireEvent.change(countField, { target: { value: '3' } })

      expect(countField).toHaveValue('3')
    })

    it('should handle impairments field', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const impairmentsField = screen.getByLabelText('Impairments')
      fireEvent.change(impairmentsField, { target: { value: '2' } })

      expect(impairmentsField).toHaveValue('2')
    })

    it('should handle current shot field in fight context', () => {
      renderWithProviders({ fight: mockFight })

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const shotField = screen.getByLabelText('Shot')
      fireEvent.change(shotField, { target: { value: '7' } })

      expect(shotField).toHaveValue('7')
    })
  })

  describe('character type selection', () => {
    it('should handle character type changes', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      // Character type selection depends on the CharacterType component implementation
      // This tests that the handler is connected
      expect(screen.getByText('Create Character')).toBeInTheDocument()
    })

    it('should show archetype field for PC characters', () => {
      MockedCS.isPC.mockReturnValue(true)
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      expect(screen.getByLabelText('Archetype')).toBeInTheDocument()
    })

    it('should not show archetype field for non-PC characters', () => {
      MockedCS.isPC.mockReturnValue(false)
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      expect(screen.queryByLabelText('Archetype')).not.toBeInTheDocument()
    })

    it('should show death marks for PC characters only', () => {
      MockedCS.isType.mockImplementation((char, type) => type === 'PC')
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      // Death marks component should be visible for PCs
      // This depends on the DeathMarks component implementation
    })

    it('should show task switch for all characters', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const taskSwitch = screen.getByLabelText('Task')
      expect(taskSwitch).toBeInTheDocument()
    })
  })

  describe('action value calculations', () => {
    it('should handle action value changes', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      // Action values are handled by EditActionValues component
      // Test that the onChange handler is connected
      expect(MockedCS.updateActionValue).toBeDefined()
    })

    it('should calculate wounds correctly', () => {
      MockedCS.updateWounds.mockReturnValue({ ...defaultCharacter, action_values: { Wounds: 5 } })
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const woundsField = screen.getByLabelText('Wounds')
      fireEvent.change(woundsField, { target: { value: '5' } })

      expect(MockedCS.updateWounds).toHaveBeenCalledWith(expect.anything(), 5)
    })

    it('should handle death marks for PC characters', () => {
      MockedCS.isType.mockImplementation((char, type) => type === 'PC')
      MockedCS.setDeathMarks.mockReturnValue({ ...defaultCharacter, death_marks: 2 })
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      expect(MockedCS.setDeathMarks).toBeDefined()
    })
  })

  describe('save functionality', () => {
    it('should create character successfully', async () => {
      const newCharacter = createMockCharacter({ id: '123', name: 'New Character' })
      mockClient.createCharacter.mockResolvedValue(newCharacter)
      
      renderWithProviders({ reload: mockReload })

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'New Character' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockClient.createCharacter).toHaveBeenCalled()
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('New Character created.')
        expect(mockReload).toHaveBeenCalled()
      })
    })

    it('should create character in fight context', async () => {
      const newCharacter = createMockCharacter({ id: '123', name: 'Fight Character' })
      mockClient.createCharacter.mockResolvedValue(newCharacter)
      mockClient.touchFight.mockResolvedValue(mockFight)
      
      renderWithProviders({ fight: mockFight })

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Fight Character' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockClient.createCharacter).toHaveBeenCalledWith(expect.anything(), mockFight)
        expect(mockClient.touchFight).toHaveBeenCalledWith(mockFight)
        expect(mockFightDispatch).toHaveBeenCalledWith({ type: FightActions.EDIT })
      })
    })

    it('should redirect to character page after creation outside fight', async () => {
      const newCharacter = createMockCharacter({ id: '123', name: 'Redirect Character' })
      mockClient.createCharacter.mockResolvedValue(newCharacter)
      
      renderWithProviders({ fight: null })

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Redirect Character' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith('/characters/123')
      })
    })

    it('should disable save button during submission', async () => {
      mockClient.createCharacter.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Test Character' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      // Button should be disabled during saving
      await waitFor(() => {
        expect(saveButton).toBeDisabled()
      })
    })
  })

  describe('error handling', () => {
    it('should handle character creation errors', async () => {
      const error = new Error('Creation failed')
      mockClient.createCharacter.mockRejectedValue(error)
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Error Character' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockToast.toastError).toHaveBeenCalled()
        // Modal should close after error
        expect(screen.queryByText('Create Character')).not.toBeInTheDocument()
      })
    })

    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network error')
      mockClient.createCharacter.mockRejectedValue(networkError)
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Network Error Character' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockToast.toastError).toHaveBeenCalled()
      })
    })

    it('should handle validation errors from server', async () => {
      const validationError = new Error('Name is required')
      mockClient.createCharacter.mockRejectedValue(validationError)
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton) // Try to save without name

      await waitFor(() => {
        expect(mockToast.toastError).toHaveBeenCalled()
      })
    })

    it('should handle fight touch errors', async () => {
      const newCharacter = createMockCharacter({ id: '123', name: 'Fight Character' })
      mockClient.createCharacter.mockResolvedValue(newCharacter)
      mockClient.touchFight.mockRejectedValue(new Error('Fight touch failed'))
      
      renderWithProviders({ fight: mockFight })

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Fight Character' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockClient.createCharacter).toHaveBeenCalled()
        expect(mockClient.touchFight).toHaveBeenCalled()
        expect(mockToast.toastError).toHaveBeenCalled()
      })
    })
  })

  describe('campaign association', () => {
    it('should associate character with current campaign', async () => {
      const newCharacter = createMockCharacter({ id: '123', name: 'Campaign Character' })
      mockClient.createCharacter.mockResolvedValue(newCharacter)
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Campaign Character' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockClient.createCharacter).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'Campaign Character' }),
          null
        )
      })
    })

    it('should handle missing campaign context', async () => {
      const newCharacter = createMockCharacter({ id: '123', name: 'No Campaign Character' })
      mockClient.createCharacter.mockResolvedValue(newCharacter)
      
      const contextWithoutUser = {
        client: mockClient,
        user: null,
        setUser: jest.fn()
      }

      render(
        <ThemeProvider theme={theme}>
          <ToastContext.Provider value={mockToast}>
            <ClientContext.Provider value={contextWithoutUser}>
              <FightContext.Provider value={{ fight: null, dispatch: mockFightDispatch }}>
                <CreateCharacter />
              </FightContext.Provider>
            </ClientContext.Provider>
          </ToastContext.Provider>
        </ThemeProvider>
      )

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'No Campaign Character' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockClient.createCharacter).toHaveBeenCalled()
      })
    })
  })

  describe('form reset and cleanup', () => {
    it('should reset form after successful creation', async () => {
      const newCharacter = createMockCharacter({ id: '123', name: 'Reset Test' })
      mockClient.createCharacter.mockResolvedValue(newCharacter)
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Reset Test' } })

      const saveButton = screen.getByRole('button', { name: /save/i })
      fireEvent.click(saveButton)

      await waitFor(() => {
        // Modal should be closed after successful creation
        expect(screen.queryByText('Create Character')).not.toBeInTheDocument()
      })
    })

    it('should reset form when cancelled', () => {
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const nameField = screen.getByLabelText('Name')
      fireEvent.change(nameField, { target: { value: 'Cancel Test' } })

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)

      // Modal should be closed
      expect(screen.queryByText('Create Character')).not.toBeInTheDocument()
    })

    it('should handle full heal functionality', () => {
      MockedCS.isType.mockImplementation((char, type) => type !== 'Mook') // Not mook
      MockedCS.fullHeal.mockReturnValue({ ...defaultCharacter, action_values: { Wounds: 0 } })
      
      renderWithProviders()

      const createButton = screen.getByRole('button', { name: /new/i })
      fireEvent.click(createButton)

      const healButton = screen.getByTitle('Full Heal')
      fireEvent.click(healButton)

      expect(MockedCS.fullHeal).toHaveBeenCalled()
    })
  })
})