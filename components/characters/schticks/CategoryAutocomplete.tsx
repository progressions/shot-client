import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"

export default function CategoryAutocomplete({ state, dispatch }) {
  const { loading, category, path } = state

  const categories = useMemo(() => (["Guns", "Martial Arts", "Transformed Animal", "Creature", "Cyborg", "Driving", "Foe", "Mutant", "Sorcery"]), [])

  function selectCategory(event: any, newValue: any) {
    dispatch({ type: "update", name: "category", value: newValue })
  }

  function getOptionLabel(option: any) {
    return option || ""
  }

  return (
    <>
      <Autocomplete
        value={category || null}
        disabled={loading}
        options={categories}
        sx={{ width: 300 }}
        onChange={selectCategory}
        openOnFocus
        getOptionLabel={getOptionLabel}
        renderInput={(params) => <TextField autoFocus name="Category" {...params} label="Category" />}
      />
    </>
  )
}
