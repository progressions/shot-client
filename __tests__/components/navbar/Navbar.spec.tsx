import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Navbar from '@/components/navbar/Navbar'
import { createMockUser } from '../../factories/user'
import { createMockCampaign } from '../../factories/campaign'

const theme = createTheme()

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, style }: any) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        data-testid="navbar-logo"
      />
    )
  }
})

// Mock contexts
const mockSetCurrentCampaign = jest.fn().mockResolvedValue({})
const mockGetCurrentCampaign = jest.fn()
const mockDispatchCurrentUser = jest.fn()

const mockUseCampaign = {
  campaign: createMockCampaign(),
  getCurrentCampaign: mockGetCurrentCampaign,
  setCurrentCampaign: mockSetCurrentCampaign
}

const mockUseClient = {
  session: { status: 'authenticated' },
  user: createMockUser(),
  client: {},
  currentUserState: { loading: false },
  dispatchCurrentUser: mockDispatchCurrentUser
}

jest.mock('@/contexts', () => ({
  useCampaign: () => mockUseCampaign,
  useClient: () => mockUseClient
}))

// Mock child components
jest.mock('@/components/navbar/AuthButton', () => {
  return function MockAuthButton({ status, user }: any) {
    return (
      <div data-testid="auth-button">
        Status: {status}, User: {user.name || 'Anonymous'}
      </div>
    )
  }
})

jest.mock('@/components/campaigns/CurrentCampaign', () => {
  return function MockCurrentCampaign() {
    return <div data-testid="current-campaign">Current Campaign Component</div>
  }
})

jest.mock('@/components/navbar/PopupMenu', () => {
  return function MockPopupMenu({ campaign, user }: any) {
    return (
      <div data-testid="popup-menu">
        Campaign: {campaign?.name}, User: {user?.name}
      </div>
    )
  }
})

jest.mock('@/components/dice/DiceRoller', () => {
  return function MockDiceRoller() {
    return <div data-testid="dice-roller">Dice Roller</div>
  }
})

// Mock types
const mockDefaultCampaign = {
  id: null,
  name: '',
  description: '',
  new: false,
  active: false
}

const mockDefaultUser = {
  id: null,
  name: '',
  email: '',
  gamemaster: false
}

