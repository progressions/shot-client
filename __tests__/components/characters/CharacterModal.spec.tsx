import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CharacterModal from '../../../components/characters/CharacterModal'
import { defaultCharacter, defaultFight, defaultUser, CharacterTypes } from '../../../types/types'
import type { Character, Fight, User } from '../../../types/types'
import { FormActions } from '../../../reducers/formState'
import { FightActions } from '../../../reducers/fightState'
import CS from '../../../services/CharacterService'

// Mock next/router
const mockPush = jest.fn()
const mockRouter = {
  push: mockPush,
  query: {},
  pathname: '/characters'
}

jest.mock('next/router', () => ({
  useRouter: () => mockRouter
}))

// Mock contexts  
const mockFight: any = {
  ...defaultFight,
  id: 'fight-123'
}

const mockUser = {
  ...defaultUser,
  gamemaster: true
}

const mockClient = {
  createCharacter: jest.fn(),
  updateCharacter: jest.fn(),
  touchFight: jest.fn()
}

const mockDispatchFight = jest.fn()

const mockUseFight = {
  fight: mockFight,
  dispatch: mockDispatchFight
}
const mockDispatchForm = jest.fn()
const mockToastSuccess = jest.fn()
const mockToastError = jest.fn()
const mockReload = jest.fn()

jest.mock('../../../contexts', () => ({
  useFight: () => mockUseFight,
  useClient: () => ({
    user: mockUser,
    client: mockClient
  }),
  useToast: () => ({
    toastSuccess: mockToastSuccess,
    toastError: mockToastError
  })
}))

// Mock useForm hook
jest.mock('../../../reducers/formState', () => ({
  FormActions: {
    UPDATE: 'UPDATE',
    OPEN: 'OPEN',
    SUBMIT: 'SUBMIT',
    RESET: 'RESET'
  },
  useForm: jest.fn()
}))

// Mock CharacterService
jest.mock('../../../services/CharacterService', () => ({
  __esModule: true,
  default: {
    isType: jest.fn(),
    isPC: jest.fn(),
    type: jest.fn(),
    archetype: jest.fn(),
    updateWounds: jest.fn(),
    updateActionValue: jest.fn(),
    setDeathMarks: jest.fn(),
    fullHeal: jest.fn()
  }
}))

import CharacterService from '../../../services/CharacterService'
const mockCharacterService = CharacterService as jest.Mocked<typeof CharacterService>

// Mock child components
jest.mock('../../../components/characters/edit/ColorPicker', () => ({
  __esModule: true,
  default: ({ character, onChange, setCharacter }: any) => (
    <div data-testid="color-picker">
      <button 
        data-testid="color-picker-button"
        onClick={() => onChange({ target: { name: 'color', value: '#ff0000' } })}
      >
        Color Picker - {character.color}
      </button>
    </div>
  )
}))

jest.mock('../../../components/characters/edit/CharacterType', () => ({
  __esModule: true,
  default: ({ value, onChange }: any) => (
    <select 
      data-testid="character-type-select"
      value={value}
      onChange={onChange}
      name="Type"
    >
      <option value="">Select Type</option>
      <option value="PC">PC</option>
      <option value="Boss">Boss</option>
      <option value="Mook">Mook</option>
    </select>
  )
}))

jest.mock('../../../components/characters/edit/FortuneSelect', () => ({
  __esModule: true,
  default: ({ character, onChange }: any) => (
    <select 
      data-testid="fortune-select"
      value={character.action_values?.FortuneType || ''}
      onChange={onChange}
      name="FortuneType"
    >
      <option value="">Select Fortune</option>
      <option value="Fortune">Fortune</option>
      <option value="Chi">Chi</option>
      <option value="Magic">Magic</option>
    </select>
  )
}))

jest.mock('../../../components/characters/edit/EditActionValues', () => ({
  __esModule: true,
  default: ({ character, onChange }: any) => (
    <div data-testid="edit-action-values">
      <input
        data-testid="martial-arts-input"
        name="Martial Arts"
        value={character.action_values?.['Martial Arts'] || ''}
        onChange={onChange}
        placeholder="Martial Arts"
      />
      <input
        data-testid="guns-input"
        name="Guns"
        value={character.action_values?.Guns || ''}
        onChange={onChange}
        placeholder="Guns"
      />
    </div>
  )
}))

