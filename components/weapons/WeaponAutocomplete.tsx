import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import { useState, useEffect } from "react"
import type { InputParamsType } from "../../types/types"

export default function WeaponAutocomplete({ filter, dispatchFilter }: any) {
  const { loading, weapon, weapons } = filter
  const [search, setSearch] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatchFilter({ type: "name", payload: search })
    }, 1000)

    return () => clearTimeout(timer)
  }, [search, dispatchFilter])

  function handleSelect(event: any, newValue: any) {
    dispatchFilter({ type: "weapon", payload: newValue })
  }

  function handleInputChange(event: any, newValue: any) {
    setSearch(newValue)
  }

  function getOptionLabel(option: any) {
    return option.name
  }

  const helperText = (weapons.length) ? "": "There are no available weapons."

  return (
    <StyledAutocomplete
      freeSolo
      value={weapon || {id: null, name: ""}}
      disabled={loading}
      options={weapons || []}
      sx={{ width: 250 }}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Weapon" />}
    />
  )
}
