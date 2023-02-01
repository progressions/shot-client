import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"
import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import type { InputParamsType } from "../../types/types"

export default function JunctureAutocomplete({ filter, dispatchFilter }: any) {
  const { loading, juncture, junctures, path } = filter

  // const junctures = useMemo(() => (["Guns", "Martial Arts", "Transformed Animal", "Creature", "Cyborg", "Driving", "Foe", "Mutant", "Sorcery"]), [])

  function selectJuncture(event: any, newValue: any) {
    dispatchFilter({ type: "juncture", payload: newValue })
  }

  function getOptionLabel(option: any) {
    return option || ""
  }

  const helperText = (junctures?.length) ? "" : "There are no available junctures."

  return (
    <>
      <StyledAutocomplete
        value={juncture || null}
        disabled={loading || !junctures?.length}
        options={junctures || []}
        sx={{ width: 200 }}
        onChange={selectJuncture}
        getOptionLabel={getOptionLabel}
        renderInput={(params: InputParamsType) => <StyledSelect helperText={helperText} {...params} label="Juncture" />}
      />
    </>
  )
}
