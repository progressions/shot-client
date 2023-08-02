import { Box, TextField, MenuItem } from '@mui/material'
import { useState } from 'react'
import { StyledSelect } from "../../StyledFields"
import { CharacterTypes } from "../../../types/types"

interface CharacterTypeParams {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>, newValue: string) => void
}

export default function CharacterType({ value, onChange }: CharacterTypeParams) {
  return (
    <StyledSelect fullWidth name='Type' required label='Type' select value={value} onChange={onChange}>
      <MenuItem value={CharacterTypes.PC}>{CharacterTypes.PC}</MenuItem>
      <MenuItem value={CharacterTypes.Ally}>{CharacterTypes.Ally}</MenuItem>
      <MenuItem value={CharacterTypes.Mook}>{CharacterTypes.Mook}</MenuItem>
      <MenuItem value={CharacterTypes.FeaturedFoe}>{CharacterTypes.FeaturedFoe}</MenuItem>
      <MenuItem value={CharacterTypes.Boss}>{CharacterTypes.Boss}</MenuItem>
      <MenuItem value={CharacterTypes.UberBoss}>{CharacterTypes.UberBoss}</MenuItem>
    </StyledSelect>
  )
}
