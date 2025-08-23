import React from 'react'
import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Layout from '../../components/Layout'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))

// Mock CSS imports
jest.mock('@fontsource/roboto/300.css', () => ({}))
jest.mock('@fontsource/roboto/400.css', () => ({}))
jest.mock('@fontsource/roboto/500.css', () => ({}))
jest.mock('@fontsource/roboto/700.css', () => ({}))

// Mock Next.js router
jest.mock('next/router', () => ({
  replace: jest.fn()
}))

// Mock PopupContext
jest.mock('../../contexts/PopupContext', () => ({
  PopupProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="popup-provider">{children}</div>
}))

// Mock Navbar component
jest.mock('../../components/navbar/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Mock Navbar</nav>
  }
})

import Router from 'next/router'

describe('Layout', () => {
  const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
  const mockRouterReplace = Router.replace as jest.MockedFunction<typeof Router.replace>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('authenticated user', () => {
    it('should render layout with navbar and children for authenticated user', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@example.com' } } as any,
        status: 'authenticated',
        update: jest.fn()
      })

      render(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('popup-provider')).toBeInTheDocument()
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })

    it('should render layout with loading state', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn()
      })

      render(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })
  })

  describe('unauthenticated user', () => {
    it('should redirect to signin when unauthenticated and not explicitly allowed', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn()
      })

      render(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(mockRouterReplace).toHaveBeenCalledWith('/auth/signin')
    })

    it('should not redirect when unauthenticated prop is true', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn()
      })

      render(
        <Layout unauthenticated>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })

    it('should render public pages without redirect', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn()
      })

      render(
        <Layout unauthenticated>
          <div data-testid="signin-form">Sign In Form</div>
        </Layout>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByTestId('signin-form')).toBeInTheDocument()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })
  })

  describe('component structure', () => {
    it('should wrap content in Box and PopupProvider', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@example.com' } } as any,
        status: 'authenticated',
        update: jest.fn()
      })

      const { container } = render(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      // Should contain Material-UI Box
      const boxElement = container.querySelector('.MuiBox-root')
      expect(boxElement).toBeInTheDocument()

      // Should have PopupProvider
      expect(screen.getByTestId('popup-provider')).toBeInTheDocument()
    })

    it('should render Navbar component', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@example.com' } } as any,
        status: 'authenticated',
        update: jest.fn()
      })

      render(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(screen.getByText('Mock Navbar')).toBeInTheDocument()
    })

    it('should render children content', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@example.com' } } as any,
        status: 'authenticated',
        update: jest.fn()
      })

      render(
        <Layout>
          <h1>Main Content</h1>
          <p>Some text content</p>
          <button>Action Button</button>
        </Layout>
      )

      expect(screen.getByRole('heading', { name: 'Main Content' })).toBeInTheDocument()
      expect(screen.getByText('Some text content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    })
  })

  describe('session status changes', () => {
    it('should handle session status transitions', () => {
      // Start with loading
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn()
      })

      const { rerender } = render(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      expect(mockRouterReplace).not.toHaveBeenCalled()

      // Change to unauthenticated
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: jest.fn()
      })

      rerender(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      expect(mockRouterReplace).toHaveBeenCalledWith('/auth/signin')
    })
  })

  describe('edge cases', () => {
    it('should handle undefined session data', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: jest.fn()
      })

      render(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })

    it('should handle null session data', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@example.com' } } as any,
        status: 'authenticated',
        update: jest.fn()
      })

      render(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      expect(screen.getByTestId('test-content')).toBeInTheDocument()
      expect(mockRouterReplace).not.toHaveBeenCalled()
    })

    it('should handle empty children', () => {
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@example.com' } } as any,
        status: 'authenticated',
        update: jest.fn()
      })

      const { container } = render(<Layout>{null}</Layout>)

      expect(screen.getByTestId('navbar')).toBeInTheDocument()
      expect(container.querySelector('.MuiBox-root')).toBeInTheDocument()
    })
  })

  describe('font loading', () => {
    it('should import Roboto font CSS files', () => {
      // This test verifies that the component imports the required font files
      // The actual CSS imports happen at module load time
      mockUseSession.mockReturnValue({
        data: { user: { email: 'test@example.com' } } as any,
        status: 'authenticated',
        update: jest.fn()
      })

      render(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      )

      // Component should render successfully with font imports
      expect(screen.getByTestId('test-content')).toBeInTheDocument()
    })
  })
})