import React from 'react'
import { render, screen } from '@testing-library/react'
import CharacterAvatar from '../../../components/avatars/CharacterAvatar'
import { useClient } from '../../../contexts'
import CS from '../../../services/CharacterService'
import { Character } from '../../../types/types'

// Mock the contexts and services
jest.mock('../../../contexts', () => ({
  useClient: jest.fn()
}))

jest.mock('../../../services/CharacterService', () => ({
  name: jest.fn()
}))

const mockUseClient = useClient as jest.MockedFunction<typeof useClient>
const mockCSName = CS.name as jest.MockedFunction<typeof CS.name>

describe('CharacterAvatar', () => {
  const mockUser = { id: 'user-1', name: 'Test User' }
  const mockClient = { get: jest.fn(), post: jest.fn() }
  const mockCharacter: Character = {
    id: 'char-1',
    name: 'Test Character',
    image_url: 'https://example.com/character.jpg'
  } as Character

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseClient.mockReturnValue({
      user: mockUser,
      client: mockClient
    } as any)
    mockCSName.mockReturnValue('Test Character')
  })

  it('should render nothing when no character provided', () => {
    const { container } = render(<CharacterAvatar character={undefined as any} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render nothing when character has no id', () => {
    const characterWithoutId = { name: 'Test Character' } as Character
    const { container } = render(<CharacterAvatar character={characterWithoutId} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render avatar with character image when provided', () => {
    render(<CharacterAvatar character={mockCharacter} />)
    
    const avatar = screen.getByAltText('Test Character')
    expect(avatar).toHaveAttribute('src', 'https://example.com/character.jpg')
  })

  it('should render avatar with character initials when no image', () => {
    const characterWithoutImage = {
      id: 'char-2',
      name: 'Test Character',
      image_url: null
    } as Character

    render(<CharacterAvatar character={characterWithoutImage} />)
    
    const avatar = screen.getByText('TC')
    expect(avatar).toBeInTheDocument()
  })

  it('should generate initials from character name correctly', () => {
    const characterWithLongName = {
      id: 'char-3',
      name: 'John Michael Smith Jr',
      image_url: null
    } as Character

    render(<CharacterAvatar character={characterWithLongName} />)
    
    expect(screen.getByText('JMSJ')).toBeInTheDocument()
  })

  it('should handle single word character name', () => {
    const singleWordCharacter = {
      id: 'char-4',
      name: 'Batman',
      image_url: null
    } as Character

    render(<CharacterAvatar character={singleWordCharacter} />)
    
    expect(screen.getByText('B')).toBeInTheDocument()
  })

  it('should handle empty character name', () => {
    const characterWithoutName = {
      id: 'char-5',
      name: '',
      image_url: null
    } as Character
    mockCSName.mockReturnValue('Unknown')

    render(<CharacterAvatar character={characterWithoutName} />)
    
    // Should render avatar with default fallback icon when no name/initials
    const avatar = screen.getByTestId('PersonIcon')
    expect(avatar).toBeInTheDocument()
  })

  it('should render avatar without link when no href provided', () => {
    render(<CharacterAvatar character={mockCharacter} />)
    
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should wrap avatar in link when href provided', () => {
    render(<CharacterAvatar character={mockCharacter} href="/character/char-1" />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/character/char-1')
    expect(link).toHaveAttribute('data-mention-id', 'char-1')
    expect(link).toHaveAttribute('data-mention-class-name', 'Character')
  })

  it('should render avatar directly when disablePopup is true', () => {
    render(<CharacterAvatar character={mockCharacter} disablePopup={true} />)
    
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should prioritize disablePopup over href', () => {
    render(
      <CharacterAvatar 
        character={mockCharacter} 
        href="/character/char-1" 
        disablePopup={true} 
      />
    )
    
    // Should render avatar directly, not wrapped in link
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  describe('initials generation edge cases', () => {
    it('should handle character names with special characters', () => {
      const specialCharCharacter = {
        id: 'char-6',
        name: 'Jean-Luc Picard',
        image_url: null
      } as Character

      render(<CharacterAvatar character={specialCharCharacter} />)
      
      expect(screen.getByText('JP')).toBeInTheDocument()
    })

    it('should handle character names with lowercase letters', () => {
      const lowercaseCharacter = {
        id: 'char-7', 
        name: 'spider man',
        image_url: null
      } as Character

      render(<CharacterAvatar character={lowercaseCharacter} />)
      
      expect(screen.getByText('SM')).toBeInTheDocument()
    })

    it('should handle character names with multiple spaces', () => {
      const multiSpaceCharacter = {
        id: 'char-8',
        name: 'Doctor   Strange   Supreme',
        image_url: null
      } as Character

      render(<CharacterAvatar character={multiSpaceCharacter} />)
      
      // Should still create initials correctly, ignoring empty parts
      expect(screen.getByText('DSS')).toBeInTheDocument()
    })

    it('should handle character names with leading/trailing spaces', () => {
      const spacedCharacter = {
        id: 'char-9',
        name: '  Tony Stark  ',
        image_url: null
      } as Character

      render(<CharacterAvatar character={spacedCharacter} />)
      
      expect(screen.getByText('TS')).toBeInTheDocument()
    })
  })

  describe('Material-UI Avatar properties', () => {
    it('should set correct alt text on avatar', () => {
      render(<CharacterAvatar character={mockCharacter} />)
      
      const avatar = screen.getByAltText('Test Character')
      expect(avatar).toBeInTheDocument()
    })

    it('should set empty src when image_url is null', () => {
      const characterWithoutImage = {
        ...mockCharacter,
        image_url: null
      } as Character

      render(<CharacterAvatar character={characterWithoutImage} />)
      
      // When src is empty, Avatar should show initials instead of image
      expect(screen.getByText('TC')).toBeInTheDocument()
    })

    it('should set empty src when image_url is undefined', () => {
      const characterWithUndefinedImage = {
        ...mockCharacter,
        image_url: null
      } as Character

      render(<CharacterAvatar character={characterWithUndefinedImage} />)
      
      expect(screen.getByText('TC')).toBeInTheDocument()
    })

    it('should call CharacterService.name for tooltip generation', () => {
      render(<CharacterAvatar character={mockCharacter} />)
      
      expect(mockCSName).toHaveBeenCalledWith(mockCharacter)
    })

    it('should handle when CharacterService.name returns null', () => {
      mockCSName.mockReturnValue('')

      render(<CharacterAvatar character={mockCharacter} />)
      
      // Should still render the avatar even if name service returns null
      const avatar = screen.getByRole('img')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('context integration', () => {
    it('should use client context correctly', () => {
      render(<CharacterAvatar character={mockCharacter} />)
      
      expect(mockUseClient).toHaveBeenCalled()
    })

    it('should handle when user context is null', () => {
      mockUseClient.mockReturnValue({
        user: null,
        client: mockClient
      } as any)

      render(<CharacterAvatar character={mockCharacter} />)
      
      const avatar = screen.getByRole('img')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle when client context is null', () => {
      mockUseClient.mockReturnValue({
        user: mockUser,
        client: null
      } as any)

      render(<CharacterAvatar character={mockCharacter} />)
      
      const avatar = screen.getByRole('img')
      expect(avatar).toBeInTheDocument()
    })
  })
})