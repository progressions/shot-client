import { Typography, TextField } from "@mui/material"

export default function SkillField({ name, value, onChange }: any) {

  return (
    <>
      <TextField type="number" onChange={onChange} label={name} name={name} value={value} sx={{width: 80}} />
    </>
  )
}