jest.mock('../../../components/characters/DeathMarks', () => ({
  __esModule: true,
  default: ({ character, onChange }: any) => (
    <div data-testid="death-marks">
      <button 
        data-testid="death-marks-button"
        onClick={() => onChange({}, 2)}
      >
        Death Marks: {character.action_values?.DeathMarks || 0}
      </button>
    </div>
  )
}))

jest.mock('../../../components/PlayerTypeOnly', () => ({
  __esModule: true,
  default: ({ character, only, except, children }: any) => {
    const shouldShow = () => {
      if (only) {
        if (Array.isArray(only)) {
          return only.includes(character.action_values?.Type)
        }
        return character.action_values?.Type === only
      }
      if (except) {
        if (Array.isArray(except)) {
          return !except.includes(character.action_values?.Type)
        }
        return character.action_values?.Type !== except
      }
      return true
    }

    if (shouldShow()) {
      return <div data-testid={`player-type-${only || 'not-' + except}`}>{children}</div>
    }
    return null
  }
}))

jest.mock('../../../components/StyledFields', () => ({
  StyledTextField: ({ name, label, value, onChange, type, ...props }: any) => {
    const inputId = `input-${name}-${Math.random().toString(36).substr(2, 9)}`
    return (
      <div data-testid={`styled-text-field-${name.toLowerCase().replace(/\s+/g, '-')}`}>
        <label htmlFor={inputId}>{label}</label>
        <input
          id={inputId}
          name={name}
          value={value || ''}
          onChange={onChange}
          type={type || 'text'}
          disabled={props.disabled}
        />
      </div>
    )
  },
  StyledDialog: ({ open, onClose, title, children, onSubmit, disabled }: any) => (
    open ? (
      <div data-testid="styled-dialog" role="dialog">
        <div data-testid="dialog-title">{title}</div>
        <form onSubmit={onSubmit}>
          {children}
        </form>
        <button data-testid="dialog-close" onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
  SaveCancelButtons: ({ disabled, onCancel }: any) => (
    <div data-testid="save-cancel-buttons">
      <button data-testid="save-button" type="submit" disabled={disabled}>Save</button>
      <button data-testid="cancel-button" onClick={onCancel} disabled={disabled}>Cancel</button>
    </div>
  )
}))

describe('CharacterModal', () => {
  const mockUseForm = require('../../../reducers/formState').useForm as jest.MockedFunction<any>

  const theme = createTheme()

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    )
  }

  const createTestCharacter = (type: string = 'PC'): Character => ({
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Character',
    action_values: {
      ...defaultCharacter.action_values,
      Type: type as any,
      'Martial Arts': 15,
      Guns: 13
    }
  })

  const createFormState = (overrides: any = {}) => ({
    open: true,
    saving: false,
    disabled: false,
    formData: { character: createTestCharacter() },
    ...overrides
  })

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockUseForm.mockReturnValue({
      formState: createFormState(),
      dispatchForm: mockDispatchForm,
      initialFormState: { character: defaultCharacter }
    })

    mockClient.createCharacter.mockResolvedValue(createTestCharacter())
    mockClient.updateCharacter.mockResolvedValue(createTestCharacter())
    mockClient.touchFight.mockResolvedValue({})

    // Default CharacterService mocks
    mockCharacterService.isType.mockReturnValue(false)
    mockCharacterService.isPC.mockReturnValue(true)
    mockCharacterService.type.mockReturnValue(CharacterTypes.PC)
    mockCharacterService.archetype.mockReturnValue('Ex Special Forces')
    mockCharacterService.updateWounds.mockImplementation((char, wounds) => ({ ...char, action_values: { ...char.action_values, Wounds: wounds } }))
    mockCharacterService.updateActionValue.mockImplementation((char, name, value) => ({ ...char, action_values: { ...char.action_values, [name]: value } }))
    mockCharacterService.setDeathMarks.mockImplementation((char, marks) => ({ ...char, action_values: { ...char.action_values, DeathMarks: marks } }))
    mockCharacterService.fullHeal.mockImplementation((char) => ({ ...char, action_values: { ...char.action_values, Wounds: 0 } }))
  })

  describe('basic rendering', () => {
    it('should render dialog when open', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      expect(screen.getByTestId('styled-dialog')).toBeInTheDocument()
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Test Character')
    })

    it('should not render dialog when closed', () => {
      mockUseForm.mockReturnValue({
        formState: createFormState({ open: false }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      expect(screen.queryByTestId('styled-dialog')).not.toBeInTheDocument()
    })

    it('should show create title for new character', () => {
      const newCharacter = { ...createTestCharacter(), id: '' }
      mockUseForm.mockReturnValue({
        formState: createFormState({ formData: { character: newCharacter } }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      renderWithTheme(<CharacterModal character={newCharacter} />)

      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Create Character')
    })

    it('should render all form fields', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      expect(screen.getByTestId('character-type-select')).toBeInTheDocument()
      expect(screen.getByTestId('styled-text-field-name')).toBeInTheDocument()
      expect(screen.getByTestId('styled-text-field-impairments')).toBeInTheDocument()
      expect(screen.getByTestId('edit-action-values')).toBeInTheDocument()
      expect(screen.getByTestId('save-cancel-buttons')).toBeInTheDocument()
    })
  })

  describe('character type handling', () => {
    it('should show archetype field for PC characters', () => {
      mockCharacterService.isPC.mockReturnValue(true)
      
      renderWithTheme(<CharacterModal character={createTestCharacter('PC')} />)

      expect(screen.getByTestId('styled-text-field-archetype')).toBeInTheDocument()
    })

    it('should hide archetype field for non-PC characters', () => {
      mockCharacterService.isPC.mockReturnValue(false)
      
      renderWithTheme(<CharacterModal character={createTestCharacter('Boss')} />)

      expect(screen.queryByTestId('styled-text-field-archetype')).not.toBeInTheDocument()
    })

    it('should show wounds field for non-mook characters', () => {
      mockCharacterService.isType.mockImplementation((char, type) => type !== 'Mook')
      
      renderWithTheme(<CharacterModal character={createTestCharacter('PC')} />)

      expect(screen.getByLabelText('Wounds')).toBeInTheDocument()
    })

    it('should show count field for mook characters', () => {
      mockCharacterService.isType.mockImplementation((char, type) => type === 'Mook')
      
      renderWithTheme(<CharacterModal character={createTestCharacter('Mook')} />)

      expect(screen.getByLabelText('Mooks')).toBeInTheDocument()
    })

    it('should show death marks for PC characters only', () => {
      mockUseForm.mockReturnValue({
        formState: createFormState({ formData: { character: createTestCharacter('PC') } }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      renderWithTheme(<CharacterModal character={createTestCharacter('PC')} />)

      expect(screen.getAllByTestId('player-type-PC').length).toBeGreaterThan(0)
      expect(screen.getByTestId('death-marks')).toBeInTheDocument()
    })

    it('should show fortune select for PC characters only', () => {
      mockUseForm.mockReturnValue({
        formState: createFormState({ formData: { character: createTestCharacter('PC') } }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      renderWithTheme(<CharacterModal character={createTestCharacter('PC')} />)

      expect(screen.getByTestId('fortune-select')).toBeInTheDocument()
    })
  })

  describe('fight context integration', () => {
    it('should show shot field when in fight', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      expect(screen.getByTestId('styled-text-field-current_shot')).toBeInTheDocument()
    })

    it('should hide shot field when not in fight', () => {
      const originalFight = mockUseFight.fight
      mockUseFight.fight = { ...mockFight, id: null }

      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      expect(screen.queryByTestId('styled-text-field-current_shot')).not.toBeInTheDocument()
      
      // Restore original fight
      mockUseFight.fight = originalFight
    })

    it('should show full heal button for non-mook characters', () => {
      mockCharacterService.isType.mockImplementation((char, type) => type !== 'Mook')

      renderWithTheme(<CharacterModal character={createTestCharacter('PC')} />)

      const healButton = screen.getByRole('button', { name: /full heal/i })
      expect(healButton).toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    it('should handle name field changes', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const nameField = screen.getByTestId('styled-text-field-name').querySelector('input')!
      fireEvent.change(nameField, { target: { name: 'name', value: 'New Name' } })

      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.UPDATE,
        name: 'character',
        value: expect.objectContaining({ name: 'New Name' })
      })
    })

    it('should handle character type changes', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const typeSelect = screen.getByTestId('character-type-select')
      fireEvent.change(typeSelect, { target: { name: 'Type', value: 'Boss' } })

      expect(mockCharacterService.updateActionValue).toHaveBeenCalledWith(
        expect.any(Object),
        'Type',
        'Boss'
      )
    })

    it('should handle task checkbox changes', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const taskCheckbox = screen.getByRole('checkbox', { name: /task/i })
      fireEvent.click(taskCheckbox)

      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.UPDATE,
        name: 'character',
        value: expect.objectContaining({ task: true })
      })
    })

    it('should handle wounds field changes', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const woundsField = screen.getByLabelText('Wounds')
      fireEvent.change(woundsField, { target: { value: '5' } })

      expect(mockCharacterService.updateWounds).toHaveBeenCalledWith(expect.any(Object), 5)
    })

    it('should handle impairments field changes', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const impairmentsField = screen.getByTestId('styled-text-field-impairments').querySelector('input')!
      fireEvent.change(impairmentsField, { target: { name: 'impairments', value: '3' } })

      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.UPDATE,
        name: 'character',
        value: expect.objectContaining({ impairments: '3' })
      })
    })

    it('should handle death marks changes', () => {
      mockUseForm.mockReturnValue({
        formState: createFormState({ formData: { character: createTestCharacter('PC') } }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      renderWithTheme(<CharacterModal character={createTestCharacter('PC')} />)

      const deathMarksButton = screen.getByTestId('death-marks-button')
      fireEvent.click(deathMarksButton)

      expect(mockCharacterService.setDeathMarks).toHaveBeenCalledWith(expect.any(Object), 2)
    })

    it('should handle action value changes', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const martialArtsInput = screen.getByTestId('martial-arts-input')
      fireEvent.change(martialArtsInput, { target: { name: 'Martial Arts', value: '18' } })

      expect(mockCharacterService.updateActionValue).toHaveBeenCalledWith(
        expect.any(Object),
        'Martial Arts',
        '18'
      )
    })

    it('should handle full heal button', () => {
      mockCharacterService.isType.mockImplementation((char, type) => type !== 'Mook')
      
      renderWithTheme(<CharacterModal character={createTestCharacter('PC')} />)

      const healButton = screen.getByRole('button', { name: /full heal/i })
      fireEvent.click(healButton)

      expect(mockCharacterService.fullHeal).toHaveBeenCalledWith(expect.any(Object))
      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.UPDATE,
        name: 'character',
        value: expect.any(Object)
      })
    })
  })

  describe('form submission', () => {
    it('should create new character when no ID present', async () => {
      const newCharacter = { ...createTestCharacter(), id: '' }
      mockUseForm.mockReturnValue({
        formState: createFormState({ formData: { character: newCharacter } }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      renderWithTheme(<CharacterModal character={newCharacter} />)

      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)

      expect(mockDispatchForm).toHaveBeenCalledWith({ type: FormActions.SUBMIT })
      
      await waitFor(() => {
        expect(mockClient.createCharacter).toHaveBeenCalledWith(newCharacter, mockFight)
      })

      expect(mockToastSuccess).toHaveBeenCalledWith('Test Character created.')
    })

    it('should update existing character when ID present', async () => {
      const existingCharacter = createTestCharacter()
      
      renderWithTheme(<CharacterModal character={existingCharacter} />)

      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockClient.updateCharacter).toHaveBeenCalledWith(existingCharacter, mockFight)
      })

      expect(mockToastSuccess).toHaveBeenCalledWith('Test Character updated.')
    })

    it('should handle fight context updates after save', async () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockClient.touchFight).toHaveBeenCalledWith(mockFight)
      })

      expect(mockDispatchFight).toHaveBeenCalledWith({ type: FightActions.EDIT })
    })

    it('should call reload when not in fight', async () => {
      const originalFight = mockUseFight.fight
      mockUseFight.fight = { ...mockFight, id: null }

      renderWithTheme(<CharacterModal character={createTestCharacter()} reload={mockReload} />)

      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockReload).toHaveBeenCalled()
      })
      
      // Restore original fight
      mockUseFight.fight = originalFight
    })

    it('should navigate to character page for new character outside fight', async () => {
      const newCharacter = { ...createTestCharacter(), id: '' }
      mockUseForm.mockReturnValue({
        formState: createFormState({ formData: { character: newCharacter } }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      const originalFight = mockUseFight.fight
      mockUseFight.fight = { ...mockFight, id: null }

      renderWithTheme(<CharacterModal character={newCharacter} />)

      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/characters/character-123')
      })
      
      // Restore original fight
      mockUseFight.fight = originalFight
    })

    it('should handle submission errors', async () => {
      mockClient.updateCharacter.mockRejectedValue(new Error('Update failed'))

      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalled()
      })

      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.RESET,
        payload: expect.any(Object)
      })
    })
  })

  describe('form cancellation', () => {
    it('should reset form on cancel', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const cancelButton = screen.getByTestId('cancel-button')
      fireEvent.click(cancelButton)

      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.RESET,
        payload: expect.any(Object)
      })
    })

    it('should reset form on dialog close', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const closeButton = screen.getByTestId('dialog-close')
      fireEvent.click(closeButton)

      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.RESET,
        payload: expect.any(Object)
      })
    })
  })

  describe('component lifecycle', () => {
    it('should open modal and update character when activeCharacter has ID', () => {
      const character = createTestCharacter()
      
      renderWithTheme(<CharacterModal character={character} />)

      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.UPDATE,
        name: 'character',
        value: character
      })

      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.OPEN,
        payload: true
      })
    })

    it('should open modal for new character marked with new flag', () => {
      const newCharacter = { ...createTestCharacter(), id: '', new: true }
      
      renderWithTheme(<CharacterModal character={newCharacter} />)

      expect(mockDispatchForm).toHaveBeenCalledWith({
        type: FormActions.UPDATE,
        name: 'character',
        value: newCharacter
      })
    })

    it('should handle null character prop', () => {
      renderWithTheme(<CharacterModal character={null} />)

      // Should render with default character
      expect(screen.getByTestId('styled-dialog')).toBeInTheDocument()
    })
  })

  describe('disabled states', () => {
    it('should disable form elements when saving', () => {
      mockUseForm.mockReturnValue({
        formState: createFormState({ saving: true }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const saveButton = screen.getByTestId('save-button')
      const cancelButton = screen.getByTestId('cancel-button')

      expect(saveButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
    })
  })

  describe('label and icon logic', () => {
    it('should show correct wounds label for mook characters', () => {
      mockCharacterService.isType.mockImplementation((char, type) => type === 'Mook')
      
      renderWithTheme(<CharacterModal character={createTestCharacter('Mook')} />)

      // The label logic is internal to the component
      // We verify the mook section is rendered
      expect(screen.getByLabelText('Mooks')).toBeInTheDocument()
    })

    it('should show correct wounds label for non-mook characters', () => {
      mockCharacterService.isType.mockImplementation((char, type) => type !== 'Mook')
      
      renderWithTheme(<CharacterModal character={createTestCharacter('PC')} />)

      // The label logic is internal to the component
      // We verify the non-mook section is rendered
      expect(screen.getByLabelText('Wounds')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible form elements', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByTestId('styled-text-field-name')).toBeInTheDocument()
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should have proper dialog structure', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      
      const title = screen.getByTestId('dialog-title')
      expect(title).toHaveTextContent('Test Character')
    })
  })

  describe('edge cases', () => {
    it('should handle missing character properties', () => {
      const minimalCharacter = {
        ...defaultCharacter,
        name: 'Minimal',
        action_values: {}
      }

      mockUseForm.mockReturnValue({
        formState: createFormState({ formData: { character: minimalCharacter } }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      renderWithTheme(<CharacterModal character={minimalCharacter} />)

      expect(screen.getByTestId('styled-dialog')).toBeInTheDocument()
    })

    it('should handle empty current_shot value', () => {
      const charWithNullShot = { ...createTestCharacter(), current_shot: undefined }

      mockUseForm.mockReturnValue({
        formState: createFormState({ formData: { character: charWithNullShot } }),
        dispatchForm: mockDispatchForm,
        initialFormState: { character: defaultCharacter }
      })

      renderWithTheme(<CharacterModal character={charWithNullShot} />)

      expect(screen.getByTestId('styled-text-field-current_shot')).toBeInTheDocument()
    })

    it('should handle wounds field with zero value', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const woundsField = screen.getByLabelText('Wounds')
      fireEvent.change(woundsField, { target: { value: '0' } })

      expect(mockCharacterService.updateWounds).toHaveBeenCalledWith(expect.any(Object), 0)
    })

    it('should handle invalid wounds field input', () => {
      renderWithTheme(<CharacterModal character={createTestCharacter()} />)

      const woundsField = screen.getByLabelText('Wounds')
      fireEvent.change(woundsField, { target: { value: 'invalid' } })

      // Invalid input should not trigger updateWounds call
      expect(mockCharacterService.updateWounds).not.toHaveBeenCalled()
    })
  })
})