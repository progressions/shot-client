import { Box, TextField, MenuItem } from '@mui/material'
import { useState } from 'react'

interface CharacterTypeParams {
  value: string,
  onChange: any
}

export default function CharacterType({ value, onChange }: CharacterTypeParams) {
  return (
    <Box sx={{width: 250}}>
      <TextField fullWidth name='Type' required label='Character Type' select value={value} onChange={onChange}>
        <MenuItem value='PC'>Player Character</MenuItem>
        <MenuItem value='Ally'>Ally</MenuItem>
        <MenuItem value='Mook'>Mook</MenuItem>
        <MenuItem value='Featured Foe'>Featured Foe</MenuItem>
        <MenuItem value='Boss'>Boss</MenuItem>
        <MenuItem value='Uber-Boss'>Uber-Boss</MenuItem>
      </TextField>
    </Box>
  )
}
