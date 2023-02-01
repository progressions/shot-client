import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import { createFilterOptions } from "@mui/material"
import type { Schtick, InputParamsType } from "../../types/types"
import { defaultSchtick } from "../../types/types"

import { useState, useEffect } from "react"
import type { SchticksStateType, SchticksActionType } from "./filterReducer"

const filterOptions = createFilterOptions<string>();

interface SchtickAutocompleteProps {
  filter: SchticksStateType
  dispatchFilter: React.Dispatch<SchticksActionType>
}

export default function SchtickAutocomplete({ filter, dispatchFilter }: SchtickAutocompleteProps) {
  const { loading, schtick, schticks } = filter
  const [search, setSearch] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatchFilter({ type: "title", payload: search })
    }, 1000)

    return () => clearTimeout(timer)
  }, [search, dispatchFilter])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Schtick) {
    dispatchFilter({ type: "schtick", payload: newValue })
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    setSearch(newValue)
  }

  function getOptionLabel(option: any) {
    return option.title
  }

  const helperText = (schticks.length) ? "": "There are no available schticks."

  return (
    <StyledAutocomplete
      freeSolo
      value={schtick || defaultSchtick}
      disabled={loading}
      options={schticks || []}
      sx={{ width: 300 }}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: Schtick, value: Schtick) => option.id === value.id}
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Schtick" />}
    />
  )
}
