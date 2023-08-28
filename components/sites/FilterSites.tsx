import { useEffect, useState, useMemo, useReducer } from "react"
import { FormControlLabel, Switch, Autocomplete, Button, Stack, Typography, TextField, MenuItem, Box } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useCharacter } from "@/contexts/CharacterContext"
import { useToast } from "@/contexts/ToastContext"
import CreateSite from "@/components/sites/CreateSite"
import { SitesActions, SitesStateType, SitesActionType } from "@/reducers/sitesState"
import { StyledSelect } from "@/components/StyledFields"
import SiteAutocomplete from "@/components/sites/SiteAutocomplete"
import type { Faction, Site } from "@/types/types"
import { useLocalStorage } from "@/contexts/LocalStorageContext"
import GamemasterOnly from "@/components/GamemasterOnly"

interface FilterSitesProps {
  state: SitesStateType
  dispatch: React.Dispatch<SitesActionType>
}

export default function FilterSites({ state, dispatch }: FilterSitesProps) {
  const { character } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { saveLocally, getLocally } = useLocalStorage()
  const { secret, faction, factions, page, loading, search } = state

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: SitesActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    dispatch({ type: SitesActions.EDIT, name: "secret", value: checked })
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
        <SiteAutocomplete state={state} dispatch={dispatch} />
        { !character?.id && <CreateSite state={state} dispatch={dispatch} /> }
        <GamemasterOnly user={user}>
          <FormControlLabel name="secret" label="Show Secret" control={<Switch checked={secret} />} onChange={show} />
        </GamemasterOnly>
      </Stack>
    </>
  )
}
