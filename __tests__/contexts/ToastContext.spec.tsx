import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { ToastProvider, useToast } from '../../contexts/ToastContext'

// Test component that uses the toast context
const TestComponent = () => {
  const { toast, toastSuccess, toastError, toastInfo, toastWarning, closeToast } = useToast()

  return (
    <div>
      <div data-testid="toast-open">{toast.open.toString()}</div>
      <div data-testid="toast-message">{toast.message}</div>
      <div data-testid="toast-severity">{toast.severity}</div>
      
      <button data-testid="success-button" onClick={() => toastSuccess('Success message')}>
        Show Success
      </button>
      <button data-testid="error-button" onClick={() => toastError('Error message')}>
        Show Error
      </button>
      <button data-testid="error-default-button" onClick={() => toastError()}>
        Show Default Error
      </button>
      <button data-testid="info-button" onClick={() => toastInfo('Info message')}>
        Show Info
      </button>
      <button data-testid="warning-button" onClick={() => toastWarning('Warning message')}>
        Show Warning
      </button>
      <button data-testid="close-button" onClick={closeToast}>
        Close Toast
      </button>
    </div>
  )
}

describe('ToastContext', () => {
  const renderWithProvider = () => {
    return render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    )
  }

  describe('initial state', () => {
    it('should start with closed toast', () => {
      renderWithProvider()
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('false')
      expect(screen.getByTestId('toast-message')).toHaveTextContent('')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('success')
    })
  })

  describe('toastSuccess', () => {
    it('should show success toast with correct message', () => {
      renderWithProvider()
      
      act(() => {
        screen.getByTestId('success-button').click()
      })
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('true')
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Success message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('success')
    })

    it('should handle empty success message', () => {
      const EmptySuccessTest = () => {
        const { toast, toastSuccess } = useToast()
        
        return (
          <div>
            <div data-testid="toast-message">{toast.message}</div>
            <div data-testid="toast-severity">{toast.severity}</div>
            <button data-testid="empty-success" onClick={() => toastSuccess('')}>
              Empty Success
            </button>
          </div>
        )
      }
      
      render(
        <ToastProvider>
          <EmptySuccessTest />
        </ToastProvider>
      )
      
      act(() => {
        screen.getByTestId('empty-success').click()
      })
      
      expect(screen.getByTestId('toast-message')).toHaveTextContent('')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('success')
    })
  })

  describe('toastError', () => {
    it('should show error toast with custom message', () => {
      renderWithProvider()
      
      act(() => {
        screen.getByTestId('error-button').click()
      })
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('true')
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Error message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('error')
    })

    it('should show default error message when no message provided', () => {
      renderWithProvider()
      
      act(() => {
        screen.getByTestId('error-default-button').click()
      })
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('true')
      expect(screen.getByTestId('toast-message')).toHaveTextContent('There was an error.')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('error')
    })

    it('should handle undefined message parameter', () => {
      const TestComponentWithUndefined = () => {
        const { toast, toastError } = useToast()
        
        return (
          <div>
            <div data-testid="toast-message">{toast.message}</div>
            <button data-testid="undefined-error" onClick={() => toastError(undefined)}>
              Show Undefined Error
            </button>
          </div>
        )
      }
      
      render(
        <ToastProvider>
          <TestComponentWithUndefined />
        </ToastProvider>
      )
      
      act(() => {
        screen.getByTestId('undefined-error').click()
      })
      
      expect(screen.getByTestId('toast-message')).toHaveTextContent('There was an error.')
    })
  })

  describe('toastInfo', () => {
    it('should show info toast with correct message', () => {
      renderWithProvider()
      
      act(() => {
        screen.getByTestId('info-button').click()
      })
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('true')
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Info message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('info')
    })

    it('should handle special characters in info message', () => {
      const TestComponentWithSpecialChars = () => {
        const { toast, toastInfo } = useToast()
        
        return (
          <div>
            <div data-testid="toast-message">{toast.message}</div>
            <button 
              data-testid="special-chars" 
              onClick={() => toastInfo('Info with special chars: !@#$%^&*()_+{}|:"<>?[]\\;\'./,`~')}
            >
              Special Chars
            </button>
          </div>
        )
      }
      
      render(
        <ToastProvider>
          <TestComponentWithSpecialChars />
        </ToastProvider>
      )
      
      act(() => {
        screen.getByTestId('special-chars').click()
      })
      
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Info with special chars: !@#$%^&*()_+{}|:"<>?[]\\;\'./,`~')
    })
  })

  describe('toastWarning', () => {
    it('should show warning toast with correct message', () => {
      renderWithProvider()
      
      act(() => {
        screen.getByTestId('warning-button').click()
      })
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('true')
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Warning message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('warning')
    })

    it('should handle long warning messages', () => {
      const longMessage = 'This is a very long warning message that contains a lot of text to test how the toast context handles longer content without breaking or causing issues with the state management system.'
      
      const TestComponentWithLongMessage = () => {
        const { toast, toastWarning } = useToast()
        
        return (
          <div>
            <div data-testid="toast-message">{toast.message}</div>
            <button data-testid="long-warning" onClick={() => toastWarning(longMessage)}>
              Long Warning
            </button>
          </div>
        )
      }
      
      render(
        <ToastProvider>
          <TestComponentWithLongMessage />
        </ToastProvider>
      )
      
      act(() => {
        screen.getByTestId('long-warning').click()
      })
      
      expect(screen.getByTestId('toast-message')).toHaveTextContent(longMessage)
    })
  })

  describe('closeToast', () => {
    it('should close an open toast', () => {
      renderWithProvider()
      
      // First open a toast
      act(() => {
        screen.getByTestId('success-button').click()
      })
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('true')
      
      // Then close it
      act(() => {
        screen.getByTestId('close-button').click()
      })
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('false')
      // Message and severity should remain unchanged
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Success message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('success')
    })

    it('should handle closing already closed toast', () => {
      renderWithProvider()
      
      // Toast starts closed, close it again
      act(() => {
        screen.getByTestId('close-button').click()
      })
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('false')
    })
  })

  describe('toast state persistence', () => {
    it('should maintain message and severity after closing', () => {
      renderWithProvider()
      
      // Show error toast
      act(() => {
        screen.getByTestId('error-button').click()
      })
      
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Error message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('error')
      
      // Close toast
      act(() => {
        screen.getByTestId('close-button').click()
      })
      
      // Message and severity should persist
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Error message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('error')
      expect(screen.getByTestId('toast-open')).toHaveTextContent('false')
    })

    it('should overwrite previous toast when new one is shown', () => {
      renderWithProvider()
      
      // Show success toast
      act(() => {
        screen.getByTestId('success-button').click()
      })
      
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Success message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('success')
      
      // Show warning toast (should overwrite)
      act(() => {
        screen.getByTestId('warning-button').click()
      })
      
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Warning message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('warning')
      expect(screen.getByTestId('toast-open')).toHaveTextContent('true')
    })
  })

  describe('multiple toast operations', () => {
    it('should handle rapid successive toast operations', () => {
      renderWithProvider()
      
      act(() => {
        screen.getByTestId('success-button').click()
        screen.getByTestId('close-button').click()
        screen.getByTestId('error-button').click()
        screen.getByTestId('close-button').click()
        screen.getByTestId('info-button').click()
      })
      
      expect(screen.getByTestId('toast-open')).toHaveTextContent('true')
      expect(screen.getByTestId('toast-message')).toHaveTextContent('Info message')
      expect(screen.getByTestId('toast-severity')).toHaveTextContent('info')
    })
  })

  describe('context provider behavior', () => {
    it('should provide default values when used outside provider', () => {
      // This test simulates using useToast outside of ToastProvider
      const IsolatedComponent = () => {
        try {
          const { toast } = useToast()
          return <div data-testid="isolated-toast">{toast.message}</div>
        } catch (error) {
          return <div data-testid="error">Context error</div>
        }
      }
      
      // Render without provider (should use default context)
      render(<IsolatedComponent />)
      
      expect(screen.getByTestId('isolated-toast')).toHaveTextContent('')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string messages for all toast types', () => {
      const EmptyMessageTest = () => {
        const { toast, toastSuccess, toastError, toastInfo, toastWarning } = useToast()
        
        return (
          <div>
            <div data-testid="toast-message">{toast.message}</div>
            <button data-testid="empty-success" onClick={() => toastSuccess('')}>Empty Success</button>
            <button data-testid="empty-info" onClick={() => toastInfo('')}>Empty Info</button>
            <button data-testid="empty-warning" onClick={() => toastWarning('')}>Empty Warning</button>
          </div>
        )
      }
      
      render(
        <ToastProvider>
          <EmptyMessageTest />
        </ToastProvider>
      )
      
      act(() => {
        screen.getByTestId('empty-success').click()
      })
      expect(screen.getByTestId('toast-message')).toHaveTextContent('')
      
      act(() => {
        screen.getByTestId('empty-info').click()
      })
      expect(screen.getByTestId('toast-message')).toHaveTextContent('')
      
      act(() => {
        screen.getByTestId('empty-warning').click()
      })
      expect(screen.getByTestId('toast-message')).toHaveTextContent('')
    })
  })
})