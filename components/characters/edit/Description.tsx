import { Typography, Stack } from "@mui/material"
import { Subhead, StyledTextField } from "@/components/StyledFields"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import type { Character } from "@/types/types"
import { DescriptionKeys as D } from "@/types/types"
import CS from "@/services/CharacterService"
import Editor from "@/components/editor/Editor"
import { useState } from "react"

interface DescriptionProps {
  character: Character
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Description({ character, onChange }: DescriptionProps) {
  const { description } = character

  return (
    <>
      <Subhead>Description</Subhead>
      <PlayerTypeOnly character={character} only="PC">
        <Typography variant="h6">Melodramatic Hook</Typography>
        <Editor name={D.MelodramaticHook} value={CS.descriptionValue(character, D.MelodramaticHook)} onChange={onChange} />
      </PlayerTypeOnly>
      <StyledTextField name={D.Nicknames} label="Nicknames" value={CS.descriptionValue(character, D.Nicknames)} onChange={onChange} />
      <Stack direction="row" spacing={1}>
        <StyledTextField name={D.Age} label="Age" value={CS.descriptionValue(character, D.Age)} onChange={onChange} />
        <StyledTextField name={D.Height} label="Height" value={CS.descriptionValue(character, D.Height)} onChange={onChange} />
        <StyledTextField name={D.Weight} label="Weight" value={CS.descriptionValue(character, D.Weight)} onChange={onChange} />
        <StyledTextField name={D.HairColor} label="Hair Color" value={CS.descriptionValue(character, D.HairColor)} onChange={onChange} />
        <StyledTextField name={D.EyeColor} label="Eye Color" value={CS.descriptionValue(character, D.EyeColor)} onChange={onChange} />
      </Stack>
      <StyledTextField fullWidth name={D.StyleOfDress} label="Style of Dress" value={CS.descriptionValue(character, D.StyleOfDress)} onChange={onChange} />
      <Typography variant="h6">Description</Typography>
      <Editor name={D.Appearance} value={CS.descriptionValue(character, D.Appearance)} onChange={onChange} />
      <Typography variant="h6">Background</Typography>
      <Editor name={D.Background} value={CS.descriptionValue(character, D.Background)} onChange={onChange} />
    </>
  )
}
