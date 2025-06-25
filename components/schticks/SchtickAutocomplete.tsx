import { StyledAutocomplete, StyledSelect } from "@/components/StyledFields"
import { createFilterOptions } from "@mui/material"
import type { Schtick, InputParamsType } from "@/types/types"
import { defaultSchtick } from "@/types/types"

import { SchticksActions } from "@/reducers/schticksState"
import { useState, useEffect } from "react"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"

const filterOptions = createFilterOptions<string>();

interface SchtickAutocompleteProps {
  state: SchticksStateType
  dispatch: React.Dispatch<SchticksActionType>
}

export default function SchtickAutocomplete({ state, dispatch }: SchtickAutocompleteProps) {
  const { edited, loading, schtick, schticks } = state
  const [name, setName] = useState<string>(state.name || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      if (name.length > 3) {
        dispatch({ type: SchticksActions.NAME, payload: name })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [name])

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>, newValue: Schtick) {
    dispatch({ type: SchticksActions.SCHTICK, payload: newValue })
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    if (newValue.length === 0) {
      dispatch({ type: SchticksActions.NAME, payload: "" })
    }
    setName(newValue)
  }

  function getOptionLabel(option: Schtick) {
    return option.name
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
