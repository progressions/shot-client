import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"
import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import type { SchtickCategory, InputParamsType } from "../../types/types"
import type { SchticksStateType, SchticksActionType } from "./filterReducer"

interface CategoryAutocompleteProps {
  filter: SchticksStateType
  dispatchFilter: React.Dispatch<SchticksActionType>
}

export default function CategoryAutocomplete({ filter, dispatchFilter }: CategoryAutocompleteProps) {
  const { loading, category, categories, path } = filter

  function selectCategory(event: React.SyntheticEvent<Element, Event>, newValue: SchtickCategory) {
    dispatchFilter({ type: "category", payload: newValue })
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
        renderInput={(params: InputParamsType) => <StyledSelect autoFocus helperText={helperText} {...params} label="Category" />}
      />
    </>
  )
}
