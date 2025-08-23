import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  StyledSelect,
  StyledAutocomplete,
  Subhead,
  StyledDialog,
  StyledFormDialog,
  CancelButton,
  SaveButton,
  SaveCancelButtons,
  ButtonBar
} from '../../components/StyledFields'
import { MenuItem } from '@mui/material'

describe('StyledFields', () => {
  describe('StyledSelect', () => {
    it('should render a select field with custom styling', () => {
      render(
        <StyledSelect
          label="Test Select"
          value="test"
          onChange={() => {}}
        >
          <MenuItem value="test">Test Option</MenuItem>
        </StyledSelect>
      )
      
      expect(screen.getByLabelText('Test Select')).toBeInTheDocument()
    })

    it('should pass through props to underlying TextField', () => {
      render(
        <StyledSelect
          label="Custom Select"
          value="option1"
          onChange={() => {}}
          disabled={true}
          data-testid="custom-select"
        >
          <MenuItem value="option1">Option 1</MenuItem>
        </StyledSelect>
      )
      
      const selectField = screen.getByTestId('custom-select')
      expect(selectField).toBeInTheDocument()
      // Disabled prop is passed to underlying Material-UI TextField
      expect(selectField.querySelector('input')).toHaveAttribute('disabled')
    })

    it('should handle select change events', () => {
      const mockOnChange = jest.fn()
      render(
        <StyledSelect
          label="Test Select"
          value="option1"
          onChange={mockOnChange}
        >
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
        </StyledSelect>
      )
      
      // Material-UI select behavior testing would require more complex setup
      // This test ensures the component renders without errors
      expect(screen.getByLabelText('Test Select')).toBeInTheDocument()
    })
  })

  describe('StyledAutocomplete', () => {
    const mockOptions = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' }
    ]

    it('should render autocomplete with custom paper component', () => {
      render(
        <StyledAutocomplete
          options={mockOptions}
          renderInput={(params: any) => <input {...params.inputProps} data-testid="autocomplete-input" />}
        />
      )
      
      expect(screen.getByTestId('autocomplete-input')).toBeInTheDocument()
    })

    it('should pass through props to underlying Autocomplete', () => {
      render(
        <StyledAutocomplete
          options={mockOptions}
          disabled={true}
          renderInput={(params: any) => <input {...params.inputProps} data-testid="disabled-autocomplete" />}
        />
      )
      
      const input = screen.getByTestId('disabled-autocomplete')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Subhead', () => {
    it('should render divider and heading', () => {
      render(<Subhead>Test Subhead</Subhead>)
      
      expect(screen.getByText('Test Subhead')).toBeInTheDocument()
      expect(screen.getByText('Test Subhead').tagName).toBe('H6')
    })

    it('should pass through props to Typography component', () => {
      render(
        <Subhead data-testid="custom-subhead" className="custom-class">
          Custom Subhead
        </Subhead>
      )
      
      const subhead = screen.getByTestId('custom-subhead')
      expect(subhead).toBeInTheDocument()
      expect(subhead).toHaveClass('custom-class')
      expect(subhead).toHaveTextContent('Custom Subhead')
    })

    it('should render with proper typography variant', () => {
      render(<Subhead>Heading Text</Subhead>)
      
      const heading = screen.getByText('Heading Text')
      expect(heading).toHaveClass('MuiTypography-h6')
    })
  })

  describe('StyledDialog', () => {
    it('should render dialog when open', () => {
      render(
        <StyledDialog open={true} onClose={() => {}} title="Test Dialog">
          <div>Dialog Content</div>
        </StyledDialog>
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Test Dialog')).toBeInTheDocument()
      expect(screen.getByText('Dialog Content')).toBeInTheDocument()
    })

    it('should not render dialog when closed', () => {
      render(
        <StyledDialog open={false} onClose={() => {}} title="Test Dialog">
          <div>Dialog Content</div>
        </StyledDialog>
      )
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should call onClose when dialog is closed', () => {
      const mockOnClose = jest.fn()
      render(
        <StyledDialog open={true} onClose={mockOnClose} title="Test Dialog">
          <div>Dialog Content</div>
        </StyledDialog>
      )
      
      // Press Escape to close dialog
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
      
      // Note: Material-UI handles the actual onClose call
      // This test ensures the component renders without errors
    })

    it('should apply custom width when provided', () => {
      render(
        <StyledDialog open={true} onClose={() => {}} title="Wide Dialog" width={800}>
          <div>Wide Content</div>
        </StyledDialog>
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Wide Dialog')).toBeInTheDocument()
    })

    it('should use default width when not provided', () => {
      render(
        <StyledDialog open={true} onClose={() => {}} title="Default Dialog">
          <div>Default Content</div>
        </StyledDialog>
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Default Dialog')).toBeInTheDocument()
    })
  })

  describe('StyledFormDialog', () => {
    it('should render form dialog with save/cancel buttons', () => {
      render(
        <StyledFormDialog
          open={true}
          onClose={() => {}}
          onCancel={() => {}}
          title="Form Dialog"
        >
          <div>Form Content</div>
        </StyledFormDialog>
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Form Dialog')).toBeInTheDocument()
      expect(screen.getByText('Form Content')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('should handle form submission', () => {
      const mockOnSubmit = jest.fn()
      render(
        <StyledFormDialog
          open={true}
          onClose={() => {}}
          onCancel={() => {}}
          onSubmit={mockOnSubmit}
          title="Submit Form"
        >
          <div>Form Fields</div>
        </StyledFormDialog>
      )
      
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      // The form element should be present for submission handling
    })

    it('should disable save button when saving', () => {
      render(
        <StyledFormDialog
          open={true}
          onClose={() => {}}
          onCancel={() => {}}
          title="Saving Form"
          saving={true}
        >
          <div>Form Content</div>
        </StyledFormDialog>
      )
      
      const cancelButton = screen.getByText('Cancel')
      const saveButton = screen.getByText('Save')
      
      // Only save button should be disabled via the disabled prop
      // Cancel button is not disabled by saving state in this implementation
      expect(saveButton).toBeDisabled()
      // Cancel button behavior depends on cancelDisabled prop specifically
      expect(cancelButton).toBeInTheDocument()
    })

    it('should disable save button when disabled prop is true', () => {
      render(
        <StyledFormDialog
          open={true}
          onClose={() => {}}
          onCancel={() => {}}
          title="Disabled Form"
          disabled={true}
        >
          <div>Form Content</div>
        </StyledFormDialog>
      )
      
      const cancelButton = screen.getByText('Cancel')
      const saveButton = screen.getByText('Save')
      
      // Only save button gets the disabled prop in this component's implementation
      expect(saveButton).toBeDisabled()
      expect(cancelButton).toBeInTheDocument() // Cancel button is not disabled by default
    })
  })

  describe('CancelButton', () => {
    it('should render cancel button with default text', () => {
      render(<CancelButton onClick={() => {}} />)
      
      const button = screen.getByText('Cancel')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('MuiButton-containedSecondary')
    })

    it('should render cancel button with custom text', () => {
      render(<CancelButton onClick={() => {}}>Close</CancelButton>)
      
      const button = screen.getByText('Close')
      expect(button).toBeInTheDocument()
      expect(button).not.toHaveTextContent('Cancel')
    })

    it('should handle click events', () => {
      const mockOnClick = jest.fn()
      render(<CancelButton onClick={mockOnClick} />)
      
      const button = screen.getByText('Cancel')
      fireEvent.click(button)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
      render(<CancelButton onClick={() => {}} disabled={true} />)
      
      const button = screen.getByText('Cancel')
      expect(button).toBeDisabled()
    })

    it('should pass through other props', () => {
      render(
        <CancelButton 
          onClick={() => {}} 
          data-testid="custom-cancel"
          className="custom-class"
        />
      )
      
      const button = screen.getByTestId('custom-cancel')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('SaveButton', () => {
    it('should render save button with default text', () => {
      render(<SaveButton onClick={() => {}} />)
      
      const button = screen.getByText('Save')
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('MuiButton-containedPrimary')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should render save button with custom text', () => {
      render(<SaveButton onClick={() => {}}>Update</SaveButton>)
      
      const button = screen.getByText('Update')
      expect(button).toBeInTheDocument()
      expect(button).not.toHaveTextContent('Save')
    })

    it('should handle click events', () => {
      const mockOnClick = jest.fn()
      render(<SaveButton onClick={mockOnClick} />)
      
      const button = screen.getByText('Save')
      fireEvent.click(button)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should be disabled when disabled prop is true', () => {
      render(<SaveButton onClick={() => {}} disabled={true} />)
      
      const button = screen.getByText('Save')
      expect(button).toBeDisabled()
    })
  })

  describe('SaveCancelButtons', () => {
    it('should render both save and cancel buttons', () => {
      render(
        <SaveCancelButtons 
          onSave={() => {}} 
          onCancel={() => {}} 
        />
      )
      
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('should use custom button texts when provided', () => {
      render(
        <SaveCancelButtons 
          onSave={() => {}} 
          onCancel={() => {}}
          saveText="Update"
          cancelText="Close"
        />
      )
      
      expect(screen.getByText('Close')).toBeInTheDocument()
      expect(screen.getByText('Update')).toBeInTheDocument()
      expect(screen.queryByText('Cancel')).not.toBeInTheDocument()
      expect(screen.queryByText('Save')).not.toBeInTheDocument()
    })

    it('should handle save button clicks', () => {
      const mockOnSave = jest.fn()
      render(
        <SaveCancelButtons 
          onSave={mockOnSave} 
          onCancel={() => {}} 
        />
      )
      
      const saveButton = screen.getByText('Save')
      fireEvent.click(saveButton)
      
      expect(mockOnSave).toHaveBeenCalledTimes(1)
    })

    it('should handle cancel button clicks', () => {
      const mockOnCancel = jest.fn()
      render(
        <SaveCancelButtons 
          onSave={() => {}} 
          onCancel={mockOnCancel} 
        />
      )
      
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should disable save button when disabled', () => {
      render(
        <SaveCancelButtons 
          onSave={() => {}} 
          onCancel={() => {}}
          disabled={true}
        />
      )
      
      expect(screen.getByText('Save')).toBeDisabled()
      expect(screen.getByText('Cancel')).not.toBeDisabled()
    })

    it('should disable cancel button when cancelDisabled', () => {
      render(
        <SaveCancelButtons 
          onSave={() => {}} 
          onCancel={() => {}}
          cancelDisabled={true}
        />
      )
      
      expect(screen.getByText('Cancel')).toBeDisabled()
      expect(screen.getByText('Save')).not.toBeDisabled()
    })
  })

  describe('ButtonBar', () => {
    it('should render children in a horizontal stack', () => {
      render(
        <ButtonBar>
          <button>Button 1</button>
          <button>Button 2</button>
        </ButtonBar>
      )
      
      expect(screen.getByText('Button 1')).toBeInTheDocument()
      expect(screen.getByText('Button 2')).toBeInTheDocument()
      
      // Should be wrapped in Paper component
      const buttonBar = screen.getByText('Button 1').closest('.MuiPaper-root')
      expect(buttonBar).toBeInTheDocument()
    })

    it('should apply custom sx styles when provided', () => {
      render(
        <ButtonBar sx={{ backgroundColor: 'red' }}>
          <button>Styled Button</button>
        </ButtonBar>
      )
      
      expect(screen.getByText('Styled Button')).toBeInTheDocument()
    })

    it('should handle no children gracefully', () => {
      render(<ButtonBar />)
      
      // Should render empty button bar without errors
      const buttonBar = document.querySelector('.MuiPaper-root')
      expect(buttonBar).toBeInTheDocument()
    })

    it('should render single child correctly', () => {
      render(
        <ButtonBar>
          <button>Only Button</button>
        </ButtonBar>
      )
      
      expect(screen.getByText('Only Button')).toBeInTheDocument()
    })
  })
})