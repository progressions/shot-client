import { Box, Stack, TextField, MenuItem } from "@mui/material"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import { Subhead, StyledSelect, StyledTextField } from "@/components/StyledFields"
import CS from "@/services/CharacterService"

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
          <StyledSelect select fullWidth label="Main Attack" name="MainAttack" value={CS.mainAttack(character)} onChange={onChange}>
            <MenuItem value="Guns">Guns</MenuItem>
            <MenuItem value="Martial Arts">Martial Arts</MenuItem>
            <MenuItem value="Scroungetech">Scroungetech</MenuItem>
            <MenuItem value="Sorcery">Sorcery</MenuItem>
            <MenuItem value="Mutant">Mutant</MenuItem>
            <MenuItem value="Creature">Creature</MenuItem>
          </StyledSelect>
          <PlayerTypeOnly character={character} except="Mook">
            <StyledSelect select fullWidth label="Secondary Attack" name="SecondaryAttack" value={CS.secondaryAttack(character)} onChange={onChange}>
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
          <StyledTextField label={CS.mainAttack(character)} type="number" sx={{width: 100}} name={CS.mainAttack(character)} value={CS.mainAttackValue(character)} onChange={onChange} />
          <PlayerTypeOnly character={character} except="Mook">
            <StyledTextField label={CS.secondaryAttack(character) || ""} type="number" sx={{width: 100}} name={CS.secondaryAttack(character) || ""} value={CS.secondaryAttackValue(character) || ""} onChange={onChange} />
          </PlayerTypeOnly>
          <StyledTextField label="Defense" type="number" sx={{width: 100}} name="Defense" value={CS.defense(character)} onChange={onChange} />
          <PlayerTypeOnly character={character} except="Mook">
            <StyledTextField label="Toughness" type="number" sx={{width: 100}} name="Toughness" value={CS.toughness(character)} onChange={onChange} />
          </PlayerTypeOnly>
          <StyledTextField label="Speed" type="number" sx={{width: 100}} name="Speed" value={CS.speed(character)} onChange={onChange} />
          <StyledTextField label="Damage" type="number" sx={{width: 100}} name="Damage" value={CS.damage(character)} onChange={onChange} />
        </Stack>
      </Stack>
    </>
  )
}
