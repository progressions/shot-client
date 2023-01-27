import { Stack, Box, TextField, MenuItem } from "@mui/material"
import Subhead from "./Subhead"
import type { Character } from "../../../types/types"

interface FortuneSelectProps {
  character: Character
  onChange: any
}

export default function FortuneSelect({ character, onChange }: FortuneSelectProps) {
  return (
    <>
      <Subhead>Fortune</Subhead>
      <Stack direction="row" spacing={2}>
        <Box sx={{width: 200}}>
          <TextField select fullWidth label="Fortune Type" name="FortuneType" value={character.action_values["FortuneType"] || "Fortune"} onChange={onChange}>
            <MenuItem value="Fortune">Fortune</MenuItem>
            <MenuItem value="Chi">Chi</MenuItem>
            <MenuItem value="Genome">Genome</MenuItem>
            <MenuItem value="Magic">Magic</MenuItem>
          </TextField>
        </Box>
        <TextField label={character.action_values["FortuneType"]} type="number" sx={{width: 100}} name="Fortune" value={character.action_values?.['Fortune'] || ''} onChange={onChange} />
        <TextField label={`Max ${character.action_values["FortuneType"]}`} type="number" sx={{width: 100}} name="Max Fortune" value={character.action_values["Max Fortune"]} onChange={onChange} />
      </Stack>
    </>
  )
}
