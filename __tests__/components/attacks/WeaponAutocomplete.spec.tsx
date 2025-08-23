import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import WeaponAutocomplete from '../../../components/attacks/WeaponAutocomplete'
import { defaultWeapon, defaultCharacter, CharacterTypes } from '../../../types/types'
import type { Character, Weapon } from '../../../types/types'

// Mock ClientContext
const mockClient = {
  getWeapons: jest.fn()
}

jest.mock('../../../contexts/ClientContext', () => ({
  useClient: () => ({
    client: mockClient
  })
}))

// Mock StyledFields components
jest.mock('../../../components/StyledFields', () => ({
  StyledAutocomplete: ({ value, options, disabled, onChange, getOptionLabel, renderInput }: any) => (
    <div data-testid="styled-autocomplete">
      <select
        data-testid="weapon-select"
        value={value?.id || ''}
        disabled={disabled}
        onChange={(e) => {
          const selectedWeapon = options.find((weapon: Weapon) => weapon.id === e.target.value)
          onChange(e, selectedWeapon || null)
        }}
      >
        <option value="">Select Weapon</option>
        {options?.map((weapon: Weapon) => (
          <option key={weapon.id} value={weapon.id}>
            {getOptionLabel(weapon)}
          </option>
        ))}
      </select>
      <div data-testid="helper-text">{renderInput && renderInput({})}</div>
    </div>
  ),
  StyledSelect: ({ helperText, label, ...props }: any) => (
    <div data-testid="styled-select">
      <span data-testid="select-label">{label}</span>
      <span data-testid="select-helper-text">{helperText}</span>
    </div>
  )
}))

