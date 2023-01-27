import { IconButton, Typography, TextField } from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear'
import { StyledTextField } from "./StyledFields"

export default function SkillField({ name, value, onChange }: any) {

  const valid = (name && (value > 7))

  function handleChange(event: any) {
    if (event.target.value > 7) {
      onChange(event)
    }
  }

  function removeSkill() {
    onChange({target: {name: name, value: 0}})
  }

  return (
    <>
      <StyledTextField type="number" disabled={!valid} onChange={handleChange} label={name} name={name} value={value} sx={{width: 80}} />
      <IconButton onClick={removeSkill}>
        <ClearIcon sx={{color: "white"}} />
      </IconButton>
    </>
  )
}
