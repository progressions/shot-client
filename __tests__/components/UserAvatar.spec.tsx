import React from 'react'
import { render, screen } from '@testing-library/react'
import UserAvatar from '../../components/UserAvatar'
import { User } from '../../types/types'

describe('UserAvatar', () => {
  const mockUser: User = {
    id: 'user-1',
    first_name: 'John',
    last_name: 'Doe',
    image_url: 'https://example.com/avatar.jpg'
  } as User

  it('should render nothing when no user provided', () => {
    const { container } = render(<UserAvatar />)
    expect(container.firstChild).toBeNull()
  })

  it('should render nothing when user has no id', () => {
    const userWithoutId = { first_name: 'John' } as User
    const { container } = render(<UserAvatar user={userWithoutId} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render avatar with user image when provided', () => {
    render(<UserAvatar user={mockUser} />)
    
    const avatar = screen.getByAltText('John')
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('should render avatar with user initials when no image', () => {
    const userWithoutImage = {
      id: 'user-1',
      first_name: 'John', 
      last_name: 'Doe'
    } as User

    render(<UserAvatar user={userWithoutImage} />)
    
    const avatar = screen.getByText('JD')
    expect(avatar).toBeInTheDocument()
  })

  it('should render tooltip with user full name', () => {
    render(<UserAvatar user={mockUser} />)
    
    // Material-UI tooltips are rendered but hidden by default
    expect(screen.getByLabelText('John Doe')).toBeInTheDocument()
  })

  it('should use custom tooltip when provided', () => {
    render(<UserAvatar user={mockUser} tooltip="Custom Tooltip" />)
    
    expect(screen.getByLabelText('Custom Tooltip')).toBeInTheDocument()
  })

  it('should render only first name initial when last name missing', () => {
    const userWithFirstNameOnly = {
      id: 'user-2',
      first_name: 'Jane'
    } as User

    render(<UserAvatar user={userWithFirstNameOnly} />)
    
    expect(screen.getByText('J')).toBeInTheDocument()
  })
})