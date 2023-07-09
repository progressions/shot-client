import { useEffect, useState, useMemo, useReducer } from "react"
import { FormControlLabel, Switch, Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useCharacter } from "../../contexts/CharacterContext"
import { useToast } from "../../contexts/ToastContext"
import CreateParty from "./CreateParty"
import { PartiesActions, PartiesStateType, PartiesActionType } from "../../reducers/partiesState"
import { StyledSelect } from "../StyledFields"
import PartyAutocomplete from "./PartyAutocomplete"
import type { Faction, Party } from "../../types/types"
import GamemasterOnly from "../GamemasterOnly"

interface FilterPartiesProps {
  state: PartiesStateType
  dispatch: React.Dispatch<PartiesActionType>
}

export default function FilterParties({ state, dispatch }: FilterPartiesProps) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { secret, faction, factions, page, loading, search } = state

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: PartiesActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: PartiesActions.EDIT, name: "secret", value: checked })
  }

  const selectParty = (event: React.ChangeEvent<HTMLInputElement>, value: Party) => {
    dispatch({ type: PartiesActions.PARTY, payload: value })
  }

  const getOptionLabel = (party: Party) => {
    return party.name
  }

  return (
    <>
      <Stack spacing={2} direction="row" alignItems="center">
        <Box sx={{width: 155}}>
          <StyledSelect
            fullWidth
            name="faction"
            label="Faction"
            select
            value={faction.id}
            onChange={handleChange}
          >
            <MenuItem key="" value="">All</MenuItem>
            {
              factions.map((faction: Faction) => <MenuItem key={faction.id} value={faction.id}>{faction.name}</MenuItem>)
            }
          </StyledSelect>
        </Box>
        <PartyAutocomplete state={state} dispatch={dispatch} />
        { !character?.id && <CreateParty state={state} dispatch={dispatch} /> }
        <GamemasterOnly user={user}>
          <FormControlLabel name="secret" label="Show Secret" control={<Switch checked={secret} />} onChange={show} />
        </GamemasterOnly>
      </Stack>
    </>
  )
}


