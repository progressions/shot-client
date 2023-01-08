import { Stack, Box, TextField, MenuItem } from "@mui/material"
import { useState } from 'react'

export interface CharacterFilter {
  type: string | null,
  name: string | null
}

interface CharacterFiltersProps {
  filters: CharacterFilter,
  setFilters: (filter: CharacterFilter) => void
}

export default function CharacterFilters({ filters, setFilters }: CharacterFiltersProps) {
  const handleTypeChange = (event: any) => {
    setFilters({ ...filters, type: event.target.value })
  }

  const handleNameChange = (event: any) => {
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
