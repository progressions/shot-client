import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AuthButton from '../../../components/navbar/AuthButton'
import { signIn, signOut } from 'next-auth/react'
import { User } from '../../../types/types'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn()
}))

// Mock UserAvatar component
jest.mock('../../../components/UserAvatar', () => {
  return function MockUserAvatar({ user, href, tooltip }: any) {
    return (
      <div data-testid="user-avatar" data-href={href} title={tooltip}>
        {user?.name || 'User Avatar'}
      </div>
    )
  }
})

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>

describe('AuthButton', () => {
  const mockUser: User = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com'
  } as User

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when authenticated', () => {
    it('should render logout button and user avatar', () => {
      render(<AuthButton status="authenticated" user={mockUser} />)
      
      expect(screen.getByText('Logout')).toBeInTheDocument()
      expect(screen.getByTestId('user-avatar')).toBeInTheDocument()
      expect(screen.getByTestId('user-avatar')).toHaveAttribute('data-href', '/profile')
      expect(screen.getByTestId('user-avatar')).toHaveAttribute('title', 'Open profile')
    })

    it('should call signOut when logout button is clicked', () => {
      render(<AuthButton status="authenticated" user={mockUser} />)
      
      const logoutButton = screen.getByText('Logout')
      fireEvent.click(logoutButton)
      
      expect(mockSignOut).toHaveBeenCalledWith({ redirect: false })
    })

    it('should pass user to UserAvatar component', () => {
      render(<AuthButton status="authenticated" user={mockUser} />)
      
      const userAvatar = screen.getByTestId('user-avatar')
      expect(userAvatar).toHaveTextContent('Test User')
    })

    it('should not render sign in/sign up buttons when authenticated', () => {
      render(<AuthButton status="authenticated" user={mockUser} />)
      
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
    })
  })

  describe('when not authenticated', () => {
    it('should render sign in and sign up buttons', () => {
      render(<AuthButton status="loading" user={null as any} />)
      
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
    })

    it('should call signIn when sign in button is clicked', () => {
      render(<AuthButton status="unauthenticated" user={null as any} />)
      
      const signInButton = screen.getByText('Sign In')
      fireEvent.click(signInButton)
      
      expect(mockSignIn).toHaveBeenCalledTimes(1)
    })

    it('should have correct href for sign up button', () => {
      render(<AuthButton status="unauthenticated" user={null as any} />)
      
      const signUpButton = screen.getByText('Sign Up')
      expect(signUpButton.closest('a')).toHaveAttribute('href', '/auth/signup')
    })

    it('should not render logout button when not authenticated', () => {
      render(<AuthButton status="unauthenticated" user={null as any} />)
      
      expect(screen.queryByText('Logout')).not.toBeInTheDocument()
      expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument()
    })

    it('should handle loading status correctly', () => {
      render(<AuthButton status="loading" user={null as any} />)
      
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
      expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle null user when authenticated', () => {
      render(<AuthButton status="authenticated" user={null as any} />)
      
      expect(screen.getByText('Logout')).toBeInTheDocument()
      expect(screen.getByTestId('user-avatar')).toBeInTheDocument()
    })

    it('should handle undefined status', () => {
      render(<AuthButton status={undefined as any} user={mockUser} />)
      
      // Should render unauthenticated state by default
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
    })

    it('should handle empty status', () => {
      render(<AuthButton status="" user={mockUser} />)
      
      // Should render unauthenticated state by default
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
    })

    it('should handle unknown status', () => {
      render(<AuthButton status="unknown" user={mockUser} />)
      
      // Should render unauthenticated state by default
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper button roles when authenticated', () => {
      render(<AuthButton status="authenticated" user={mockUser} />)
      
      const logoutButton = screen.getByRole('button', { name: 'Logout' })
      expect(logoutButton).toBeInTheDocument()
    })

    it('should have proper button and link roles when not authenticated', () => {
      render(<AuthButton status="unauthenticated" user={null as any} />)
      
      const signInButton = screen.getByRole('button', { name: 'Sign In' })
      const signUpLink = screen.getByRole('link', { name: 'Sign Up' })
      
      expect(signInButton).toBeInTheDocument()
      expect(signUpLink).toBeInTheDocument()
    })

    it('should have proper link for sign up', () => {
      render(<AuthButton status="unauthenticated" user={null as any} />)
      
      // Sign up button should be wrapped in a link
      const signUpButton = screen.getByText('Sign Up')
      const link = signUpButton.closest('a')
      expect(link).toHaveAttribute('href', '/auth/signup')
    })
  })

  describe('integration with UserAvatar', () => {
    it('should pass correct props to UserAvatar', () => {
      render(<AuthButton status="authenticated" user={mockUser} />)
      
      const userAvatar = screen.getByTestId('user-avatar')
      expect(userAvatar).toHaveAttribute('data-href', '/profile')
      expect(userAvatar).toHaveAttribute('title', 'Open profile')
    })

    it('should render UserAvatar with user data', () => {
      const userWithLongName = { ...mockUser, name: 'John Michael Smith' }
      render(<AuthButton status="authenticated" user={userWithLongName} />)
      
      const userAvatar = screen.getByTestId('user-avatar')
      expect(userAvatar).toHaveTextContent('John Michael Smith')
    })
  })
})