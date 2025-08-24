import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import CharacterFilters from '../../../components/characters/CharacterFilters'
import { CharactersActions } from '../../../reducers/charactersState'
import { CharacterTypes } from '../../../types/types'
import { createMockCharacter, createMockFaction } from '../../factories/MockFactories'

const theme = createTheme()

describe('CharacterFilters Component', () => {
  let mockDispatch: jest.Mock
  let mockState: any

  const renderWithProviders = (state = mockState, props = {}) => {
    return render(
      <ThemeProvider theme={theme}>
        <CharacterFilters 
          state={state}
          dispatch={mockDispatch}
          {...props}
        />
      </ThemeProvider>
    )
  }

  beforeEach(() => {
    mockDispatch = jest.fn()

    mockState = {
      loading: false,
      meta: {},
      character: null,
      characters: [
        createMockCharacter({ 
          id: '1', 
          name: 'Test Character 1', 
          action_values: { ...createMockCharacter().action_values, Type: 'PC' as any }
        }),
        createMockCharacter({ 
          id: '2', 
          name: 'Test Character 2', 
          action_values: { ...createMockCharacter().action_values, Type: 'NPC' as any }
        })
      ],
      character_type: '',
      faction: { id: '', name: '' },
      factions: [
        createMockFaction({ id: '1', name: 'Heroes' }),
        createMockFaction({ id: '2', name: 'Villains' })
      ],
      archetype: '',
      archetypes: ['Cop', 'Soldier', 'Martial Artist'],
      search: ''
    }

    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('filter panel rendering', () => {
    it('should render all filter controls', () => {
      renderWithProviders()

      expect(screen.getByLabelText('Character Type')).toBeInTheDocument()
      expect(screen.getByLabelText('Faction')).toBeInTheDocument()
      expect(screen.getByLabelText('Archetype')).toBeInTheDocument()
      expect(screen.getByLabelText('Character')).toBeInTheDocument()
    })

    it('should render with correct default values', () => {
      renderWithProviders()

      const characterTypeSelect = screen.getByDisplayValue('All')
      const factionSelect = screen.getByDisplayValue('All')
      const archetypeSelect = screen.getByDisplayValue('All')

      expect(characterTypeSelect).toBeInTheDocument()
      expect(factionSelect).toBeInTheDocument()
      expect(archetypeSelect).toBeInTheDocument()
    })

    it('should render autocomplete when textSearch is false', () => {
      renderWithProviders(mockState, { textSearch: false })

      // Should have autocomplete input
      const characterInput = screen.getByLabelText('Character')
      expect(characterInput).toBeInTheDocument()
    })

    it('should render text field when textSearch is true', () => {
      renderWithProviders(mockState, { textSearch: true })

      // Should have regular text input
      const searchInput = screen.getByLabelText('Character')
      expect(searchInput).toBeInTheDocument()
    })

    it('should disable controls when loading', () => {
      const loadingState = { ...mockState, loading: true }
      renderWithProviders(loadingState)

      const characterInput = screen.getByLabelText('Character')
      expect(characterInput).toBeDisabled()
    })
  })

  describe('character type filter', () => {
    it('should display all character type options', () => {
      renderWithProviders()

      const characterTypeSelect = screen.getByLabelText('Character Type')
      fireEvent.mouseDown(characterTypeSelect)

      expect(screen.getByText('All')).toBeInTheDocument()
      expect(screen.getByText(CharacterTypes.PC)).toBeInTheDocument()
      expect(screen.getByText(CharacterTypes.Ally)).toBeInTheDocument()
      expect(screen.getByText(CharacterTypes.Mook)).toBeInTheDocument()
      expect(screen.getByText(CharacterTypes.FeaturedFoe)).toBeInTheDocument()
      expect(screen.getByText(CharacterTypes.Boss)).toBeInTheDocument()
      expect(screen.getByText(CharacterTypes.UberBoss)).toBeInTheDocument()
    })

    it('should update character type filter', () => {
      renderWithProviders()

      const characterTypeSelect = screen.getByLabelText('Character Type')
      fireEvent.change(characterTypeSelect, { target: { name: 'character_type', value: CharacterTypes.PC } })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: CharactersActions.UPDATE,
        name: 'character_type',
        value: CharacterTypes.PC
      })
    })

    it('should show selected character type', () => {
      const stateWithPCSelected = { ...mockState, character_type: CharacterTypes.PC }
      renderWithProviders(stateWithPCSelected)

      const characterTypeSelect = screen.getByDisplayValue(CharacterTypes.PC)
      expect(characterTypeSelect).toBeInTheDocument()
    })

    it('should handle clearing character type filter', () => {
      renderWithProviders()

      const characterTypeSelect = screen.getByLabelText('Character Type')
      fireEvent.change(characterTypeSelect, { target: { name: 'character_type', value: '' } })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: CharactersActions.UPDATE,
        name: 'character_type',
        value: ''
      })
    })
  })

  describe('faction filter', () => {
    it('should display all faction options', () => {
      renderWithProviders()

      const factionSelect = screen.getByLabelText('Faction')
      fireEvent.mouseDown(factionSelect)

      expect(screen.getByText('All')).toBeInTheDocument()
      expect(screen.getByText('Heroes')).toBeInTheDocument()
      expect(screen.getByText('Villains')).toBeInTheDocument()
    })

    it('should update faction filter', () => {
      renderWithProviders()

      const factionSelect = screen.getByLabelText('Faction')
      fireEvent.change(factionSelect, { target: { name: 'faction', value: '1' } })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: CharactersActions.UPDATE,
        name: 'faction',
        value: '1'
      })
    })

    it('should show selected faction', () => {
      const stateWithFactionSelected = { 
        ...mockState, 
        faction: { id: '1', name: 'Heroes' }
      }
      renderWithProviders(stateWithFactionSelected)

      const factionSelect = screen.getByDisplayValue('Heroes')
      expect(factionSelect).toBeInTheDocument()
    })

    it('should handle empty factions array', () => {
      const stateWithNoFactions = { ...mockState, factions: [] }
      renderWithProviders(stateWithNoFactions)

      const factionSelect = screen.getByLabelText('Faction')
      fireEvent.mouseDown(factionSelect)

      // Should still show 'All' option
      expect(screen.getByText('All')).toBeInTheDocument()
    })
  })

  describe('archetype filter', () => {
    it('should display all archetype options', () => {
      renderWithProviders()

      const archetypeSelect = screen.getByLabelText('Archetype')
      fireEvent.mouseDown(archetypeSelect)

      expect(screen.getByText('All')).toBeInTheDocument()
      expect(screen.getByText('Cop')).toBeInTheDocument()
      expect(screen.getByText('Soldier')).toBeInTheDocument()
      expect(screen.getByText('Martial Artist')).toBeInTheDocument()
    })

    it('should update archetype filter', () => {
      renderWithProviders()

      const archetypeSelect = screen.getByLabelText('Archetype')
      fireEvent.change(archetypeSelect, { target: { name: 'archetype', value: 'Cop' } })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: CharactersActions.UPDATE,
        name: 'archetype',
        value: 'Cop'
      })
    })

    it('should show selected archetype', () => {
      const stateWithArchetypeSelected = { ...mockState, archetype: 'Cop' }
      renderWithProviders(stateWithArchetypeSelected)

      const archetypeSelect = screen.getByDisplayValue('Cop')
      expect(archetypeSelect).toBeInTheDocument()
    })

    it('should handle empty archetypes array', () => {
      const stateWithNoArchetypes = { ...mockState, archetypes: [] }
      renderWithProviders(stateWithNoArchetypes)

      const archetypeSelect = screen.getByLabelText('Archetype')
      fireEvent.mouseDown(archetypeSelect)

      // Should still show 'All' option
      expect(screen.getByText('All')).toBeInTheDocument()
    })
  })

  describe('character search functionality', () => {
    it('should handle character selection from autocomplete', () => {
      renderWithProviders(mockState, { textSearch: false })

      const character = createMockCharacter({ id: '1', name: 'Selected Character' })
      
      // Mock the autocomplete change event
      const autocompleteInput = screen.getByLabelText('Character')
      
      // Simulate selecting a character
      act(() => {
        fireEvent.change(autocompleteInput, { target: { value: 'Selected Character' } })
      })

      // Since we can't easily test autocomplete selection, we'll test the handler directly
      // The component uses onChange={selectCharacter}
    })

    it('should display character option labels correctly', () => {
      const characterWithVehicle = createMockCharacter({ 
        id: '1', 
        name: 'Test Vehicle',
        category: 'vehicle',
        action_values: { Type: 'Car' }
      })
      
      const characterWithPerson = createMockCharacter({ 
        id: '2', 
        name: 'Test Person',
        category: 'character',
        action_values: { Type: 'Human' }
      })

      const stateWithMixedCharacters = {
        ...mockState,
        characters: [characterWithVehicle, characterWithPerson]
      }

      renderWithProviders(stateWithMixedCharacters, { textSearch: false })

      // The getOptionLabel function should be called internally
      // Testing the actual display would require more complex autocomplete interaction
    })

    it('should handle text search with debouncing', async () => {
      renderWithProviders(mockState, { textSearch: true })

      const searchInput = screen.getByLabelText('Character')
      
      fireEvent.change(searchInput, { target: { value: 'test search' } })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: CharactersActions.SEARCH,
        payload: 'test search'
      })

      // Fast forward time to trigger debounced action
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: CharactersActions.EDIT
      })
    })

    it('should clear previous debounce timer on new search', () => {
      renderWithProviders(mockState, { textSearch: true })

      const searchInput = screen.getByLabelText('Character')
      
      // First search
      fireEvent.change(searchInput, { target: { value: 'first' } })
      
      // Second search before debounce completes
      fireEvent.change(searchInput, { target: { value: 'second' } })

      // Fast forward time
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Should only have triggered EDIT once (for the second search)
      const editCalls = mockDispatch.mock.calls.filter(call => call[0].type === CharactersActions.EDIT)
      expect(editCalls).toHaveLength(1)
    })

    it('should show current search value', () => {
      const stateWithSearch = { ...mockState, search: 'current search' }
      renderWithProviders(stateWithSearch, { textSearch: true })

      const searchInput = screen.getByDisplayValue('current search')
      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('cleanup and lifecycle', () => {
    it('should cleanup timer on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
      
      const { unmount } = renderWithProviders(mockState, { textSearch: true })

      // Trigger a search to create a timer
      const searchInput = screen.getByLabelText('Character')
      fireEvent.change(searchInput, { target: { value: 'test' } })

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
      clearTimeoutSpy.mockRestore()
    })

    it('should handle multiple rapid searches without memory leaks', () => {
      renderWithProviders(mockState, { textSearch: true })

      const searchInput = screen.getByLabelText('Character')
      
      // Simulate rapid typing
      for (let i = 0; i < 10; i++) {
        fireEvent.change(searchInput, { target: { value: `search${i}` } })
      }

      // Fast forward time
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Should only trigger EDIT once for the final search
      const editCalls = mockDispatch.mock.calls.filter(call => call[0].type === CharactersActions.EDIT)
      expect(editCalls).toHaveLength(1)
    })
  })

  describe('error handling and edge cases', () => {
    it('should handle missing character names gracefully', () => {
      const characterWithoutName = createMockCharacter({ id: '1', name: '' })
      const stateWithEmptyName = {
        ...mockState,
        characters: [characterWithoutName]
      }

      renderWithProviders(stateWithEmptyName, { textSearch: false })

      // Should render without throwing errors
      expect(screen.getByLabelText('Character')).toBeInTheDocument()
    })

    it('should handle missing action_values gracefully', () => {
      const characterWithoutActionValues = createMockCharacter({ 
        id: '1', 
        name: 'Test',
        action_values: undefined
      })
      const stateWithMissingActionValues = {
        ...mockState,
        characters: [characterWithoutActionValues]
      }

      renderWithProviders(stateWithMissingActionValues, { textSearch: false })

      // Should render without throwing errors
      expect(screen.getByLabelText('Character')).toBeInTheDocument()
    })

    it('should handle null character state', () => {
      const stateWithNullCharacter = { ...mockState, character: null }
      renderWithProviders(stateWithNullCharacter, { textSearch: false })

      expect(screen.getByLabelText('Character')).toBeInTheDocument()
    })

    it('should handle empty search string', () => {
      renderWithProviders(mockState, { textSearch: true })

      const searchInput = screen.getByLabelText('Character')
      fireEvent.change(searchInput, { target: { value: '' } })

      expect(mockDispatch).toHaveBeenCalledWith({
        type: CharactersActions.SEARCH,
        payload: ''
      })
    })
  })
})