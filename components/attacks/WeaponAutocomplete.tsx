import { StyledAutocomplete, StyledSelect } from "@/components/StyledFields"
import { useState, useEffect } from "react"
import type { Character, Weapon, InputParamsType } from "@/types/types"
import { defaultWeapon } from "@/types/types"
import type { WeaponsStateType, WeaponsActionType } from "@/reducers/weaponsState"
import { WeaponsActions } from "@/reducers/weaponsState"
import { useClient } from "@/contexts/ClientContext"

interface WeaponAutocompleteProps {
  character: Character,
  weapon: Weapon,
  setWeapon: (weapon: Weapon) => void
  disabled: boolean
}

export default function WeaponAutocomplete({ character, weapon, setWeapon, disabled }: WeaponAutocompleteProps) {
  const { client } = useClient()

  const [weapons, setWeapons] = useState<Weapon[]>([])

  useEffect(() => {
    const getCharacter = async () => {
      const data = await client.getCharacter(character)

      const uniqueWeapons = data?.weapons.filter((weapon, index, self) => self.findIndex(w => w.id === weapon.id) === index)
      setWeapons(uniqueWeapons || [])
      setWeapon(uniqueWeapons[0] || defaultWeapon)
    }

    if (character?.id) {
      getCharacter()
    } else {
      setWeapons([])
    }
  }, [character, client])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Weapon) {
    setWeapon(newValue || defaultWeapon)
  }

  function getOptionLabel(option: Weapon) {
    return option.name
  }

  const helperText = (weapons.length) ? "": "No available weapons."


  return (
    <StyledAutocomplete
      freeSolo
      value={weapon || defaultWeapon}
      options={weapons || []}
      disabled={disabled}
      sx={{ width: 250 }}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Weapon, value: Weapon) => option.id === value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Weapon" />}
    />
  )
}

