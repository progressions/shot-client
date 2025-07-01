import { useEffect, useState, useMemo, useReducer } from "react"
import { FormControlLabel, Switch, Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useCharacter } from "@/contexts/CharacterContext"
import { useToast } from "@/contexts/ToastContext"
import CreateFaction from "@/components/factions/CreateFaction"
import { FactionsActions, FactionsStateType, FactionsActionType } from "@/reducers/factionsState"
import { StyledSelect } from "@/components/StyledFields"
import FactionAutocomplete from "@/components/factions/FactionAutocomplete"
import type { Faction } from "@/types/types"
import { useLocalStorage } from "@/contexts/LocalStorageContext"
import GamemasterOnly from "@/components/GamemasterOnly"

interface FilterFactionsProps {
  state: FactionsStateType
  dispatch: React.Dispatch<FactionsActionType>
}

export default function FilterFactions({ state, dispatch }: FilterFactionsProps) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { saveLocally, getLocally } = useLocalStorage()
  const { secret, faction, factions, page, loading, search } = state

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: FactionsActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: FactionsActions.EDIT, name: "secret", value: checked })
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
            value={faction?.id}
            onChange={handleChange}
          >
            <MenuItem key="" value="">All</MenuItem>
            {
              factions.map((faction: Faction) => <MenuItem key={faction.id} value={faction.id}>{faction.name}</MenuItem>)
            }
          </StyledSelect>
        </Box>
        <FactionAutocomplete state={state} dispatch={dispatch} />
        { !character?.id && <CreateFaction state={state} dispatch={dispatch} /> }
      </Stack>
    </>
  )
}
