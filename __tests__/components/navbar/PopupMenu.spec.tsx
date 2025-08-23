import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import PopupMenu from '../../../components/navbar/PopupMenu'
import { defaultCampaign, defaultUser } from '../../../types/types'
import type { Campaign, User } from '../../../types/types'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn()
}))

// Mock material-ui-popup-state
jest.mock('material-ui-popup-state', () => ({
  __esModule: true,
  default: ({ children }: { children: (popupState: any) => React.ReactNode }) => {
    const mockPopupState = {
      open: true, // Always show menu items for testing
      close: jest.fn(),
      toggle: jest.fn()
    }
    return <>{children(mockPopupState)}</>
  },
  bindTrigger: (popupState: any) => ({
    'data-testid': 'menu-trigger',
    onClick: popupState.toggle
  }),
  bindMenu: (popupState: any) => ({
    'data-testid': 'popup-menu',
    open: true, // Always show for testing
    onClose: popupState.close
  })
}))

import { signIn, signOut } from 'next-auth/react'

describe('PopupMenu', () => {
  const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
  const mockSignOut = signOut as jest.MockedFunction<typeof signOut>

  const mockUser: User = {
    ...defaultUser,
    id: 'user-123',
    email: 'test@example.com',
    admin: false
  }

  const mockAdminUser: User = {
    ...defaultUser,
    id: 'admin-123',
    email: 'admin@example.com',
    admin: true
  }

  const mockCampaign: Campaign = {
    ...defaultCampaign,
    id: 'campaign-123',
    name: 'Test Campaign'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render menu trigger button', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      const menuButton = screen.getByTestId('menu-trigger')
      expect(menuButton).toBeInTheDocument()
      expect(menuButton).toHaveAttribute('aria-label', 'menu')
    })

    it('should render MenuIcon in trigger button', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      const menuIcon = screen.getByTestId('MenuIcon')
      expect(menuIcon).toBeInTheDocument()
    })

    it('should render popup menu', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      const menu = screen.getByTestId('popup-menu')
      expect(menu).toBeInTheDocument()
    })
  })

  describe('menu items for authenticated user with campaign', () => {
    it('should render all campaign-related menu items', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      expect(screen.getByText('Campaigns')).toBeInTheDocument()
      expect(screen.getByText('Fights')).toBeInTheDocument()
      expect(screen.getByText('Characters')).toBeInTheDocument()
      expect(screen.getByText('Sites')).toBeInTheDocument()
      expect(screen.getByText('Factions')).toBeInTheDocument()
      expect(screen.getByText('Junctures')).toBeInTheDocument()
      expect(screen.getByText('Parties')).toBeInTheDocument()
      expect(screen.getByText('Weapons')).toBeInTheDocument()
      expect(screen.getByText('Schticks')).toBeInTheDocument()
    })

    it('should render correct links for all menu items', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      expect(screen.getByRole('link', { name: 'Campaigns' })).toHaveAttribute('href', '/campaigns')
      expect(screen.getByRole('link', { name: 'Fights' })).toHaveAttribute('href', '/')
      expect(screen.getByRole('link', { name: 'Characters' })).toHaveAttribute('href', '/characters')
      expect(screen.getByRole('link', { name: 'Sites' })).toHaveAttribute('href', '/sites')
      expect(screen.getByRole('link', { name: 'Factions' })).toHaveAttribute('href', '/factions')
      expect(screen.getByRole('link', { name: 'Junctures' })).toHaveAttribute('href', '/junctures')
      expect(screen.getByRole('link', { name: 'Parties' })).toHaveAttribute('href', '/parties')
      expect(screen.getByRole('link', { name: 'Weapons' })).toHaveAttribute('href', '/weapons')
      expect(screen.getByRole('link', { name: 'Schticks' })).toHaveAttribute('href', '/schticks')
    })

    it('should not render admin-only menu items for regular user', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
    })

    it('should not render sign in for authenticated user', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
    })
  })

  describe('menu items for admin user', () => {
    it('should render admin menu items for admin user', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockAdminUser} />)
      
      expect(screen.getByText('Users')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('href', '/admin/users')
    })
  })

  describe('menu items for user without campaign', () => {
    it('should only render campaigns link when no campaign', () => {
      render(<PopupMenu campaign={null} user={mockUser} />)
      
      expect(screen.getByText('Campaigns')).toBeInTheDocument()
      expect(screen.queryByText('Fights')).not.toBeInTheDocument()
      expect(screen.queryByText('Characters')).not.toBeInTheDocument()
      expect(screen.queryByText('Sites')).not.toBeInTheDocument()
    })

    it('should render campaigns link when campaign has no id', () => {
      const campaignWithoutId = { ...mockCampaign, id: '' }
      
      render(<PopupMenu campaign={campaignWithoutId} user={mockUser} />)
      
      expect(screen.getByText('Campaigns')).toBeInTheDocument()
      expect(screen.queryByText('Fights')).not.toBeInTheDocument()
    })
  })

  describe('menu items for unauthenticated user', () => {
    it('should render sign in for unauthenticated user', () => {
      const unauthenticatedUser = { ...defaultUser, id: undefined }
      
      render(<PopupMenu campaign={null} user={unauthenticatedUser} />)
      
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      // Note: The Campaigns link still appears because the condition is { user && ... }, not { user?.id && ... }
      expect(screen.getByText('Campaigns')).toBeInTheDocument()
    })

    it('should call signIn when sign in is clicked', () => {
      const unauthenticatedUser = { ...defaultUser, id: undefined }
      
      render(<PopupMenu campaign={null} user={unauthenticatedUser} />)
      
      const signInItem = screen.getByText('Sign In')
      fireEvent.click(signInItem)
      
      expect(mockSignIn).toHaveBeenCalledTimes(1)
    })
  })

  describe('conditional rendering logic', () => {
    it('should handle null user gracefully', () => {
      render(<PopupMenu campaign={mockCampaign} user={null as any} />)
      
      expect(screen.getByTestId('menu-trigger')).toBeInTheDocument()
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })

    it('should handle user without id', () => {
      const userWithoutId = { ...mockUser, id: undefined }
      
      render(<PopupMenu campaign={mockCampaign} user={userWithoutId} />)
      
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      // Note: The Campaigns link still appears because the condition is { user && ... }, not { user?.id && ... }
      expect(screen.getByText('Campaigns')).toBeInTheDocument()
    })

    it('should handle campaign with empty id', () => {
      const emptyCampaign = { ...mockCampaign, id: '' }
      
      render(<PopupMenu campaign={emptyCampaign} user={mockUser} />)
      
      expect(screen.getByText('Campaigns')).toBeInTheDocument()
      expect(screen.queryByText('Fights')).not.toBeInTheDocument()
    })
  })

  describe('link styling', () => {
    it('should render links with correct href attributes', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      const campaignsLink = screen.getByRole('link', { name: 'Campaigns' })
      expect(campaignsLink).toHaveAttribute('href', '/campaigns')
      
      const fightsLink = screen.getByRole('link', { name: 'Fights' })
      expect(fightsLink).toHaveAttribute('href', '/')
    })
  })

  describe('Material-UI components', () => {
    it('should render with Material-UI IconButton', () => {
      const { container } = render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      const iconButton = container.querySelector('.MuiIconButton-root')
      expect(iconButton).toBeInTheDocument()
    })

    it('should render MenuItems for each navigation option', () => {
      const { container } = render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      const menuItems = screen.getAllByRole('menuitem')
      expect(menuItems.length).toBeGreaterThan(0)
    })

    it('should have proper Material-UI Menu structure', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      // Check that the menu is rendered via the popup menu test id
      const menu = screen.getByTestId('popup-menu')
      expect(menu).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper aria labels on menu button', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      const menuButton = screen.getByTestId('menu-trigger')
      expect(menuButton).toHaveAttribute('aria-label', 'menu')
    })

    it('should render accessible links', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })

    it('should render accessible menu button', () => {
      render(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      const button = screen.getByTestId('menu-trigger')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'button')
    })
  })

  describe('edge cases', () => {
    it('should handle user with admin false explicitly', () => {
      const nonAdminUser = { ...mockUser, admin: false }
      
      render(<PopupMenu campaign={mockCampaign} user={nonAdminUser} />)
      
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
    })

    it('should handle undefined admin property', () => {
      const userWithUndefinedAdmin = { ...mockUser, admin: undefined as any }
      
      render(<PopupMenu campaign={mockCampaign} user={userWithUndefinedAdmin} />)
      
      expect(screen.queryByText('Users')).not.toBeInTheDocument()
    })

    it('should handle campaign and user prop changes', () => {
      const { rerender } = render(<PopupMenu campaign={null} user={mockUser} />)
      
      expect(screen.getByText('Campaigns')).toBeInTheDocument()
      expect(screen.queryByText('Fights')).not.toBeInTheDocument()
      
      rerender(<PopupMenu campaign={mockCampaign} user={mockUser} />)
      
      expect(screen.getByText('Fights')).toBeInTheDocument()
      expect(screen.getByText('Characters')).toBeInTheDocument()
    })
  })
})