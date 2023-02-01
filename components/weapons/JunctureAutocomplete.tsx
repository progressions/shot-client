import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"
import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import type { Juncture, InputParamsType } from "../../types/types"
import type { WeaponsStateType, WeaponsActionType } from "./filterReducer"

interface JunctureAutocompleteProps {
  filter: WeaponsStateType
  dispatchFilter: React.Dispatch<WeaponsActionType>
}

export default function JunctureAutocomplete({ filter, dispatchFilter }: JunctureAutocompleteProps) {
  const { loading, juncture, junctures } = filter

  function selectJuncture(event: React.ChangeEvent<HTMLInputElement>, newValue: Juncture) {
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
