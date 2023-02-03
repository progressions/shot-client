import { Stack, Box, TextField, MenuItem } from "@mui/material"
import { useState } from 'react'

import type { Faction, CharacterFilter } from "../../types/types"
import { CharactersStateType, CharactersActionType, CharactersActions } from "../admin/characters/charactersState"
import { StyledTextField, StyledSelect } from "../StyledFields"

interface CharacterFiltersProps {
  state: CharactersStateType,
  dispatch: React.Dispatch<CharactersActionType>
}

export default function CharacterFilters({ state, dispatch }: CharacterFiltersProps) {
  const { character_type, faction, factions, search } = state

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: CharactersActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Box sx={{width: 200}}>
          <StyledSelect fullWidth name='character_type' label='Character Type' select value={character_type} onChange={handleChange}>
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='PC'>Player Character</MenuItem>
            <MenuItem value='Ally'>Ally</MenuItem>
            <MenuItem value='Mook'>Mook</MenuItem>
            <MenuItem value='Featured Foe'>Featured Foe</MenuItem>
            <MenuItem value='Boss'>Boss</MenuItem>
            <MenuItem value='Uber-Boss'>Uber-Boss</MenuItem>
          </StyledSelect>
        </Box>
        <Box sx={{width: 200}}>
          <StyledSelect fullWidth name='faction' label='Faction' select value={faction} onChange={handleChange}>
            {
              factions.map((faction: Faction) => <MenuItem key={faction} value={faction}>{faction}</MenuItem>)
            }
          </StyledSelect>
        </Box>
        <Box sx={{width: 200}}>
          <StyledTextField fullWidth name='search' label='Name' value={search} onChange={handleChange} />
        </Box>
      </Stack>
    </>
  )
}
