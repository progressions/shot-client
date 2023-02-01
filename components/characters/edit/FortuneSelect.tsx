import { Typography, Stack, Box, TextField, MenuItem } from "@mui/material"
import type { Character } from "../../../types/types"
import { Subhead, StyledSelect, StyledTextField } from "../../StyledFields"

interface FortuneSelectProps {
  character: Character
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
}

export default function FortuneSelect({ character, onChange, readOnly }: FortuneSelectProps) {
  return (
    <>
      <Stack spacing={1}>
        <Subhead>Fortune</Subhead>
        <Stack direction="row" spacing={2}>
          <Box sx={{width: 200}}>
            <StyledSelect
              select
              fullWidth
              label="Fortune Type"
              name="FortuneType"
              value={character.action_values["FortuneType"] || "Fortune"}
              onChange={onChange}
              disabled={readOnly}
            >
              <MenuItem value="Fortune">Fortune</MenuItem>
              <MenuItem value="Chi">Chi</MenuItem>
              <MenuItem value="Genome">Genome</MenuItem>
              <MenuItem value="Magic">Magic</MenuItem>
            </StyledSelect>
          </Box>
          <StyledTextField
            label={character.action_values["FortuneType"]}
            type="number"
            sx={{width: 100}}
            name="Fortune"
            value={character.action_values?.['Fortune'] || ''}
            onChange={onChange}
          />
          <StyledTextField
            label={`Max ${character.action_values["FortuneType"]}`}
            type="number"
            sx={{width: 100}}
            name="Max Fortune"
            value={character.action_values["Max Fortune"]}
            onChange={onChange}
            disabled={readOnly}
          />
        </Stack>
      </Stack>
    </>
  )
}
