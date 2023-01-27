import { Stack, Box, TextField, MenuItem } from "@mui/material"
import Subhead from "./Subhead"
import type { Character } from "../../../types/types"
import { StyledSelect, StyledTextField } from "./StyledFields"

interface FortuneSelectProps {
  character: Character
  onChange: any
}

export default function FortuneSelect({ character, onChange }: FortuneSelectProps) {
  return (
    <>
      <Stack spacing={1}>
        <Subhead>Fortune</Subhead>
        <Stack direction="row" spacing={2}>
          <Box sx={{width: 200}}>
            <StyledSelect select fullWidth label="Fortune Type" name="FortuneType" value={character.action_values["FortuneType"] || "Fortune"} onChange={onChange}>
              <MenuItem value="Fortune">Fortune</MenuItem>
              <MenuItem value="Chi">Chi</MenuItem>
              <MenuItem value="Genome">Genome</MenuItem>
              <MenuItem value="Magic">Magic</MenuItem>
            </StyledSelect>
          </Box>
          <StyledTextField label={character.action_values["FortuneType"]} type="number" sx={{width: 100}} name="Fortune" value={character.action_values?.['Fortune'] || ''} onChange={onChange} />
          <StyledTextField label={`Max ${character.action_values["FortuneType"]}`} type="number" sx={{width: 100}} name="Max Fortune" value={character.action_values["Max Fortune"]} onChange={onChange} />
        </Stack>
      </Stack>
    </>
  )
}
