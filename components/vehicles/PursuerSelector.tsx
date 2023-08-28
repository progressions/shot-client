import { Radio, FormControl, FormControlLabel, FormLabel, RadioGroup, Typography, Box, Stack } from "@mui/material"
import { Vehicle } from "@/types/types"

interface PursuerSelectorProps {
  character: Vehicle
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PursuerSelector({ character, onChange }: PursuerSelectorProps) {
  return (
    <FormControl>
      <FormLabel>Pursuer?</FormLabel>
      <RadioGroup
        name="Pursuer"
        value={character.action_values["Pursuer"] || "false"}
        onChange={onChange}
      >
        <Stack direction="row">
          <FormControlLabel value="true" control={<Radio />} label="Pursuer" />
          <FormControlLabel value="false" control={<Radio />} label="Evader" />
        </Stack>
      </RadioGroup>
    </FormControl>
  )
}
