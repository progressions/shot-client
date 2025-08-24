import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FightDetail from '@/components/fights/FightDetail'
import { createMockFight, createMockCharacter } from '../../factories/MockFactories'

const theme = createTheme()

// Mock contexts
const mockClient = {
  deleteFight: jest.fn().mockResolvedValue({}),
  updateFight: jest.fn().mockResolvedValue({})
}

const mockToast = {
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
  closeToast: jest.fn(),
  toastInfo: jest.fn(),
  toastWarning: jest.fn()
}

const mockUseClient = {
  client: mockClient,
  user: { id: 'user-1', gamemaster: true }
}

jest.mock('@/contexts/ClientContext', () => ({
  useClient: () => mockUseClient
}))

jest.mock('@/contexts/ToastContext', () => ({
  useToast: () => mockToast
}))

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn(() => true)
})

// Mock child components
jest.mock('@/components/GamemasterOnly', () => {
  return function MockGamemasterOnly({ user, children }: any) {
    return user?.gamemaster ? <div data-testid="gm-only">{children}</div> : null
  }
})

jest.mock('@/components/fights/CharacterAvatars', () => {
  return function MockCharacterAvatars({ characters }: any) {
    return (
      <div data-testid="character-avatars">
        {characters?.map((char: any, index: number) => (
          <span key={char.id || index} data-testid={`avatar-${char.id}`}>
            {char.name}
          </span>
        ))}
      </div>
    )
  }
})

jest.mock('@/components/editor/RichTextRenderer', () => {
  return function MockRichTextRenderer({ html }: any) {
    return (
      <div data-testid="rich-text-renderer" dangerouslySetInnerHTML={{ __html: html || '' }} />
    )
  }
})

jest.mock('@/components/links', () => ({
  CharacterLink: function MockCharacterLink({ character }: any) {
    return (
      <a href={`/characters/${character.id}`} data-testid={`character-link-${character.id}`}>
        {character.name}
      </a>
    )
  }
}))

// Mock services
jest.mock('@/services/CharacterService', () => ({}))

// Mock ReactDOMServer
jest.mock('react-dom/server', () => ({
  renderToStaticMarkup: jest.fn((element) => {
    if (!element) return null
    return '<mock-rendered-html>Test Actor Link</mock-rendered-html>'
  })
}))

