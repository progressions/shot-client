import { Stack, Box, TextField, MenuItem } from "@mui/material"
import type { Faction, InputParamsType } from "@/types/types"
import { FactionsStateType, FactionsActionType, FactionsActions } from "@/reducers/factionsState"
import { StyledAutocomplete, StyledTextField, StyledSelect } from "@/components/StyledFields"

interface FactionAutocompleteProps {
  state: FactionsStateType,
  dispatch: React.Dispatch<FactionsActionType>
}

export default function FactionAutocomplete({ state, dispatch }: FactionAutocompleteProps) {
  const { loading, faction, factions } = state

  const selectFaction = (event: React.SyntheticEvent, value: Faction | null) => {
    dispatch({ type: FactionsActions.FACTION, payload: value })
  }

  const getOptionLabel = (option: Faction) => {
    if (!option?.id) return ""
    return `${option?.name} (${option?.characters?.length} characters)`
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <StyledAutocomplete
          disabled={loading}
          freeSolo
          options={factions}
          sx={{ width: 300 }}
          value={faction}
          onChange={selectFaction}
          getOptionLabel={getOptionLabel}
          renderInput={(params: InputParamsType) => <StyledTextField {...params} label="Faction" />}
        />
      </Stack>
    </>
  )
}
