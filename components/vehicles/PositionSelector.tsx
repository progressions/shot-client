import { Radio, FormControl, FormControlLabel, FormLabel, RadioGroup, Typography, Box, Stack } from "@mui/material"
import type { Vehicle } from "../../types/types"

interface PositionSelectorProps {
  character: Vehicle
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PositionSelector({ character, onChange }: PositionSelectorProps) {
  return (
    <FormControl>
      <FormLabel>Position</FormLabel>
      <RadioGroup
        name="Position"
        value={character.action_values["Position"] || "far"}
        onChange={onChange}
      >
        <Stack direction="row">
          <FormControlLabel value="near" control={<Radio />} label="Near" />
          <FormControlLabel value="far" control={<Radio />} label="Far" />
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}
