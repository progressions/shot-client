import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"
import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import type { InputParamsType } from "../../types/types"

import type { WeaponsStateType, WeaponsActionType } from "./filterReducer"

interface CategoryAutocompleteProps {
  filter: WeaponsStateType
  dispatchFilter: React.Dispatch<WeaponsActionType>
}

export default function CategoryAutocomplete({ filter, dispatchFilter }: CategoryAutocompleteProps) {
  const { loading, category, categories } = filter

  // const categories = useMemo(() => (["Guns", "Martial Arts", "Transformed Animal", "Creature", "Cyborg", "Driving", "Foe", "Mutant", "Sorcery"]), [])

  function selectCategory(event: any, newValue: any) {
    dispatchFilter({ type: "category", payload: newValue })
  }

  function getOptionLabel(option: any) {
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
