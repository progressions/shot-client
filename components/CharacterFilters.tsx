import { Stack, Box, TextField, MenuItem } from "@mui/material"
import { useState } from 'react'

import type { CharacterFilter } from "../types/types"

interface CharacterFiltersProps {
  filters: CharacterFilter,
  setFilters: React.Dispatch<React.SetStateAction<CharacterFilter>>
}

export default function CharacterFilters({ filters, setFilters }: CharacterFiltersProps) {
  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, type: event.target.value })
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: event.target.value })
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <Box sx={{width: 200}}>
          <TextField fullWidth name='Type' label='Character Type' select value={filters.type || ''} onChange={handleTypeChange}>
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='PC'>Player Character</MenuItem>
            <MenuItem value='Ally'>Ally</MenuItem>
            <MenuItem value='Mook'>Mook</MenuItem>
            <MenuItem value='Featured Foe'>Featured Foe</MenuItem>
            <MenuItem value='Boss'>Boss</MenuItem>
            <MenuItem value='Uber-Boss'>Uber-Boss</MenuItem>
          </TextField>
        </Box>
        <Box sx={{width: 200}}>
          <TextField fullWidth name='Name' label='Name' value={filters.name || ''} onChange={handleNameChange} />
        </Box>
      </Stack>
    </>
  )
}
