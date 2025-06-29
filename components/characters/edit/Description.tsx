import { Typography, Stack } from "@mui/material"
import { Subhead, StyledTextField } from "@/components/StyledFields"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import type { Character } from "@/types/types"
import { DescriptionKeys as D } from "@/types/types"
import CS from "@/services/CharacterService"
import Editor from "@/components/editor/Editor
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
        <StyledTextField name={D.MelodramaticHook} label="Melodramatic Hook" value={CS.description(character, D.MelodramaticHook)} onChange={onChange} multiline rows={4} />
      </PlayerTypeOnly>
      <StyledTextField name={D.Nicknames} label="Nicknames" value={CS.description(character, D.Nicknames)} onChange={onChange} />
      <Stack direction="row" spacing={1}>
        <StyledTextField name={D.Age} label="Age" value={CS.description(character, D.Age)} onChange={onChange} />
        <StyledTextField name={D.Height} label="Height" value={CS.description(character, D.Height)} onChange={onChange} />
        <StyledTextField name={D.Weight} label="Weight" value={CS.description(character, D.Weight)} onChange={onChange} />
        <StyledTextField name={D.HairColor} label="Hair Color" value={CS.description(character, D.HairColor)} onChange={onChange} />
        <StyledTextField name={D.EyeColor} label="Eye Color" value={CS.description(character, D.EyeColor)} onChange={onChange} />
      </Stack>
      <StyledTextField fullWidth name={D.StyleOfDress} label="Style of Dress" value={CS.description(character, D.StyleOfDress)} onChange={onChange} />
      <Typography variant="h6">Appearance</Typography>
      <Editor name={D.Appearance} value={CS.description(character, D.Appearance)} onChange={onChange} />
      <Typography variant="h6">Background</Typography>
      <Editor name={D.Background} value={CS.description(character, D.Background)} onChange={onChange} />
    </>
  )
}