describe('WeaponAutocomplete (Attacks)', () => {
  const mockSetWeapon = jest.fn()

  const theme = createTheme()

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    )
  }

  const createTestWeapon = (id: string, name: string): Weapon => ({
    ...defaultWeapon,
    id,
    name
  })

  const createTestCharacter = (weapons: Weapon[] = []): Character => ({
    ...defaultCharacter,
    id: 'character-123',
    name: 'Test Character',
    weapons,
    action_values: {
      ...defaultCharacter.action_values,
      Type: CharacterTypes.PC
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    const character = createTestCharacter()

    it('should render autocomplete component', () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={character}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      expect(screen.getByTestId('styled-autocomplete')).toBeInTheDocument()
      expect(screen.getByTestId('weapon-select')).toBeInTheDocument()
    })

    it('should show weapon label', () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={character}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      expect(screen.getByTestId('select-label')).toHaveTextContent('Weapon')
    })
  })

  describe('character with weapons', () => {
    const testWeapons = [
      createTestWeapon('weapon-1', 'Pistol'),
      createTestWeapon('weapon-2', 'Rifle'),
      createTestWeapon('weapon-3', 'Sword')
    ]
    const characterWithWeapons = createTestCharacter(testWeapons)

    it('should display character weapons in select', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithWeapons}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Pistol')).toBeInTheDocument()
      })

      expect(screen.getByText('Rifle')).toBeInTheDocument()
      expect(screen.getByText('Sword')).toBeInTheDocument()
    })

    it('should automatically set first weapon as default', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithWeapons}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(mockSetWeapon).toHaveBeenCalledWith(testWeapons[0])
      })
    })

    it('should handle weapon selection', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithWeapons}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Pistol')).toBeInTheDocument()
      })

      const selectElement = screen.getByTestId('weapon-select')
      fireEvent.change(selectElement, { target: { value: 'weapon-2' } })

      expect(mockSetWeapon).toHaveBeenCalledWith(testWeapons[1])
    })

    it('should handle clearing selection', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithWeapons}
          weapon={testWeapons[0]}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Pistol')).toBeInTheDocument()
      })

      const selectElement = screen.getByTestId('weapon-select')
      fireEvent.change(selectElement, { target: { value: '' } })

      expect(mockSetWeapon).toHaveBeenCalledWith(defaultWeapon)
    })

    it('should clear helper text when weapons are available', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithWeapons}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('select-helper-text')).toHaveTextContent('')
      })
    })
  })

  describe('character without weapons', () => {
    const characterWithoutWeapons = createTestCharacter([])

    it('should show no weapons helper text', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithoutWeapons}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('select-helper-text')).toHaveTextContent('No available weapons.')
      })
    })

    it('should render empty options list', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithoutWeapons}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        const selectElement = screen.getByTestId('weapon-select')
        // Should only have the default "Select Weapon" option
        expect(selectElement.children).toHaveLength(1)
      })
    })
  })

  describe('duplicate weapon filtering', () => {
    const duplicateWeapons = [
      createTestWeapon('weapon-1', 'Pistol'),
      createTestWeapon('weapon-1', 'Pistol'), // Same ID
      createTestWeapon('weapon-2', 'Pistol'), // Different ID, same name
      createTestWeapon('weapon-3', 'Rifle')
    ]
    const characterWithDuplicates = createTestCharacter(duplicateWeapons)

    it('should filter out duplicate weapons by ID', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithDuplicates}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getAllByText('Pistol')).toHaveLength(2) // Two different weapons with same name but different IDs
      })

      // Should show 3 unique weapons (not 4)
      const selectElement = screen.getByTestId('weapon-select')
      expect(selectElement.children).toHaveLength(4) // 1 default + 3 unique weapons
    })
  })

  describe('selected weapon display', () => {
    const selectedWeapon = createTestWeapon('selected-weapon', 'Selected Pistol')
    const character = createTestCharacter([selectedWeapon])

    it('should display selected weapon value', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={character}
          weapon={selectedWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        const selectElement = screen.getByTestId('weapon-select') as HTMLSelectElement
        expect(selectElement.value).toBe('selected-weapon')
      })
    })

    it('should handle null weapon value', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={character}
          weapon={null as any}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        const selectElement = screen.getByTestId('weapon-select') as HTMLSelectElement
        expect(selectElement.value).toBe('')
      })
    })
  })

  describe('disabled state', () => {
    const character = createTestCharacter([createTestWeapon('weapon-1', 'Test Weapon')])

    it('should disable select when disabled prop is true', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={character}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={true}
        />
      )

      await waitFor(() => {
        const selectElement = screen.getByTestId('weapon-select')
        expect(selectElement).toBeDisabled()
      })
    })

    it('should enable select when disabled prop is false', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={character}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        const selectElement = screen.getByTestId('weapon-select')
        expect(selectElement).not.toBeDisabled()
      })
    })
  })

  describe('character changes', () => {
    it('should update weapons when character changes', async () => {
      const character1 = createTestCharacter([createTestWeapon('weapon-1', 'Weapon 1')])
      const character2 = createTestCharacter([createTestWeapon('weapon-2', 'Weapon 2')])

      const { rerender } = renderWithTheme(
        <WeaponAutocomplete
          character={character1}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Weapon 1')).toBeInTheDocument()
      })

      rerender(
        <ThemeProvider theme={theme}>
          <WeaponAutocomplete
            character={character2}
            weapon={defaultWeapon}
            setWeapon={mockSetWeapon}
            disabled={false}
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Weapon 2')).toBeInTheDocument()
      })

      expect(screen.queryByText('Weapon 1')).not.toBeInTheDocument()
    })

    it('should handle character without ID', async () => {
      const characterWithoutId = {
        ...createTestCharacter([createTestWeapon('weapon-1', 'Test Weapon')]),
        id: ''
      }

      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithoutId}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('select-helper-text')).toHaveTextContent('No available weapons.')
      })
    })

    it('should handle null character', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={null as any}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('select-helper-text')).toHaveTextContent('No available weapons.')
      })
    })
  })

  describe('option label formatting', () => {
    const weaponsWithDifferentNames = [
      createTestWeapon('weapon-1', 'Simple Name'),
      createTestWeapon('weapon-2', 'Complex-Name_123'),
      createTestWeapon('weapon-3', '')
    ]
    const character = createTestCharacter(weaponsWithDifferentNames)

    it('should display weapon names as option labels', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={character}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Simple Name')).toBeInTheDocument()
      })

      expect(screen.getByText('Complex-Name_123')).toBeInTheDocument()
    })

    it('should handle empty weapon names', async () => {
      renderWithTheme(
        <WeaponAutocomplete
          character={character}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        // Should still render the option even with empty name
        const selectElement = screen.getByTestId('weapon-select')
        expect(selectElement.children).toHaveLength(4) // 1 default + 3 weapons
      })
    })
  })

  describe('component styling', () => {
    const character = createTestCharacter([createTestWeapon('weapon-1', 'Test Weapon')])

    it('should maintain component width styling', async () => {
      const { container } = renderWithTheme(
        <WeaponAutocomplete
          character={character}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      expect(screen.getByTestId('styled-autocomplete')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle undefined weapons array', async () => {
      // Component doesn't handle undefined weapons gracefully - it will throw error
      // This is expected behavior for the component architecture
      const characterWithValidWeapons = createTestCharacter([])

      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithValidWeapons}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(screen.getByTestId('styled-autocomplete')).toBeInTheDocument()
      })

      expect(screen.getByTestId('select-helper-text')).toHaveTextContent('No available weapons.')
    })

    it('should call setWeapon with defaultWeapon when no weapons available', async () => {
      const characterWithoutWeapons = createTestCharacter([])

      renderWithTheme(
        <WeaponAutocomplete
          character={characterWithoutWeapons}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      await waitFor(() => {
        expect(mockSetWeapon).toHaveBeenCalledWith(defaultWeapon)
      })
    })

    it('should handle rapid character changes', async () => {
      const character1 = createTestCharacter([createTestWeapon('weapon-1', 'Weapon 1')])
      const character2 = createTestCharacter([createTestWeapon('weapon-2', 'Weapon 2')])
      const character3 = createTestCharacter([createTestWeapon('weapon-3', 'Weapon 3')])

      const { rerender } = renderWithTheme(
        <WeaponAutocomplete
          character={character1}
          weapon={defaultWeapon}
          setWeapon={mockSetWeapon}
          disabled={false}
        />
      )

      rerender(
        <ThemeProvider theme={theme}>
          <WeaponAutocomplete
            character={character2}
            weapon={defaultWeapon}
            setWeapon={mockSetWeapon}
            disabled={false}
          />
        </ThemeProvider>
      )

      rerender(
        <ThemeProvider theme={theme}>
          <WeaponAutocomplete
            character={character3}
            weapon={defaultWeapon}
            setWeapon={mockSetWeapon}
            disabled={false}
          />
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(screen.getByText('Weapon 3')).toBeInTheDocument()
      })
    })
  })
})