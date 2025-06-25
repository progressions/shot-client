import { Autocomplete, TextField } from "@mui/material"
import { StyledAutocomplete, StyledSelect } from "@/components/StyledFields"
import type { SchtickPath, InputParamsType } from "@/types/types"

import { SchticksActions } from "@/reducers/schticksState"
import { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"

interface PathAutocompleteProps {
  state: SchticksStateType
  dispatch: React.Dispatch<SchticksActionType>
}

export default function PathAutocomplete({ state, dispatch }: PathAutocompleteProps) {
  const { loading, path, paths } = state

  function selectPath(event: React.ChangeEvent<HTMLInputElement>, newValue: string) {
    dispatch({ type: SchticksActions.PATH, payload: newValue })
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
      renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Path" />}
    />
  )
}
