import { Radio, FormControl, FormControlLabel, FormLabel, RadioGroup, Typography, Box, Stack } from "@mui/material"

export default function PositionSelector({ character, onChange }: any) {
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
