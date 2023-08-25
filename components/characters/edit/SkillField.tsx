import { IconButton, Typography, TextField } from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear'
import { StyledTextField } from "@/components/StyledFields"

interface SkillFieldProps {
  name: string
  value: number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SkillField({ name, value, onChange }: SkillFieldProps) {

  const valid = (name && (value > 7))

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (parseInt(event.target.value) > 7) {
      onChange(event)
    }
  }

  function removeSkill() {
    onChange({target: {name: name, value: "0"}} as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <>
      <StyledTextField type="number" disabled={!valid} onChange={handleChange} label={name} name={name} value={value} sx={{width: 80}} />
      <IconButton onClick={removeSkill}>
        <ClearIcon />
      </IconButton>
    </>
  )
}
