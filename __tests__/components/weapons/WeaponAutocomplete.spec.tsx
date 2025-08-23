import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import WeaponAutocomplete from '../../../components/weapons/WeaponAutocomplete'
import { defaultWeapon } from '../../../types/types'
import type { Weapon } from '../../../types/types'
import { WeaponsActions } from '../../../reducers/weaponsState'
import type { WeaponsStateType, WeaponsActionType } from '../../../reducers/weaponsState'

// Mock StyledFields components
jest.mock('../../../components/StyledFields', () => ({
  StyledAutocomplete: ({ value, options, disabled, onChange, onInputChange, getOptionLabel, renderInput }: any) => (
    <div data-testid="styled-autocomplete">
      <input
        data-testid="weapon-input"
        value={value?.name || ''}
        disabled={disabled}
        onChange={(e) => onInputChange && onInputChange(e, e.target.value)}
        placeholder="Search weapons"
      />
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

describe('WeaponAutocomplete', () => {
  const mockDispatch = jest.fn()

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

  const createWeaponsState = (overrides: Partial<WeaponsStateType> = {}): WeaponsStateType => ({
    edited: false,
    loading: false,
    saving: false,
    page: 1,
    juncture: '',
    junctures: [],
    category: '',
    categories: [],
    name: '',
    weapon: defaultWeapon,
    weapons: [],
    meta: { current_page: 1, next_page: null, prev_page: null, total_pages: 1, total_count: 0 },
    ...overrides
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('basic rendering', () => {
    const state = createWeaponsState()

    it('should render autocomplete component', () => {
      renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      expect(screen.getByTestId('styled-autocomplete')).toBeInTheDocument()
      expect(screen.getByTestId('weapon-input')).toBeInTheDocument()
      expect(screen.getByTestId('weapon-select')).toBeInTheDocument()
    })

    it('should show weapon label', () => {
      renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      expect(screen.getByTestId('select-label')).toHaveTextContent('Weapon')
    })

    it('should display helper text when no weapons available', () => {
      renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      expect(screen.getByTestId('select-helper-text')).toHaveTextContent('There are no available weapons.')
    })
  })

  describe('weapons display', () => {
    const testWeapons = [
      createTestWeapon('weapon-1', 'Pistol'),
      createTestWeapon('weapon-2', 'Rifle'),
      createTestWeapon('weapon-3', 'Sword')
    ]

    const stateWithWeapons = createWeaponsState({
      weapons: testWeapons
    })

    it('should display available weapons in select', () => {
      renderWithTheme(<WeaponAutocomplete state={stateWithWeapons} dispatch={mockDispatch} />)

      expect(screen.getByText('Pistol')).toBeInTheDocument()
      expect(screen.getByText('Rifle')).toBeInTheDocument()
      expect(screen.getByText('Sword')).toBeInTheDocument()
    })

    it('should clear helper text when weapons are available', () => {
      renderWithTheme(<WeaponAutocomplete state={stateWithWeapons} dispatch={mockDispatch} />)

      expect(screen.getByTestId('select-helper-text')).toHaveTextContent('')
    })

    it('should handle weapon selection', () => {
      renderWithTheme(<WeaponAutocomplete state={stateWithWeapons} dispatch={mockDispatch} />)

      const selectElement = screen.getByTestId('weapon-select')
      fireEvent.change(selectElement, { target: { value: 'weapon-1' } })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: WeaponsActions.WEAPON,
        payload: testWeapons[0]
      })
    })

    it('should handle clearing selection', () => {
      renderWithTheme(<WeaponAutocomplete state={stateWithWeapons} dispatch={mockDispatch} />)

      const selectElement = screen.getByTestId('weapon-select')
      fireEvent.change(selectElement, { target: { value: '' } })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: WeaponsActions.WEAPON,
        payload: null
      })
    })
  })

  describe('selected weapon display', () => {
    const selectedWeapon = createTestWeapon('selected-weapon', 'Selected Pistol')
    const stateWithSelection = createWeaponsState({
      weapon: selectedWeapon,
      weapons: [selectedWeapon]
    })

    it('should display selected weapon value in input', () => {
      renderWithTheme(<WeaponAutocomplete state={stateWithSelection} dispatch={mockDispatch} />)

      const inputElement = screen.getByTestId('weapon-input') as HTMLInputElement
      expect(inputElement.value).toBe('Selected Pistol')
    })

    it('should display selected weapon value in select', () => {
      renderWithTheme(<WeaponAutocomplete state={stateWithSelection} dispatch={mockDispatch} />)

      const selectElement = screen.getByTestId('weapon-select') as HTMLSelectElement
      expect(selectElement.value).toBe('selected-weapon')
    })

    it('should handle null weapon value', () => {
      const stateWithNullWeapon = createWeaponsState({
        weapon: null as any,
        weapons: []
      })

      renderWithTheme(<WeaponAutocomplete state={stateWithNullWeapon} dispatch={mockDispatch} />)

      const inputElement = screen.getByTestId('weapon-input') as HTMLInputElement
      const selectElement = screen.getByTestId('weapon-select') as HTMLSelectElement

      expect(inputElement.value).toBe('')
      expect(selectElement.value).toBe('')
    })
  })

  describe('loading state', () => {
    const loadingState = createWeaponsState({
      loading: true,
      weapons: [createTestWeapon('weapon-1', 'Test Weapon')]
    })

    it('should disable autocomplete when loading', () => {
      renderWithTheme(<WeaponAutocomplete state={loadingState} dispatch={mockDispatch} />)

      const inputElement = screen.getByTestId('weapon-input')
      const selectElement = screen.getByTestId('weapon-select')

      expect(inputElement).toBeDisabled()
      expect(selectElement).toBeDisabled()
    })

    it('should enable autocomplete when not loading', () => {
      const notLoadingState = createWeaponsState({
        loading: false,
        weapons: [createTestWeapon('weapon-1', 'Test Weapon')]
      })

      renderWithTheme(<WeaponAutocomplete state={notLoadingState} dispatch={mockDispatch} />)

      const inputElement = screen.getByTestId('weapon-input')
      const selectElement = screen.getByTestId('weapon-select')

      expect(inputElement).not.toBeDisabled()
      expect(selectElement).not.toBeDisabled()
    })
  })

  describe('search functionality', () => {
    const state = createWeaponsState()

    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should handle input change for search', () => {
      renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      const inputElement = screen.getByTestId('weapon-input')
      fireEvent.change(inputElement, { target: { value: 'pistol' } })

      // Fast-forward past the debounce timeout
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: WeaponsActions.NAME,
        payload: 'pistol'
      })
    })

    it('should debounce search input', () => {
      renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      const inputElement = screen.getByTestId('weapon-input')
      
      // Rapid typing simulation
      fireEvent.change(inputElement, { target: { value: 'p' } })
      fireEvent.change(inputElement, { target: { value: 'pi' } })
      fireEvent.change(inputElement, { target: { value: 'pis' } })
      fireEvent.change(inputElement, { target: { value: 'pist' } })
      fireEvent.change(inputElement, { target: { value: 'pistol' } })

      // Only advance to just before timeout
      act(() => {
        jest.advanceTimersByTime(999)
      })

      expect(mockDispatch).not.toHaveBeenCalled()

      // Now trigger the debounced call
      act(() => {
        jest.advanceTimersByTime(1)
      })

      expect(mockDispatch).toHaveBeenCalledTimes(1)
      expect(mockDispatch).toHaveBeenCalledWith({
        type: WeaponsActions.NAME,
        payload: 'pistol'
      })
    })

    it('should clear timeout on unmount', () => {
      const { unmount } = renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      const inputElement = screen.getByTestId('weapon-input')
      fireEvent.change(inputElement, { target: { value: 'test' } })

      unmount()

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(mockDispatch).not.toHaveBeenCalled()
    })
  })

  describe('option label formatting', () => {
    const weaponsWithDifferentNames = [
      createTestWeapon('weapon-1', 'Simple Name'),
      createTestWeapon('weapon-2', 'Complex-Name_123'),
      createTestWeapon('weapon-3', '')
    ]

    const stateWithVariedWeapons = createWeaponsState({
      weapons: weaponsWithDifferentNames
    })

    it('should display weapon names as option labels', () => {
      renderWithTheme(<WeaponAutocomplete state={stateWithVariedWeapons} dispatch={mockDispatch} />)

      expect(screen.getByText('Simple Name')).toBeInTheDocument()
      expect(screen.getByText('Complex-Name_123')).toBeInTheDocument()
    })

    it('should handle empty weapon names', () => {
      renderWithTheme(<WeaponAutocomplete state={stateWithVariedWeapons} dispatch={mockDispatch} />)

      // Should still render the option even with empty name
      const selectElement = screen.getByTestId('weapon-select')
      expect(selectElement.children).toHaveLength(4) // 1 default + 3 weapons
    })
  })

  describe('component lifecycle', () => {
    it('should handle state changes properly', () => {
      const initialState = createWeaponsState()
      const { rerender } = renderWithTheme(<WeaponAutocomplete state={initialState} dispatch={mockDispatch} />)

      expect(screen.getByTestId('select-helper-text')).toHaveTextContent('There are no available weapons.')

      const updatedState = createWeaponsState({
        weapons: [createTestWeapon('weapon-1', 'New Weapon')]
      })

      rerender(
        <ThemeProvider theme={theme}>
          <WeaponAutocomplete state={updatedState} dispatch={mockDispatch} />
        </ThemeProvider>
      )

      expect(screen.getByText('New Weapon')).toBeInTheDocument()
      expect(screen.getByTestId('select-helper-text')).toHaveTextContent('')
    })

    it('should handle dispatch function changes', () => {
      const state = createWeaponsState({
        weapons: [createTestWeapon('weapon-1', 'Test Weapon')]
      })

      const newDispatch = jest.fn()
      
      const { rerender } = renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      rerender(
        <ThemeProvider theme={theme}>
          <WeaponAutocomplete state={state} dispatch={newDispatch} />
        </ThemeProvider>
      )

      const selectElement = screen.getByTestId('weapon-select')
      fireEvent.change(selectElement, { target: { value: 'weapon-1' } })

      expect(newDispatch).toHaveBeenCalled()
      expect(mockDispatch).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle empty weapons array', () => {
      const stateWithEmptyWeapons = createWeaponsState({
        weapons: []
      })

      renderWithTheme(<WeaponAutocomplete state={stateWithEmptyWeapons} dispatch={mockDispatch} />)

      expect(screen.getByTestId('styled-autocomplete')).toBeInTheDocument()
      expect(screen.getByTestId('select-helper-text')).toHaveTextContent('There are no available weapons.')
    })

    it('should handle weapons array with duplicates', () => {
      const duplicateWeapon = createTestWeapon('weapon-1', 'Duplicate')
      const stateWithDuplicates = createWeaponsState({
        weapons: [duplicateWeapon, duplicateWeapon, duplicateWeapon]
      })

      renderWithTheme(<WeaponAutocomplete state={stateWithDuplicates} dispatch={mockDispatch} />)

      // Should render all duplicates (component doesn't filter)
      const options = screen.getAllByText('Duplicate')
      expect(options).toHaveLength(3)
    })

    it('should maintain component width styling', () => {
      const state = createWeaponsState()
      const { container } = renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      expect(screen.getByTestId('styled-autocomplete')).toBeInTheDocument()
    })
  })

  describe('WeaponsActions integration', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should use correct weapon selection action type', () => {
      const state = createWeaponsState({
        weapons: [createTestWeapon('weapon-1', 'Test Weapon')]
      })

      renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      // Test weapon selection action
      const selectElement = screen.getByTestId('weapon-select')
      fireEvent.change(selectElement, { target: { value: 'weapon-1' } })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: WeaponsActions.WEAPON,
        payload: expect.any(Object)
      })
    })

    it('should use correct search action type', () => {
      const state = createWeaponsState()

      renderWithTheme(<WeaponAutocomplete state={state} dispatch={mockDispatch} />)

      // Test search action
      const inputElement = screen.getByTestId('weapon-input')
      fireEvent.change(inputElement, { target: { value: 'search term' } })

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: WeaponsActions.NAME,
        payload: 'search term'
      })
    })
  })
})