import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"
import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import type { WeaponCategory, InputParamsType } from "../../types/types"

import type { WeaponsStateType, WeaponsActionType } from "./weaponsState"

interface CategoryAutocompleteProps {
  state: WeaponsStateType
  dispatch: React.Dispatch<WeaponsActionType>
}

export default function CategoryAutocomplete({ state, dispatch }: CategoryAutocompleteProps) {
  const { loading, category, categories } = state

  function selectCategory(event: React.SyntheticEvent<Element, Event>, newValue: WeaponCategory) {
    dispatch({ type: "category", payload: newValue })
  }

  function getOptionLabel(option: WeaponCategory) {
    return option || ""
  }

  const helperText = (categories?.length) ? "" : "There are no available categories."

  return (
    <>
      <StyledAutocomplete
        value={category || null}
        disabled={loading || !categories?.length}
        options={categories || []}
        sx={{ width: 250 }}
        onChange={selectCategory}
        getOptionLabel={getOptionLabel}
        renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Category" />}
      />
    </>
  )
}