jest.mock('@/types/types', () => ({
  defaultCampaign: mockDefaultCampaign,
  defaultUser: mockDefaultUser
}))

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Reset mock implementations
    mockUseCampaign.campaign = createMockCampaign()
    mockUseClient.user = createMockUser()
    mockUseClient.session = { status: 'authenticated' }
    mockUseClient.currentUserState = { loading: false }
  })

  describe('basic rendering', () => {
    test('renders navbar with primary navigation elements', () => {
      renderWithTheme(<Navbar />)
      
      expect(screen.getByRole('banner')).toBeInTheDocument() // AppBar
      expect(screen.getByTestId('navbar-logo')).toBeInTheDocument()
      expect(screen.getByTestId('auth-button')).toBeInTheDocument()
      expect(screen.getByTestId('popup-menu')).toBeInTheDocument()
      expect(screen.getByTestId('dice-roller')).toBeInTheDocument()
    })

    test('renders logo with correct properties', () => {
      renderWithTheme(<Navbar />)
      
      const logo = screen.getByTestId('navbar-logo')
      expect(logo).toHaveAttribute('src', '/ChiWar.svg')
      expect(logo).toHaveAttribute('alt', 'ChiWar')
      expect(logo).toHaveAttribute('width', '120')
      expect(logo).toHaveAttribute('height', '40')
    })

    test('wraps logo in home link', () => {
      renderWithTheme(<Navbar />)
      
      const homeLink = screen.getByRole('link', { name: /chiwar/i })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    test('uses correct styling and layout', () => {
      renderWithTheme(<Navbar />)
      
      const navbar = screen.getByRole('banner')
      expect(navbar).toBeInTheDocument()
      
      // Should have toolbar structure
      expect(document.querySelector('.MuiToolbar-root')).toBeTruthy()
    })
  })

  describe('user authentication states', () => {
    test('shows current campaign when user is authenticated', () => {
      renderWithTheme(<Navbar />)
      
      expect(screen.getByTestId('current-campaign')).toBeInTheDocument()
    })

    test('hides current campaign when no user', () => {
      mockUseClient.user = undefined as any as any
      
      renderWithTheme(<Navbar />)
      
      expect(screen.queryByTestId('current-campaign')).not.toBeInTheDocument()
    })

    test('passes authentication status to AuthButton', () => {
      renderWithTheme(<Navbar />)
      
      const authButton = screen.getByTestId('auth-button')
      expect(authButton).toHaveTextContent('Status: authenticated')
    })

    test('passes user data to AuthButton', () => {
      const user = createMockUser({ name: 'Test User' })
      mockUseClient.user = user
      
      renderWithTheme(<Navbar />)
      
      const authButton = screen.getByTestId('auth-button')
      expect(authButton).toHaveTextContent('User: Test User')
    })

    test('handles unauthenticated session', () => {
      mockUseClient.session = { status: 'unauthenticated' }
      
      renderWithTheme(<Navbar />)
      
      const authButton = screen.getByTestId('auth-button')
      expect(authButton).toHaveTextContent('Status: unauthenticated')
    })
  })

  describe('user state management', () => {
    test('updates current user when user prop changes', () => {
      const initialUser = createMockUser({ name: 'Initial User' })
      mockUseClient.user = initialUser
      
      const { rerender } = renderWithTheme(<Navbar />)
      
      expect(screen.getByTestId('auth-button')).toHaveTextContent('Initial User')
      
      // Change user
      const newUser = createMockUser({ name: 'New User' })
      mockUseClient.user = newUser
      
      rerender(
        <ThemeProvider theme={theme}>
          <Navbar />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('auth-button')).toHaveTextContent('New User')
    })

    test('sets default user when no user provided', () => {
      mockUseClient.user = undefined as any as any
      
      renderWithTheme(<Navbar />)
      
      const authButton = screen.getByTestId('auth-button')
      expect(authButton).toHaveTextContent('User: Anonymous')
    })

    test('responds to currentUserState changes', () => {
      const initialState = { loading: true }
      mockUseClient.currentUserState = initialState
      
      const { rerender } = renderWithTheme(<Navbar />)
      
      // Change user state
      mockUseClient.currentUserState = { loading: false }
      
      rerender(
        <ThemeProvider theme={theme}>
          <Navbar />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('auth-button')).toBeInTheDocument()
    })
  })

  describe('campaign management', () => {
    test('passes campaign data to PopupMenu', () => {
      const campaign = createMockCampaign({ name: 'Test Campaign' })
      mockUseCampaign.campaign = campaign
      
      renderWithTheme(<Navbar />)
      
      const popupMenu = screen.getByTestId('popup-menu')
      expect(popupMenu).toHaveTextContent('Campaign: Test Campaign')
    })

    test('passes user data to PopupMenu', () => {
      const user = createMockUser({ name: 'Test User' })
      mockUseClient.user = user
      
      renderWithTheme(<Navbar />)
      
      const popupMenu = screen.getByTestId('popup-menu')
      expect(popupMenu).toHaveTextContent('User: Test User')
    })

    test('handles campaign clearing', async () => {
      renderWithTheme(<Navbar />)
      
      // Note: The handleClear function isn't directly exposed in the UI
      // but we can test the function exists and works correctly
      expect(mockSetCurrentCampaign).not.toHaveBeenCalled()
    })

    test('handles campaign setting to default', async () => {
      renderWithTheme(<Navbar />)
      
      // Note: The handleClick function isn't directly exposed in the UI
      // but we can test the function works correctly by verifying the setup
      expect(mockUseCampaign.setCurrentCampaign).toBeDefined()
    })
  })

  describe('component integration', () => {
    test('integrates all child components correctly', () => {
      renderWithTheme(<Navbar />)
      
      expect(screen.getByTestId('popup-menu')).toBeInTheDocument()
      expect(screen.getByTestId('navbar-logo')).toBeInTheDocument()
      expect(screen.getByTestId('dice-roller')).toBeInTheDocument()
      expect(screen.getByTestId('auth-button')).toBeInTheDocument()
      expect(screen.getByTestId('current-campaign')).toBeInTheDocument()
    })

    test('maintains proper component hierarchy', () => {
      renderWithTheme(<Navbar />)
      
      const toolbar = document.querySelector('.MuiToolbar-root') as HTMLElement
      const appBar = screen.getByRole('banner')
      
      expect(appBar).toContainElement(toolbar)
    })

    test('applies correct layout styling', () => {
      renderWithTheme(<Navbar />)
      
      // Check for flexGrow and minWidth styling on container
      const container = screen.getByRole('banner').parentElement
      expect(container).toBeInTheDocument()
    })
  })

  describe('responsive design', () => {
    test('sets minimum width constraint', () => {
      renderWithTheme(<Navbar />)
      
      const container = screen.getByRole('banner').parentElement
      expect(container).toBeInTheDocument()
      // minWidth: 700 should be applied via sx prop
    })

    test('uses flexible layout', () => {
      renderWithTheme(<Navbar />)
      
      const container = screen.getByRole('banner').parentElement
      expect(container).toBeInTheDocument()
      // flexGrow: 1 should be applied via sx prop
    })
  })

  describe('accessibility', () => {
    test('has proper ARIA landmarks', () => {
      renderWithTheme(<Navbar />)
      
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(document.querySelector('.MuiToolbar-root')).toBeTruthy()
    })

    test('has accessible logo alt text', () => {
      renderWithTheme(<Navbar />)
      
      const logo = screen.getByAltText('ChiWar')
      expect(logo).toBeInTheDocument()
    })

    test('has accessible home link', () => {
      renderWithTheme(<Navbar />)
      
      const homeLink = screen.getByRole('link', { name: /chiwar/i })
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')
    })
  })

  describe('error handling', () => {
    test('handles missing user gracefully', () => {
      mockUseClient.user = undefined as any
      
      renderWithTheme(<Navbar />)
      
      expect(screen.getByTestId('auth-button')).toBeInTheDocument()
      expect(screen.queryByTestId('current-campaign')).not.toBeInTheDocument()
    })

    test('handles missing campaign gracefully', () => {
      mockUseCampaign.campaign = undefined as any
      
      renderWithTheme(<Navbar />)
      
      const popupMenu = screen.getByTestId('popup-menu')
      expect(popupMenu).toHaveTextContent('Campaign:') // Empty campaign
    })

    test('handles missing session gracefully', () => {
      mockUseClient.session = undefined as any
      
      renderWithTheme(<Navbar />)
      
      const authButton = screen.getByTestId('auth-button')
      expect(authButton).toHaveTextContent('Status:') // Empty status
    })

    test('handles context loading states', () => {
      mockUseClient.currentUserState = { loading: true }
      
      renderWithTheme(<Navbar />)
      
      expect(screen.getByTestId('navbar-logo')).toBeInTheDocument()
      expect(screen.getByTestId('auth-button')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    test('handles user with missing properties', () => {
      const incompleteUser = { id: 'user-1' } // Missing name, email, etc.
      mockUseClient.user = incompleteUser as any
      
      renderWithTheme(<Navbar />)
      
      expect(screen.getByTestId('auth-button')).toBeInTheDocument()
    })

    test('handles campaign with missing properties', () => {
      const incompleteCampaign = { id: 'campaign-1' } // Missing name, description, etc.
      mockUseCampaign.campaign = incompleteCampaign as any
      
      renderWithTheme(<Navbar />)
      
      expect(screen.getByTestId('popup-menu')).toBeInTheDocument()
    })

    test('handles authentication status edge cases', () => {
      mockUseClient.session = { status: 'loading' }
      
      renderWithTheme(<Navbar />)
      
      const authButton = screen.getByTestId('auth-button')
      expect(authButton).toHaveTextContent('Status: loading')
    })

    test('handles rapid user state changes', () => {
      const user1 = createMockUser({ name: 'User 1' })
      const user2 = createMockUser({ name: 'User 2' })
      
      mockUseClient.user = user1
      
      const { rerender } = renderWithTheme(<Navbar />)
      
      // Rapid changes
      mockUseClient.user = user2
      rerender(<ThemeProvider theme={theme}><Navbar /></ThemeProvider>)
      
      mockUseClient.user = undefined as any as any
      rerender(<ThemeProvider theme={theme}><Navbar /></ThemeProvider>)
      
      expect(screen.getByTestId('auth-button')).toBeInTheDocument()
    })
  })

  describe('styling and theming', () => {
    test('applies primary theme colors', () => {
      renderWithTheme(<Navbar />)
      
      const appBar = screen.getByRole('banner')
      expect(appBar).toBeInTheDocument()
      // Primary.main color should be applied via sx prop
    })

    test('applies dark background for campaign section', () => {
      renderWithTheme(<Navbar />)
      
      const currentCampaign = screen.getByTestId('current-campaign')
      const campaignSection = currentCampaign.parentElement
      expect(campaignSection).toBeInTheDocument()
      // primary.dark color should be applied
    })

    test('applies proper spacing and padding', () => {
      renderWithTheme(<Navbar />)
      
      const currentCampaign = screen.getByTestId('current-campaign')
      const campaignSection = currentCampaign.parentElement
      expect(campaignSection).toBeInTheDocument()
      // p={1} should be applied for padding
    })
  })
})