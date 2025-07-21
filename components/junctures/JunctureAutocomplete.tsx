import { Stack, Box, TextField, MenuItem } from "@mui/material"
import type { Juncture, InputParamsType } from "@/types/types"
import { JuncturesStateType, JuncturesActionType, JuncturesActions } from "@/reducers/juncturesState"
import { StyledAutocomplete, StyledTextField, StyledSelect } from "@/components/StyledFields"

interface JunctureAutocompleteProps {
  state: JuncturesStateType,
  dispatch: React.Dispatch<JuncturesActionType>
}

export default function JunctureAutocomplete({ state, dispatch }: JunctureAutocompleteProps) {
  const { loading, juncture, junctures } = state

  const selectJuncture = (event: React.SyntheticEvent, value: Juncture | null) => {
    dispatch({ type: JuncturesActions.JUNCTURE, payload: value })
  }

  const getOptionLabel = (option: Juncture) => {
    if (!option?.id) return ""
    return `${option?.name} (${option?.characters?.length} characters)`
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <StyledAutocomplete
          disabled={loading}
          freeSolo
          options={junctures}
          sx={{ width: 300 }}
          value={juncture}
          onChange={selectJuncture}
          getOptionLabel={getOptionLabel}
          renderInput={(params: InputParamsType) => <StyledTextField {...params} label="Juncture" />}
        />
      </Stack>
    </>
  )
}
