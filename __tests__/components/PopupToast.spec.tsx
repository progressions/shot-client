import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PopupToast from '../../components/PopupToast'
import * as ToastContext from '../../contexts/ToastContext'

// Mock the ToastContext
jest.mock('../../contexts/ToastContext')

const mockUseToast = ToastContext.useToast as jest.MockedFunction<typeof ToastContext.useToast>

describe('PopupToast', () => {
  const mockCloseToast = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not display alert when toast is closed', () => {
    mockUseToast.mockReturnValue({
      toast: { 
        open: false, 
        message: 'Hidden message', 
        severity: 'info' 
      },
      closeToast: mockCloseToast,
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
      toastInfo: jest.fn(),
      toastWarning: jest.fn()
    })

    render(<PopupToast />)
    
    // When closed, the alert message should not be visible
    expect(screen.queryByText('Hidden message')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should display success message when toast is open', () => {
    mockUseToast.mockReturnValue({
      toast: { 
        open: true, 
        message: 'Operation successful!', 
        severity: 'success' 
      },
      closeToast: mockCloseToast,
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
      toastInfo: jest.fn(),
      toastWarning: jest.fn()
    })

    render(<PopupToast />)
    
    expect(screen.getByText('Operation successful!')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardSuccess')
  })

  it('should display error message with error severity', () => {
    mockUseToast.mockReturnValue({
      toast: { 
        open: true, 
        message: 'Something went wrong!', 
        severity: 'error' 
      },
      closeToast: mockCloseToast,
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
      toastInfo: jest.fn(),
      toastWarning: jest.fn()
    })

    render(<PopupToast />)
    
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardError')
  })

  it('should display warning message with warning severity', () => {
    mockUseToast.mockReturnValue({
      toast: { 
        open: true, 
        message: 'Please be careful!', 
        severity: 'warning' 
      },
      closeToast: mockCloseToast,
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
      toastInfo: jest.fn(),
      toastWarning: jest.fn()
    })

    render(<PopupToast />)
    
    expect(screen.getByText('Please be careful!')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardWarning')
  })

  it('should display info message with info severity', () => {
    mockUseToast.mockReturnValue({
      toast: { 
        open: true, 
        message: 'Here is some information', 
        severity: 'info' 
      },
      closeToast: mockCloseToast,
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
      toastInfo: jest.fn(),
      toastWarning: jest.fn()
    })

    render(<PopupToast />)
    
    expect(screen.getByText('Here is some information')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-standardInfo')
  })

  it('should call closeToast when Snackbar onClose is triggered', () => {
    mockUseToast.mockReturnValue({
      toast: { 
        open: true, 
        message: 'Test message', 
        severity: 'info' 
      },
      closeToast: mockCloseToast,
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
      toastInfo: jest.fn(),
      toastWarning: jest.fn()
    })

    render(<PopupToast />)
    
    // Snackbar will call onClose after autoHideDuration or when Escape is pressed
    // Simulate escape key press to trigger onClose
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    
    expect(mockCloseToast).toHaveBeenCalledTimes(1)
  })

  it('should render Snackbar and Alert components', () => {
    mockUseToast.mockReturnValue({
      toast: { 
        open: true, 
        message: 'Test message', 
        severity: 'info' 
      },
      closeToast: mockCloseToast,
      toastSuccess: jest.fn(),
      toastError: jest.fn(),
      toastInfo: jest.fn(),
      toastWarning: jest.fn()
    })

    render(<PopupToast />)
    
    // Check that Snackbar container is present
    const snackbar = document.querySelector('.MuiSnackbar-root')
    expect(snackbar).toBeInTheDocument()
    
    // Check that Alert component is present
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})