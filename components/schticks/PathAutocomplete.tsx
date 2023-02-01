import { Autocomplete, TextField } from "@mui/material"
import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import type { SchtickPath, InputParamsType } from "../../types/types"

import { SchticksStateType, SchticksActionType } from "./filterReducer"

interface PathAutocompleteProps {
  filter: SchticksStateType
  dispatchFilter: React.Dispatch<SchticksActionType>
}

export default function PathAutocomplete({ filter, dispatchFilter }: PathAutocompleteProps) {
  const { loading, path, paths } = filter

  function selectPath(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    dispatchFilter({ type: "path", payload: newValue })
  }

  function getOptionLabel(option: SchtickPath) {
    return option || ""
  }

  const helperText = (paths.length) ? "" : "There are no available paths."

  return (
    <StyledAutocomplete
      value={path || null}
      disabled={loading || !paths.length}
      options={paths}
      sx={{ width: 300 }}
      onChange={selectPath}
      openOnFocus
      getOptionLabel={getOptionLabel}
      renderInput={(params: InputParamsType) => <StyledSelect autoFocus helperText={helperText} {...params} label="Path" />}
    />
  )
}
