import { Typography, Stack, TextField } from "@mui/material"

export default function Description({ description, onChange }) {
  return (
    <>
      <Typography variant="h6">Description</Typography>
      <TextField name="Nicknames" label="Nicknames" value={description["Nicknames"]} onChange={onChange} />
      <Stack direction="row" spacing={1}>
        <TextField name="Age" label="Age" value={description["Age"]} onChange={onChange} />
        <TextField name="Height" label="Height" value={description["Height"]} onChange={onChange} />
        <TextField name="Weight" label="Weight" value={description["Weight"]} onChange={onChange} />
        <TextField name="Hair Color" label="Hair Color" value={description["Hair Color"]} onChange={onChange} />
        <TextField name="Eye Color" label="Eye Color" value={description["Eye Color"]} onChange={onChange} />
      </Stack>
        <TextField fullWidth name="Style of Dress" label="Style of Dress" value={description["Style of Dress"]} onChange={onChange} />
      <TextField name="Appearance" label="Appearance" value={description["Appearance"]} onChange={onChange} multiline rows={4} />
      <TextField name="Background" label="Background" value={description["Background"]} onChange={onChange} multiline rows={4} />
    </>
  )
}
