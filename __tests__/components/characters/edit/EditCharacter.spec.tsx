import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/components/StyledFields'
import EditCharacter from '@/components/characters/edit/EditCharacter'
import { createMockCharacter } from '../../../factories/character'

// Mock contexts
const mockUpdateCharacter = jest.fn().mockResolvedValue({})
const mockDispatchCharacter = jest.fn()

const mockCharacterState = {
  character: createMockCharacter({
    name: 'Test Character',
    task: false,
    active: true,
    faction: 'Lotus',
    juncture: 'Contemporary',
    wealth: 5,
    color: '#ff0000',
    action_values: {
      Type: 'PC',
      Archetype: 'Big Bruiser',
      Bod: 10,
      Chi: 5,
      Mnd: 8,
      Ref: 9
    },
    weapons: [],
    schticks: [],
    skills: {},
    description: {}
  }),
  edited: false,
  saving: false
}

const mockUseCharacter = {
  state: mockCharacterState,
  dispatch: mockDispatchCharacter,
  updateCharacter: mockUpdateCharacter
}

const mockClient = {
  deleteCharacterImage: jest.fn().mockResolvedValue({})
}

const mockToast = {
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
  closeToast: jest.fn(),
  toastInfo: jest.fn(),
  toastWarning: jest.fn()
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

// Mock services
jest.mock('@/services/CharacterService', () => ({
  archetype: jest.fn((char) => char.action_values?.Archetype || ''),
  notionLink: jest.fn(() => 'https://notion.so/character-link'),
  marksOfDeath: jest.fn(() => 0)
}))

// Mock child components
jest.mock('@/components/characters/edit/ColorPicker', () => {
  return function MockColorPicker({ character, onChange, dispatch }: any) {
    return (
      <div data-testid="color-picker">
        <button onClick={() => onChange({ target: { name: 'color', value: '#00ff00' } })}>
          Change Color
        </button>
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/EditActionValues', () => {
  return function MockEditActionValues({ character, onChange }: any) {
    return (
      <div data-testid="edit-action-values">
        <input
          data-testid="action-value-input"
          onChange={(e) => onChange(e, e.target.value)}
          name="Bod"
          placeholder="Body"
        />
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/CharacterType', () => {
  return function MockCharacterType({ value, onChange }: any) {
    return (
      <div data-testid="character-type">
        <select
          value={value}
          onChange={(e) => onChange(e, e.target.value)}
          name="Type"
          data-testid="character-type-select"
        >
          <option value="PC">PC</option>
          <option value="Boss">Boss</option>
          <option value="Mook">Mook</option>
        </select>
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/FortuneSelect', () => {
  return function MockFortuneSelect({ character, onChange, readOnly }: any) {
    return (
      <div data-testid="fortune-select">
        <input
          data-testid="fortune-input"
          onChange={onChange}
          name="Fortune"
          disabled={readOnly}
        />
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/Faction', () => {
  return function MockFaction({ faction, onChange }: any) {
    return (
      <div data-testid="faction-component">
        <input
          data-testid="faction-input"
          value={faction}
          onChange={onChange}
          name="faction"
        />
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/Juncture', () => {
  return function MockJuncture({ juncture, onChange }: any) {
    return (
      <div data-testid="juncture-component">
        <input
          data-testid="juncture-input"
          value={juncture}
          onChange={onChange}
          name="juncture"
        />
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/Archetype', () => {
  return function MockArchetype({ archetype, onChange }: any) {
    return (
      <div data-testid="archetype-component">
        <input
          data-testid="archetype-input"
          value={archetype}
          onChange={onChange}
          name="Archetype"
        />
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/Wealth', () => {
  return function MockWealth({ wealth, onChange }: any) {
    return (
      <div data-testid="wealth-component">
        <input
          data-testid="wealth-input"
          type="number"
          value={wealth}
          onChange={onChange}
          name="wealth"
        />
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/Skills', () => {
  return function MockSkills({ character, onChange }: any) {
    return (
      <div data-testid="skills-component">
        <input
          data-testid="skills-input"
          onChange={onChange}
          name="skills"
        />
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/EditWeapons', () => {
  return function MockEditWeapons() {
    return <div data-testid="edit-weapons">Edit Weapons Component</div>
  }
})

jest.mock('@/components/characters/edit/Description', () => {
  return function MockDescription({ character, onChange }: any) {
    return (
      <div data-testid="description-component">
        <textarea
          data-testid="description-input"
          onChange={onChange}
          name="description"
        />
      </div>
    )
  }
})

jest.mock('@/components/characters/edit/EditSchticks', () => {
  return function MockEditSchticks() {
    return <div data-testid="edit-schticks">Edit Schticks Component</div>
  }
})

jest.mock('@/components/characters/edit/sites/Sites', () => {
  return function MockSites({ character }: any) {
    return <div data-testid="sites-component">Sites Component</div>
  }
})

jest.mock('@/components/characters/edit/CharacterMenu', () => {
  return function MockCharacterMenu() {
    return (
      <div data-testid="character-menu">
        <button>Menu Action</button>
      </div>
    )
  }
})

jest.mock('@/components/images/ImageManager', () => {
  return function MockImageManager({ name, entity, updateEntity, deleteImage, apiEndpoint }: any) {
    return (
      <div data-testid="image-manager">
        <button onClick={() => deleteImage(entity)}>Delete Image</button>
      </div>
    )
  }
})

jest.mock('@/components/advancements/Advancements', () => {
  return function MockAdvancements({ character }: any) {
    return <div data-testid="advancements-component">Advancements Component</div>
  }
})

jest.mock('@/components/PlayerTypeOnly', () => {
  return function MockPlayerTypeOnly({ character, only, except, children }: any) {
    // Simple mock that shows content if no restrictions or matches criteria
    if (!only && !except) return <div data-testid="player-type-only">{children}</div>
    
    const characterType = character?.action_values?.Type || 'PC'
    
    if (only && characterType === only) {
      return <div data-testid="player-type-only">{children}</div>
    }
    
    if (except && characterType !== except) {
      return <div data-testid="player-type-only">{children}</div>
    }
    
    return null
  }
})

jest.mock('@/components/characters/DeathMarks', () => {
  return function MockDeathMarks({ character, onChange }: any) {
    return (
      <div data-testid="death-marks">
        <button onClick={() => onChange({}, 3)}>Set Death Marks</button>
      </div>
    )
  }
})

jest.mock('@/components/UserAvatar', () => {
  return function MockUserAvatar({ user }: any) {
    return (
      <div data-testid="user-avatar">
        {user?.first_name} {user?.last_name}
      </div>
    )
  }
})

jest.mock('@/components/GamemasterOnly', () => {
  return function MockGamemasterOnly({ user, children }: any) {
    return user?.gamemaster ? <div data-testid="gm-only">{children}</div> : null
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
          data-testid={`styled-input-${props.name}`}
        />
      </div>
    )
  },
  Subhead: function MockSubhead({ children }: any) {
    return <h3 data-testid="subhead">{children}</h3>
  }
}))

// Mock reducers
jest.mock('@/reducers/characterState', () => ({
  CharacterActions: {
    UPDATE: 'UPDATE',
    ACTION_VALUE: 'ACTION_VALUE',
    SKILLS: 'SKILLS',
    DESCRIPTION: 'DESCRIPTION'
  }
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('EditCharacter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseCharacter.state = { ...mockCharacterState }
  })

  describe('basic rendering', () => {
    test('renders character name input', () => {
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Character')).toBeInTheDocument()
    })

    test('renders task and active switches', () => {
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByLabelText('Task')).toBeInTheDocument()
      expect(screen.getByLabelText('Active')).toBeInTheDocument()
    })

    test('renders all major component sections', () => {
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByTestId('faction-component')).toBeInTheDocument()
      expect(screen.getByTestId('character-type')).toBeInTheDocument()
      expect(screen.getByTestId('archetype-component')).toBeInTheDocument()
      expect(screen.getByTestId('juncture-component')).toBeInTheDocument()
      expect(screen.getByTestId('wealth-component')).toBeInTheDocument()
      expect(screen.getByTestId('color-picker')).toBeInTheDocument()
      expect(screen.getByTestId('edit-action-values')).toBeInTheDocument()
      expect(screen.getByTestId('skills-component')).toBeInTheDocument()
      expect(screen.getByTestId('edit-weapons')).toBeInTheDocument()
      expect(screen.getByTestId('description-component')).toBeInTheDocument()
      expect(screen.getByTestId('edit-schticks')).toBeInTheDocument()
    })

    test('shows saving indicator when saving', () => {
      mockUseCharacter.state.saving = true
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByText('Saving...')).toBeInTheDocument()
    })

    test('does not show saving indicator when not saving', () => {
      mockUseCharacter.state.saving = false
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
    })
  })

  describe('character information display', () => {
    test('displays user information when character has user and not edited', () => {
      mockUseCharacter.state.character.user = {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com'
      }
      mockUseCharacter.state.edited = false
      mockUseCharacter.state.saving = false
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByTestId('user-avatar')).toBeInTheDocument()
    })

    test('hides user information when character is edited', () => {
      mockUseCharacter.state.character.user = {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe'
      }
      mockUseCharacter.state.edited = true
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument()
    })

    test('hides user information when saving', () => {
      mockUseCharacter.state.character.user = {
        id: 'user-1',
        first_name: 'John',
        last_name: 'Doe'
      }
      mockUseCharacter.state.saving = true
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument()
    })
  })

  describe('form interactions', () => {
    test('handles character name change', () => {
      renderWithTheme(<EditCharacter />)
      
      const nameInput = screen.getByLabelText('Name')
      fireEvent.change(nameInput, { target: { name: 'name', value: 'New Name' } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'name',
        value: 'New Name'
      })
    })

    test('handles task switch toggle', () => {
      renderWithTheme(<EditCharacter />)
      
      const taskSwitch = screen.getByLabelText('Task')
      fireEvent.change(taskSwitch, { target: { name: 'task', checked: true } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'task',
        value: true
      })
    })

    test('handles active switch toggle', () => {
      renderWithTheme(<EditCharacter />)
      
      const activeSwitch = screen.getByLabelText('Active')
      fireEvent.change(activeSwitch, { target: { name: 'active', checked: false } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'active',
        value: false
      })
    })

    test('handles action value changes', () => {
      renderWithTheme(<EditCharacter />)
      
      const actionValueInput = screen.getByTestId('action-value-input')
      fireEvent.change(actionValueInput, { target: { name: 'Bod', value: '12' } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'ACTION_VALUE',
        name: 'Bod',
        value: '12'
      })
    })

    test('handles skills changes', () => {
      renderWithTheme(<EditCharacter />)
      
      const skillsInput = screen.getByTestId('skills-input')
      fireEvent.change(skillsInput, { target: { name: 'skills', value: 'test skill' } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'SKILLS',
        name: 'skills',
        value: 'test skill'
      })
    })

    test('handles description changes', () => {
      renderWithTheme(<EditCharacter />)
      
      const descriptionInput = screen.getByTestId('description-input')
      fireEvent.change(descriptionInput, { target: { name: 'description', value: 'test description' } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'DESCRIPTION',
        name: 'description',
        value: 'test description'
      })
    })
  })

  describe('specialized handlers', () => {
    test('handles faction changes with new value', () => {
      renderWithTheme(<EditCharacter />)
      
      const factionInput = screen.getByTestId('faction-input')
      fireEvent.change(factionInput, { target: { name: 'faction', value: 'Dragons' } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'faction',
        value: 'Dragons'
      })
    })

    test('handles juncture changes with new value', () => {
      renderWithTheme(<EditCharacter />)
      
      const junctureInput = screen.getByTestId('juncture-input')
      fireEvent.change(junctureInput, { target: { name: 'juncture', value: '1850s' } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'juncture',
        value: '1850s'
      })
    })

    test('handles wealth changes', () => {
      renderWithTheme(<EditCharacter />)
      
      const wealthInput = screen.getByTestId('wealth-input')
      fireEvent.change(wealthInput, { target: { name: 'wealth', value: '10' } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'wealth',
        value: '10'
      })
    })

    test('handles death marks changes', () => {
      renderWithTheme(<EditCharacter />)
      
      const setDeathMarksButton = screen.getByText('Set Death Marks')
      fireEvent.click(setDeathMarksButton)
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'ACTION_VALUE',
        name: 'Marks of Death',
        value: 3
      })
    })

    test('handles death marks toggle when already at max', () => {
      const mockMarksOfDeath = require('@/services/CharacterService').marksOfDeath
      mockMarksOfDeath.mockReturnValue(3) // Character already has 3 marks
      
      renderWithTheme(<EditCharacter />)
      
      const setDeathMarksButton = screen.getByText('Set Death Marks')
      fireEvent.click(setDeathMarksButton)
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'ACTION_VALUE',
        name: 'Marks of Death',
        value: 0
      })
    })
  })

  describe('form submission', () => {
    test('handles form submission', async () => {
      renderWithTheme(<EditCharacter />)
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockUpdateCharacter).toHaveBeenCalled()
      })
    })

    test('prevents default form submission', () => {
      renderWithTheme(<EditCharacter />)
      
      const form = screen.getByRole('form')
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault')
      
      fireEvent(form, submitEvent)
      
      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('conditional rendering for character types', () => {
    test('shows PC-specific components for PC characters', () => {
      mockUseCharacter.state.character.action_values.Type = 'PC'
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByTestId('fortune-select')).toBeInTheDocument()
      expect(screen.getByTestId('advancements-component')).toBeInTheDocument()
      expect(screen.getByTestId('death-marks')).toBeInTheDocument()
    })

    test('hides PC-specific components for non-PC characters', () => {
      mockUseCharacter.state.character.action_values.Type = 'Boss'
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.queryByTestId('fortune-select')).not.toBeInTheDocument()
      expect(screen.queryByTestId('advancements-component')).not.toBeInTheDocument()
      expect(screen.queryByTestId('death-marks')).not.toBeInTheDocument()
    })
  })

  describe('image management', () => {
    test('shows image manager when character has ID', () => {
      mockUseCharacter.state.character.id = 'char-123'
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByTestId('image-manager')).toBeInTheDocument()
    })

    test('handles image deletion', async () => {
      mockUseCharacter.state.character.id = 'char-123'
      
      renderWithTheme(<EditCharacter />)
      
      const deleteButton = screen.getByText('Delete Image')
      fireEvent.click(deleteButton)
      
      await waitFor(() => {
        expect(mockClient.deleteCharacterImage).toHaveBeenCalledWith(
          mockUseCharacter.state.character
        )
      })
    })
  })

  describe('component integration', () => {
    test('passes correct props to CharacterType component', () => {
      renderWithTheme(<EditCharacter />)
      
      const characterTypeSelect = screen.getByTestId('character-type-select')
      expect(characterTypeSelect).toHaveValue('PC')
      
      fireEvent.change(characterTypeSelect, { target: { value: 'Boss' } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'ACTION_VALUE',
        name: 'Type',
        value: 'Boss'
      })
    })

    test('passes correct props to FortuneSelect component', () => {
      renderWithTheme(<EditCharacter />)
      
      const fortuneInput = screen.getByTestId('fortune-input')
      fireEvent.change(fortuneInput, { target: { name: 'Fortune', value: '5' } })
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'ACTION_VALUE',
        name: 'Fortune',
        value: '5'
      })
    })

    test('passes correct props to ColorPicker component', () => {
      renderWithTheme(<EditCharacter />)
      
      const colorButton = screen.getByText('Change Color')
      fireEvent.click(colorButton)
      
      expect(mockDispatchCharacter).toHaveBeenCalledWith({
        type: 'UPDATE',
        name: 'color',
        value: '#00ff00'
      })
    })
  })

  describe('service integration', () => {
    test('calls CharacterService.archetype', () => {
      const mockArchetype = require('@/services/CharacterService').archetype
      
      renderWithTheme(<EditCharacter />)
      
      expect(mockArchetype).toHaveBeenCalledWith(mockUseCharacter.state.character)
    })

    test('calls CharacterService.notionLink', () => {
      const mockNotionLink = require('@/services/CharacterService').notionLink
      
      renderWithTheme(<EditCharacter />)
      
      expect(mockNotionLink).toHaveBeenCalledWith(mockUseCharacter.state.character)
    })

    test('calls CharacterService.marksOfDeath for death marks handler', () => {
      const mockMarksOfDeath = require('@/services/CharacterService').marksOfDeath
      
      renderWithTheme(<EditCharacter />)
      
      const setDeathMarksButton = screen.getByText('Set Death Marks')
      fireEvent.click(setDeathMarksButton)
      
      expect(mockMarksOfDeath).toHaveBeenCalledWith(mockUseCharacter.state.character)
    })
  })

  describe('accessibility', () => {
    test('has accessible form structure', () => {
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByRole('form')).toBeInTheDocument()
    })

    test('has accessible input labels', () => {
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Task')).toBeInTheDocument()
      expect(screen.getByLabelText('Active')).toBeInTheDocument()
    })

    test('has required field indicators', () => {
      renderWithTheme(<EditCharacter />)
      
      const nameInput = screen.getByTestId('styled-input-name')
      expect(nameInput).toHaveAttribute('required')
    })

    test('has autofocus on name field', () => {
      renderWithTheme(<EditCharacter />)
      
      const nameInput = screen.getByTestId('styled-input-name')
      expect(nameInput).toHaveAttribute('autofocus')
    })
  })

  describe('edge cases', () => {
    test('handles character without user', () => {
      mockUseCharacter.state.character.user = undefined
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument()
    })

    test('handles character without action values', () => {
      mockUseCharacter.state.character.action_values = {}
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.getByTestId('character-type')).toBeInTheDocument()
    })

    test('handles character without ID for image manager', () => {
      mockUseCharacter.state.character.id = undefined
      
      renderWithTheme(<EditCharacter />)
      
      expect(screen.queryByTestId('image-manager')).not.toBeInTheDocument()
    })

    test('handles null death marks value', () => {
      renderWithTheme(<EditCharacter />)
      
      const setDeathMarksButton = screen.getByText('Set Death Marks')
      
      // Simulate event with null value
      fireEvent.click(setDeathMarksButton)
      
      expect(mockDispatchCharacter).toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    test('handles updateCharacter errors', async () => {
      mockUpdateCharacter.mockRejectedValue(new Error('Update failed'))
      
      renderWithTheme(<EditCharacter />)
      
      const form = screen.getByRole('form')
      fireEvent.submit(form)
      
      await waitFor(() => {
        expect(mockUpdateCharacter).toHaveBeenCalled()
      })
    })

    test('handles deleteCharacterImage errors', async () => {
      mockClient.deleteCharacterImage.mockRejectedValue(new Error('Delete failed'))
      mockUseCharacter.state.character.id = 'char-123'
      
      renderWithTheme(<EditCharacter />)
      
      const deleteButton = screen.getByText('Delete Image')
      fireEvent.click(deleteButton)
      
      await waitFor(() => {
        expect(mockClient.deleteCharacterImage).toHaveBeenCalled()
      })
    })
  })
})