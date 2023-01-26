import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"

export default function CategoryAutocomplete({ filter, dispatchFilter }) {
  const { loading, category, path } = filter

  const categories = useMemo(() => (["Guns", "Martial Arts", "Transformed Animal", "Creature", "Cyborg", "Driving", "Foe", "Mutant", "Sorcery"]), [])

  function selectCategory(event: any, newValue: any) {
    dispatchFilter({ type: "category", payload: newValue })
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
