import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"
import { StyledAutocomplete, StyledSelect } from "@/components/StyledFields"
import type { SchtickCategory, InputParamsType } from "@/types/types"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"
import { SchticksActions } from "@/reducers/schticksState"

interface CategoryAutocompleteProps {
  state: SchticksStateType
  dispatch: React.Dispatch<SchticksActionType>
}

export default function CategoryAutocomplete({ state, dispatch }: CategoryAutocompleteProps) {
  const { loading, category, categories, path } = state

  function selectCategory(event: React.SyntheticEvent<Element, Event>, newValue: SchtickCategory) {
    dispatch({ type: SchticksActions.CATEGORY, payload: newValue })
  }

  function getOptionLabel(option: SchtickCategory) {
    return option || ""
  }

  const helperText = (categories?.length) ? "" : "There are no available categories."

  return (
    <>
      <StyledAutocomplete
        value={category || null}
        disabled={loading || !categories?.length}
        options={categories || []}
        sx={{ width: 300 }}
        onChange={selectCategory}
        openOnFocus
        getOptionLabel={getOptionLabel}
        renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Category" />}
      />
    </>
  )
}
