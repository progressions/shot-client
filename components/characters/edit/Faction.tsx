import { TextField } from "@mui/material"

export default function Faction({ faction, onChange }: any) {
  return (
    <>
      <TextField name="Faction" label="Faction" fullWidth onChange={onChange} value={faction} />
    </>
  )
}
