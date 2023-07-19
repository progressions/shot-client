import { Typography, Stack } from "@mui/material"
import { Subhead, StyledTextField } from "../../StyledFields"
import PlayerTypeOnly from "../../PlayerTypeOnly"
import type { Character } from "../../../types/types"

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
        <StyledTextField name="Melodramatic Hook" label="Melodramatic Hook" value={description["Melodramatic Hook"]} onChange={onChange} multiline rows={4} />
      </PlayerTypeOnly>
      <StyledTextField name="Nicknames" label="Nicknames" value={description["Nicknames"]} onChange={onChange} />
      <Stack direction="row" spacing={1}>
        <StyledTextField name="Age" label="Age" value={description["Age"]} onChange={onChange} />
        <StyledTextField name="Height" label="Height" value={description["Height"]} onChange={onChange} />
        <StyledTextField name="Weight" label="Weight" value={description["Weight"]} onChange={onChange} />
        <StyledTextField name="Hair Color" label="Hair Color" value={description["Hair Color"]} onChange={onChange} />
        <StyledTextField name="Eye Color" label="Eye Color" value={description["Eye Color"]} onChange={onChange} />
      </Stack>
        <StyledTextField fullWidth name="Style of Dress" label="Style of Dress" value={description["Style of Dress"]} onChange={onChange} />
      <StyledTextField name="Appearance" label="Appearance" value={description["Appearance"]} onChange={onChange} multiline rows={4} />
      <StyledTextField name="Background" label="Background" value={description["Background"]} onChange={onChange} multiline rows={4} />
    </>
  )
}
