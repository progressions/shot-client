import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import { createFilterOptions } from "@mui/material"

import { useState, useEffect } from "react"

const filterOptions = createFilterOptions<string>();

export default function SchtickAutocomplete({ filter, dispatchFilter }: any) {
  const { loading, schtick, schticks } = filter
  const [search, setSearch] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatchFilter({ type: "title", payload: search })
    }, 1000)

    return () => clearTimeout(timer)
  }, [search])

  function handleSelect(event: any, newValue: any) {
    dispatchFilter({ type: "schtick", payload: newValue })
  }

  function handleInputChange(event: any, newValue: any) {
    setSearch(newValue)
  }

  function getOptionLabel(option: any) {
    return option.title
  }

  const helperText = (schticks.length) ? "": "There are no available schticks."

  return (
    <StyledAutocomplete
      freeSolo
      value={schtick || {id: null, title: ""}}
      disabled={loading}
      options={schticks || []}
      sx={{ width: 300 }}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
      renderInput={(params: any) => <StyledSelect helperText={helperText} {...params} label="Schtick" />}
    />
  )
}