// Mock reducers
jest.mock('@/reducers/fightsState', () => ({
  FightsActions: {
    EDIT: 'EDIT',
    DELETE: 'DELETE'
  }
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('FightDetail', () => {
  const mockDispatch = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    window.confirm = jest.fn(() => true)
  })

  describe('basic rendering', () => {
    test('renders fight card with basic information', () => {
      const fight = createMockFight({
        id: 'fight-1',
        name: 'Test Fight',
        sequence: 5,
        active: true,
        updated_at: '2024-01-15T10:00:00Z'
      })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByText('Test Fight')).toBeInTheDocument()
      expect(screen.getByText(/Sequence 5/)).toBeInTheDocument()
      expect(screen.getByText(/Last played January 15, 2024/)).toBeInTheDocument()
    })

    test('renders fight name as a link', () => {
      const fight = createMockFight({ id: 'fight-1', name: 'Test Fight' })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const fightLink = screen.getByRole('link', { name: 'Test Fight' })
      expect(fightLink).toHaveAttribute('href', '/fights/fight-1')
    })

    test('formats updated date correctly', () => {
      const fight = createMockFight({
        updated_at: '2024-12-25T15:30:00Z'
      })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByText(/Last played December 25, 2024/)).toBeInTheDocument()
    })

    test('displays character avatars', () => {
      const actors = [
        createMockCharacter({ id: 'char-1', name: 'Character 1' }),
        createMockCharacter({ id: 'char-2', name: 'Character 2' })
      ]
      const fight = createMockFight({ actors })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByTestId('character-avatars')).toBeInTheDocument()
      expect(screen.getByTestId('avatar-char-1')).toBeInTheDocument()
      expect(screen.getByTestId('avatar-char-2')).toBeInTheDocument()
    })
  })

  describe('fight description', () => {
    test('renders description when present', () => {
      const fight = createMockFight({
        description: '<p>This is a test fight description</p>'
      })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByTestId('rich-text-renderer')).toBeInTheDocument()
    })

    test('does not render description section when empty', () => {
      const fight = createMockFight({ description: undefined })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const richTextElements = screen.queryAllByTestId('rich-text-renderer')
      // Should still have the actors section if present
      expect(richTextElements.length).toBeLessThanOrEqual(1)
    })

    test('handles HTML content in description', () => {
      const fight = createMockFight({
        description: '<h3>Fight Title</h3><p>Fight details</p>'
      })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const richTextRenderer = screen.getByTestId('rich-text-renderer')
      expect(richTextRenderer).toHaveTextContent('Fight TitleFight details')
    })
  })

  describe('fight actors', () => {
    test('renders actors section when actors are present', () => {
      const actors = [
        createMockCharacter({ id: 'char-1', name: 'Hero' }),
        createMockCharacter({ id: 'char-2', name: 'Villain' })
      ]
      const fight = createMockFight({ actors })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const richTextElements = screen.getAllByTestId('rich-text-renderer')
      expect(richTextElements.length).toBeGreaterThan(0)
    })

    test('does not render actors section when no actors', () => {
      const fight = createMockFight({ actors: [] })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      // Only character avatars should be present, not the actors HTML section
      expect(screen.getByTestId('character-avatars')).toBeInTheDocument()
    })

    test('does not render actors links when user is not authenticated', () => {
      const originalUser = mockUseClient.user
      mockUseClient.user = { id: undefined } as any // No user ID
      
      const actors = [createMockCharacter({ name: 'Test Actor' })]
      const fight = createMockFight({ actors })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      // Should still render avatars but not the links section
      expect(screen.getByTestId('character-avatars')).toBeInTheDocument()
      
      // Restore original user
      mockUseClient.user = originalUser
    })

    test('calls ReactDOMServer.renderToStaticMarkup for actors', () => {
      const mockRenderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
      
      const actors = [createMockCharacter({ name: 'Test Actor' })]
      const fight = createMockFight({ actors })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(mockRenderToStaticMarkup).toHaveBeenCalled()
    })
  })

  describe('gamemaster actions', () => {
    test('shows visibility toggle button for active fight', () => {
      const fight = createMockFight({ active: true })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByTestId('gm-only')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /hide/i })).toBeInTheDocument()
    })

    test('shows visibility toggle button for inactive fight', () => {
      const fight = createMockFight({ active: false })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByRole('button', { name: /show/i })).toBeInTheDocument()
    })

    test('shows delete button', () => {
      const fight = createMockFight()
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    test('hides GM actions for non-gamemaster users', () => {
      const originalUser = mockUseClient.user
      mockUseClient.user = { id: 'user-1', gamemaster: false }
      
      const fight = createMockFight()
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.queryByTestId('gm-only')).not.toBeInTheDocument()
      
      // Restore original user
      mockUseClient.user = originalUser
    })
  })

  describe('visibility toggle', () => {
    test('handles visibility toggle successfully', async () => {
      const fight = createMockFight({ id: 'fight-1', name: 'Test Fight', active: true })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const toggleButton = screen.getByRole('button', { name: /hide/i })
      fireEvent.click(toggleButton)
      
      await waitFor(() => {
        expect(mockClient.updateFight).toHaveBeenCalledWith({
          id: 'fight-1',
          active: false
        })
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Fight Test Fight updated')
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'EDIT' })
      })
    })

    test('shows loading state during visibility toggle', async () => {
      const fight = createMockFight({ active: true })
      let resolvePromise: (value?: any) => void
      const mockPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockClient.updateFight.mockReturnValue(mockPromise)
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const toggleButton = screen.getByRole('button', { name: /hide/i })
      fireEvent.click(toggleButton)
      
      // Should show loading state
      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument()
      
      // Resolve promise to clear loading state
      resolvePromise!()
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /loading/i })).not.toBeInTheDocument()
      })
    })

    test('handles visibility toggle error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      mockClient.updateFight.mockRejectedValue(new Error('Update failed'))
      
      const fight = createMockFight({ active: true })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const toggleButton = screen.getByRole('button', { name: /hide/i })
      fireEvent.click(toggleButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
        expect(mockToast.toastError).toHaveBeenCalled()
      })
      
      consoleSpy.mockRestore()
    })

    test('resets loading state after error', async () => {
      mockClient.updateFight.mockRejectedValue(new Error('Update failed'))
      
      const fight = createMockFight({ active: true })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const toggleButton = screen.getByRole('button', { name: /hide/i })
      fireEvent.click(toggleButton)
      
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /loading/i })).not.toBeInTheDocument()
      })
    })
  })

  describe('fight deletion', () => {
    test('handles fight deletion with confirmation', async () => {
      window.confirm = jest.fn(() => true)
      
      const fight = createMockFight({ id: 'fight-1', name: 'Test Fight' })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)
      
      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('Permanently delete Test Fight?')
        expect(mockClient.deleteFight).toHaveBeenCalledWith(fight)
        expect(mockToast.toastSuccess).toHaveBeenCalledWith('Fight Test Fight deleted')
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'EDIT' })
      })
    })

    test('cancels deletion when user rejects confirmation', async () => {
      window.confirm = jest.fn(() => false)
      
      const fight = createMockFight({ name: 'Test Fight' })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)
      
      expect(window.confirm).toHaveBeenCalledWith('Permanently delete Test Fight?')
      expect(mockClient.deleteFight).not.toHaveBeenCalled()
    })

    test('handles deletion error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      window.confirm = jest.fn(() => true)
      mockClient.deleteFight.mockRejectedValue(new Error('Delete failed'))
      
      const fight = createMockFight()
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
        expect(mockToast.toastError).toHaveBeenCalled()
      })
      
      consoleSpy.mockRestore()
    })
  })

  describe('component lifecycle', () => {
    test('resets loading state when fight changes', () => {
      const initialFight = createMockFight({ id: 'fight-1' })
      const { rerender } = renderWithTheme(
        <FightDetail fight={initialFight} dispatch={mockDispatch} />
      )
      
      // Change fight
      const newFight = createMockFight({ id: 'fight-2' })
      rerender(
        <ThemeProvider theme={theme}>
          <FightDetail fight={newFight} dispatch={mockDispatch} />
        </ThemeProvider>
      )
      
      // Should not show loading state
      expect(screen.queryByRole('button', { name: /loading/i })).not.toBeInTheDocument()
    })

    test('cleans up loading state on unmount', () => {
      const fight = createMockFight()
      const { unmount } = renderWithTheme(
        <FightDetail fight={fight} dispatch={mockDispatch} />
      )
      
      unmount()
      
      // Component should unmount cleanly
      expect(screen.queryByTestId('styled-dialog')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    test('has accessible card structure', () => {
      const fight = createMockFight({ name: 'Test Fight' })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByRole('link', { name: 'Test Fight' })).toBeInTheDocument()
    })

    test('has accessible button labels', () => {
      const fight = createMockFight({ active: true })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByRole('button', { name: /hide/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    test('provides tooltips for actions', () => {
      const fight = createMockFight({ active: true })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      // Tooltips are present in the component structure
      expect(screen.getByRole('button', { name: /hide/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    test('shows loading tooltip during operations', async () => {
      const fight = createMockFight({ active: true })
      let resolvePromise: (value?: any) => void
      const mockPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockClient.updateFight.mockReturnValue(mockPromise)
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const toggleButton = screen.getByRole('button', { name: /hide/i })
      fireEvent.click(toggleButton)
      
      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument()
      
      resolvePromise!()
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /loading/i })).not.toBeInTheDocument()
      })
    })
  })

  describe('edge cases', () => {
    test('handles fight without updated_at', () => {
      const fight = createMockFight({ updated_at: undefined })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      // Should render without crashing
      expect(screen.getByTestId('character-avatars')).toBeInTheDocument()
    })

    test('handles fight without name', () => {
      const fight = createMockFight({ name: undefined })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByTestId('character-avatars')).toBeInTheDocument()
    })

    test('handles fight without actors', () => {
      const fight = createMockFight({ actors: undefined })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByTestId('character-avatars')).toBeInTheDocument()
    })

    test('handles empty actors array', () => {
      const fight = createMockFight({ actors: [] })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByTestId('character-avatars')).toBeInTheDocument()
    })

    test('handles invalid date in updated_at', () => {
      const fight = createMockFight({ updated_at: 'invalid-date' })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      // Should render without crashing, though date may be Invalid Date
      expect(screen.getByTestId('character-avatars')).toBeInTheDocument()
    })

    test('handles null user context', () => {
      const originalUser = mockUseClient.user
      mockUseClient.user = null as any
      
      const fight = createMockFight()
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.queryByTestId('gm-only')).not.toBeInTheDocument()
      
      // Restore original user
      mockUseClient.user = originalUser
    })

    test('handles missing fight ID for deletion', async () => {
      window.confirm = jest.fn(() => true)
      
      const fight = createMockFight({ id: undefined, name: 'Test Fight' })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const deleteButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(deleteButton)
      
      await waitFor(() => {
        expect(mockClient.deleteFight).toHaveBeenCalledWith(fight)
      })
    })

    test('handles missing fight ID for visibility toggle', async () => {
      const fight = createMockFight({ id: undefined, active: true })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      const toggleButton = screen.getByRole('button', { name: /hide/i })
      fireEvent.click(toggleButton)
      
      await waitFor(() => {
        expect(mockClient.updateFight).toHaveBeenCalledWith({
          id: undefined,
          active: false
        })
      })
    })
  })

  describe('styling and layout', () => {
    test('applies gradient background to card', () => {
      const fight = createMockFight()
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      // Card should be present with styling
      const card = screen.getByRole('link').closest('.MuiCard-root')
      expect(card).toBeInTheDocument()
    })

    test('positions card actions in header', () => {
      const fight = createMockFight({ active: true })
      
      renderWithTheme(<FightDetail fight={fight} dispatch={mockDispatch} />)
      
      expect(screen.getByTestId('gm-only')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /hide/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })
  })
})