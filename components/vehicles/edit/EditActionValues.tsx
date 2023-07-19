import { Box, Stack, TextField, MenuItem } from "@mui/material"
import PlayerTypeOnly from "../../PlayerTypeOnly"
import { Subhead, StyledSelect, StyledTextField } from "../../StyledFields"

import type { Vehicle } from "../../../types/types"

interface EditActionValuesProps {
  vehicle: Vehicle
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EditActionValues({ vehicle, onChange }: EditActionValuesProps) {
  return (
    <>
      <Stack spacing={2}>
        <Subhead>Action Values</Subhead>
        <Stack direction="row" spacing={2}>
          <StyledTextField label="Acceleration" helperText="Speed" type="number" sx={{width: 100}} name="Acceleration" value={vehicle.action_values["Acceleration"] || ""} onChange={onChange} />
          <StyledTextField label="Handling" helperText="Chase Toughness" type="number" sx={{width: 100}} name="Handling" value={vehicle.action_values?.['Handling'] || ""} onChange={onChange} />
          <StyledTextField label="Squeal" helperText="Chase Damage" type="number" sx={{width: 100}} name="Squeal" value={vehicle.action_values?.['Squeal'] || ""} onChange={onChange} />
          <StyledTextField label="Frame" helperText="Condition Toughness" type="number" sx={{width: 100}} name="Frame" value={vehicle.action_values?.['Frame'] || ""} onChange={onChange} />
          <StyledTextField label="Crunch" helperText="Condition Damage" type="number" sx={{width: 100}} name="Crunch" value={vehicle.action_values?.['Crunch'] || ""} onChange={onChange} />
        </Stack>
      </Stack>
    </>
  )
}

