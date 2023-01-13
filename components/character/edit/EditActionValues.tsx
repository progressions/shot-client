import { Stack, TextField, MenuItem } from "@mui/material"

import type { Character } from "../../../types/types"

interface EditActionValuesProps {
  character: Character
  onChange: any
}

export default function EditActionValues({ character, onChange }: EditActionValuesProps) {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField select fullWidth label="Main Attack" name="MainAttack" value={character.action_values["MainAttack"]} onChange={onChange}>
          <MenuItem value="Guns">Guns</MenuItem>
          <MenuItem value="Martial Arts">Martial Arts</MenuItem>
          <MenuItem value="Scroungetech">Scroungetech</MenuItem>
          <MenuItem value="Sorcery">Sorcery</MenuItem>
          <MenuItem value="Mutant">Mutant</MenuItem>
          <MenuItem value="Creature">Creature</MenuItem>
        </TextField>
        <TextField select fullWidth label="Secondary Attack" name="SecondaryAttack" value={character.action_values["SecondaryAttack"] || ""} onChange={onChange}>
          <MenuItem value="">None</MenuItem>
          <MenuItem value="Guns">Guns</MenuItem>
          <MenuItem value="Martial Arts">Martial Arts</MenuItem>
          <MenuItem value="Scroungetech">Scroungetech</MenuItem>
          <MenuItem value="Sorcery">Sorcery</MenuItem>
          <MenuItem value="Mutant">Mutant</MenuItem>
          <MenuItem value="Creature">Creature</MenuItem>
        </TextField>
      </Stack>
      <Stack direction="row" spacing={2}>
        <TextField label={character.action_values["MainAttack"]} type="number" sx={{width: 100}} name={character.action_values["MainAttack"] as string} value={character.action_values[character.action_values["MainAttack"] as string] || ''} onChange={onChange} />
        <TextField label={character.action_values["SecondaryAttack"]} type="number" sx={{width: 100}} name={(character.action_values["SecondaryAttack"] || "") as string} value={character.action_values[character.action_values["SecondaryAttack"] as string] || ''} onChange={onChange} />
        <TextField label="Defense" type="number" sx={{width: 100}} name="Defense" value={character.action_values?.['Defense'] || ''} onChange={onChange} />
        <TextField label="Toughness" type="number" sx={{width: 100}} name="Toughness" value={character.action_values?.['Toughness'] || ''} onChange={onChange} />
        <TextField label="Speed" type="number" sx={{width: 100}} name="Speed" value={character.action_values?.['Speed'] || ''} onChange={onChange} />
      </Stack>
    </>
  )
}
