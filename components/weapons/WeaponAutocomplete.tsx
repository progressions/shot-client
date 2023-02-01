import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import { useState, useEffect } from "react"
import type { Weapon, InputParamsType } from "../../types/types"
import { defaultWeapon } from "../../types/types"
import type { WeaponsStateType, WeaponsActionType } from "./filterReducer"

interface WeaponAutocompleteProps {
  filter: WeaponsStateType
  dispatchFilter: React.Dispatch<WeaponsActionType>
}

export default function WeaponAutocomplete({ filter, dispatchFilter }: WeaponAutocompleteProps) {
  const { loading, weapon, weapons } = filter
  const [search, setSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatchFilter({ type: "name", payload: search })
    }, 1000)

    return () => clearTimeout(timer)
  }, [search, dispatchFilter])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Weapon) {
    dispatchFilter({ type: "weapon", payload: newValue })
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    setSearch(newValue)
  }

  function getOptionLabel(option: Weapon) {
    return option.name
  }

  const helperText = (weapons.length) ? "": "There are no available weapons."

  return (
    <StyledAutocomplete
      freeSolo
      value={weapon || defaultWeapon}
      disabled={loading}
      options={weapons || []}
      sx={{ width: 250 }}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Weapon, value: Weapon) => option.id === value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Weapon" />}
    />
  )
}
