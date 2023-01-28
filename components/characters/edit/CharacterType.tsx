import { Box, TextField, MenuItem } from '@mui/material'
import { useState } from 'react'
import { StyledSelect } from "../../StyledFields"

interface CharacterTypeParams {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>, newValue?: any) => void
}

export default function CharacterType({ value, onChange }: CharacterTypeParams) {
  return (
    <StyledSelect fullWidth name='Type' required label='Type' select value={value} onChange={onChange}>
      <MenuItem value='PC'>Player Character</MenuItem>
      <MenuItem value='Ally'>Ally</MenuItem>
      <MenuItem value='Mook'>Mook</MenuItem>
      <MenuItem value='Featured Foe'>Featured Foe</MenuItem>
      <MenuItem value='Boss'>Boss</MenuItem>
      <MenuItem value='Uber-Boss'>Uber-Boss</MenuItem>
    </StyledSelect>
  )
}
