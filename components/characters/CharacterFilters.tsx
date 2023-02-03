import { Stack, Box, TextField, MenuItem } from "@mui/material"
import { useState } from 'react'

import type { CharacterFilter } from "../../types/types"
import { CharactersStateType, CharactersActionType, CharactersActions } from "../admin/characters/charactersState"
import { StyledTextField, StyledSelect } from "../StyledFields"

interface CharacterFiltersProps {
  state: CharactersStateType,
  dispatch: React.Dispatch<CharactersActionType>
}

export default function CharacterFilters({ state, dispatch }: CharacterFiltersProps) {
  const { character_type, search } = state

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: CharactersActions.UPDATE, name: "character_type", value: event.target.value })
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: CharactersActions.UPDATE, name: "search", value: event.target.value })
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Box sx={{width: 200}}>
          <StyledSelect fullWidth name='Type' label='Character Type' select value={character_type} onChange={handleTypeChange}>
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
          <StyledTextField fullWidth name='Name' label='Name' value={search} onChange={handleNameChange} />
        </Box>
      </Stack>
    </>
  )
}
