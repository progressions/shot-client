import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"
import { StyledAutocomplete, StyledSelect } from "../characters/edit/StyledFields"

export default function CategoryAutocomplete({ filter, dispatchFilter }: any) {
  const { loading, category, categories, path } = filter

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
        sx={{ width: 300 }}
        onChange={selectCategory}
        openOnFocus
        getOptionLabel={getOptionLabel}
        renderInput={(params: any) => <StyledSelect autoFocus helperText={helperText} {...params} label="Category" />}
      />
    </>
  )
}
