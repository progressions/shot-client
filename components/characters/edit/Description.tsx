import { Typography, Stack, TextField } from "@mui/material"
import Subhead from "./Subhead"
import { StyledTextField } from "./StyledFields"

export default function Description({ description, onChange }: any) {
  return (
    <>
      <Subhead>Description</Subhead>
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
