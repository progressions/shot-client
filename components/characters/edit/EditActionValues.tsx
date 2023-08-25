import { Box, Stack, TextField, MenuItem } from "@mui/material"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import { Subhead, StyledSelect, StyledTextField } from "@/components/StyledFields"

import type { Character } from "@/types/types"

interface EditActionValuesProps {
  character: Character
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EditActionValues({ character, onChange }: EditActionValuesProps) {
  return (
    <>
      <Stack spacing={2}>
        <Subhead>Action Values</Subhead>
        <Stack direction="row" spacing={2}>
          <StyledSelect select fullWidth label="Main Attack" name="MainAttack" value={character.action_values["MainAttack"] || "Guns"} onChange={onChange}>
            <MenuItem value="Guns">Guns</MenuItem>
            <MenuItem value="Martial Arts">Martial Arts</MenuItem>
            <MenuItem value="Scroungetech">Scroungetech</MenuItem>
            <MenuItem value="Sorcery">Sorcery</MenuItem>
            <MenuItem value="Mutant">Mutant</MenuItem>
            <MenuItem value="Creature">Creature</MenuItem>
          </StyledSelect>
          <PlayerTypeOnly character={character} except="Mook">
            <StyledSelect select fullWidth label="Secondary Attack" name="SecondaryAttack" value={character.action_values["SecondaryAttack"] || ""} onChange={onChange}>
              <MenuItem value="null">None</MenuItem>
              <MenuItem value="Guns">Guns</MenuItem>
              <MenuItem value="Martial Arts">Martial Arts</MenuItem>
              <MenuItem value="Scroungetech">Scroungetech</MenuItem>
              <MenuItem value="Sorcery">Sorcery</MenuItem>
              <MenuItem value="Mutant">Mutant</MenuItem>
              <MenuItem value="Creature">Creature</MenuItem>
            </StyledSelect>
          </PlayerTypeOnly>
        </Stack>
        <Stack direction="row" spacing={2}>
          <StyledTextField label={character.action_values["MainAttack"]} type="number" sx={{width: 100}} name={character.action_values["MainAttack"] as string} value={character.action_values[character.action_values["MainAttack"] as string] || ''} onChange={onChange} />
          <PlayerTypeOnly character={character} except="Mook">
            <StyledTextField label={character.action_values["SecondaryAttack"]} type="number" sx={{width: 100}} name={(character.action_values["SecondaryAttack"] || "") as string} value={character.action_values[character.action_values["SecondaryAttack"] as string] || ''} onChange={onChange} />
          </PlayerTypeOnly>
          <StyledTextField label="Defense" type="number" sx={{width: 100}} name="Defense" value={character.action_values?.['Defense'] || ''} onChange={onChange} />
          <PlayerTypeOnly character={character} except="Mook">
            <StyledTextField label="Toughness" type="number" sx={{width: 100}} name="Toughness" value={character.action_values?.['Toughness'] || ''} onChange={onChange} />
          </PlayerTypeOnly>
          <StyledTextField label="Speed" type="number" sx={{width: 100}} name="Speed" value={character.action_values?.['Speed'] || ''} onChange={onChange} />
          <StyledTextField label="Damage" type="number" sx={{width: 100}} name="Damage" value={character.action_values?.['Damage'] || ''} onChange={onChange} />
        </Stack>
      </Stack>
    </>
  )
}
