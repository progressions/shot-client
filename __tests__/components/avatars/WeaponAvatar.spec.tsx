import React from 'react'
import { render, screen } from '@testing-library/react'
import WeaponAvatar from '../../../components/avatars/WeaponAvatar'
import { Weapon } from '../../../types/types'

describe('WeaponAvatar', () => {
  const mockWeapon: Weapon = {
    id: 'weapon-1',
    name: 'Assault Rifle',
    image_url: 'https://example.com/weapon.jpg'
  } as Weapon

  it('should render nothing when no weapon provided', () => {
    const { container } = render(<WeaponAvatar weapon={undefined as any} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render nothing when weapon has no id', () => {
    const weaponWithoutId = { name: 'Test Weapon' } as Weapon
    const { container } = render(<WeaponAvatar weapon={weaponWithoutId} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render avatar with weapon image when provided', () => {
    render(<WeaponAvatar weapon={mockWeapon} />)
    
    const avatar = screen.getByAltText('Assault Rifle')
    expect(avatar).toHaveAttribute('src', 'https://example.com/weapon.jpg')
  })

  it('should render avatar with weapon initials when no image', () => {
    const weaponWithoutImage = {
      id: 'weapon-2',
      name: 'Assault Rifle',
      image_url: null
    } as Weapon

    render(<WeaponAvatar weapon={weaponWithoutImage} />)
    
    const avatar = screen.getByText('AR')
    expect(avatar).toBeInTheDocument()
  })

  it('should generate initials from weapon name correctly', () => {
    const weaponWithLongName = {
      id: 'weapon-3',
      name: 'Heavy Machine Gun Mk2',
      image_url: null
    } as Weapon

    render(<WeaponAvatar weapon={weaponWithLongName} />)
    
    expect(screen.getByText('HMGM')).toBeInTheDocument()
  })

  it('should handle single word weapon name', () => {
    const singleWordWeapon = {
      id: 'weapon-4',
      name: 'Pistol',
      image_url: null
    } as Weapon

    render(<WeaponAvatar weapon={singleWordWeapon} />)
    
    expect(screen.getByText('P')).toBeInTheDocument()
  })

  it('should handle empty weapon name', () => {
    const weaponWithoutName = {
      id: 'weapon-5',
      name: '',
      image_url: null
    } as Weapon

    render(<WeaponAvatar weapon={weaponWithoutName} />)
    
    // Should render avatar with default fallback icon when no name/initials
    const avatar = screen.getByTestId('PersonIcon')
    expect(avatar).toBeInTheDocument()
  })

  it('should render avatar without link when no href provided', () => {
    render(<WeaponAvatar weapon={mockWeapon} />)
    
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should wrap avatar in link when href provided', () => {
    render(<WeaponAvatar weapon={mockWeapon} href="https://example.com/weapon-details" />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', 'https://example.com/weapon-details')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('data-mention-id', 'weapon-1')
    expect(link).toHaveAttribute('data-mention-class-name', 'Weapon')
  })

  it('should render avatar directly when disablePopup is true', () => {
    render(<WeaponAvatar weapon={mockWeapon} disablePopup={true} />)
    
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should prioritize disablePopup over href', () => {
    render(
      <WeaponAvatar 
        weapon={mockWeapon} 
        href="https://example.com/weapon-details" 
        disablePopup={true} 
      />
    )
    
    // Should render avatar directly, not wrapped in link
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  describe('initials generation edge cases', () => {
    it('should handle weapon names with special characters', () => {
      const specialCharWeapon = {
        id: 'weapon-6',
        name: 'AK-47 Assault Rifle',
        image_url: null
      } as Weapon

      render(<WeaponAvatar weapon={specialCharWeapon} />)
      
      expect(screen.getByText('AAR')).toBeInTheDocument()
    })

    it('should handle weapon names with lowercase letters', () => {
      const lowercaseWeapon = {
        id: 'weapon-7', 
        name: 'submachine gun',
        image_url: null
      } as Weapon

      render(<WeaponAvatar weapon={lowercaseWeapon} />)
      
      expect(screen.getByText('SG')).toBeInTheDocument()
    })

    it('should handle weapon names with multiple spaces', () => {
      const multiSpaceWeapon = {
        id: 'weapon-8',
        name: 'Heavy   Duty   Pistol',
        image_url: null
      } as Weapon

      render(<WeaponAvatar weapon={multiSpaceWeapon} />)
      
      // Should still create initials correctly, ignoring empty parts
      expect(screen.getByText('HDP')).toBeInTheDocument()
    })
  })

  describe('Material-UI Avatar properties', () => {
    it('should set correct alt text on avatar', () => {
      render(<WeaponAvatar weapon={mockWeapon} />)
      
      const avatar = screen.getByAltText('Assault Rifle')
      expect(avatar).toBeInTheDocument()
    })

    it('should set empty src when image_url is null', () => {
      const weaponWithoutImage = {
        ...mockWeapon,
        image_url: null
      } as Weapon

      render(<WeaponAvatar weapon={weaponWithoutImage} />)
      
      // When src is empty, Avatar should show initials instead of image
      expect(screen.getByText('AR')).toBeInTheDocument()
    })

    it('should set empty src when image_url is undefined', () => {
      const weaponWithUndefinedImage = {
        ...mockWeapon,
        image_url: null
      } as Weapon

      render(<WeaponAvatar weapon={weaponWithUndefinedImage} />)
      
      expect(screen.getByText('AR')).toBeInTheDocument()
    })
  })
})