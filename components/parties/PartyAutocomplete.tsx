import { Stack, Box, TextField, MenuItem } from "@mui/material"
import type { Party, InputParamsType } from "@/types/types"
import { PartiesStateType, PartiesActionType, PartiesActions } from "@/reducers/partiesState"
import { StyledAutocomplete, StyledTextField, StyledSelect } from "@/components/StyledFields"
import PS from "@/services/PartyService"

interface PartyAutocompleteProps {
  state: PartiesStateType,
  dispatch: React.Dispatch<PartiesActionType>
}

export default function PartyAutocomplete({ state, dispatch }: PartyAutocompleteProps) {
  const { loading, party, parties, search } = state

  const selectParty = (event: React.SyntheticEvent, value: Party | null) => {
    dispatch({ type: PartiesActions.PARTY, payload: value })
  }

  const getOptionLabel = (option: Party) => {
    if (!option?.id) return ""

    return PS.nameBadge(option)
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <StyledAutocomplete
          disabled={loading}
          freeSolo
          options={parties}
          sx={{ width: 300 }}
          value={party}
          onChange={selectParty}
          getOptionLabel={getOptionLabel}
          renderInput={(params: InputParamsType) => <StyledTextField autoFocus {...params} label="Party" />}
        />
      </Stack>
    </>
  )
}
