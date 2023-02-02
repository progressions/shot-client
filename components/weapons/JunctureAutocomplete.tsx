import { Autocomplete, TextField } from "@mui/material"
import { useMemo } from "react"
import { StyledAutocomplete, StyledSelect } from "../StyledFields"
import type { Juncture, InputParamsType } from "../../types/types"
import type { WeaponsStateType, WeaponsActionType } from "./weaponsState"
import { WeaponsActions } from "./weaponsState"

interface JunctureAutocompleteProps {
  state: WeaponsStateType
  dispatch: React.Dispatch<WeaponsActionType>
}

export default function JunctureAutocomplete({ state, dispatch }: JunctureAutocompleteProps) {
  const { loading, juncture, junctures } = state

  function selectJuncture(event: React.ChangeEvent<HTMLInputElement>, newValue: Juncture) {
    dispatch({ type: WeaponsActions.JUNCTURE, payload: newValue })
  }

  function getOptionLabel(option: Juncture) {
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
