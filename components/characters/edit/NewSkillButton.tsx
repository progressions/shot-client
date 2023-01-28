import { Typography, Button, Stack, Box, Tooltip, IconButton } from "@mui/material"
import { useCharacter } from "../../../contexts/CharacterContext"
import AddIcon from '@mui/icons-material/Add'
import { StyledTextField, StyledAutocomplete } from "./StyledFields"

import { useMemo, useState } from "react"

export default function NewSkillButton({ }) {
  const [skill, setSkill] = useState({ name: "", value: 8 })
  const { state, dispatch } = useCharacter()
  const { edited, character } = state
  const [open, setOpen] = useState(false)

  const skills = useMemo(() => {
    const all = ["Deceit", "Detective", "Driving", "Fix-It", "Gambling", "Intimidation", "Intrusion", "Leadership", "Medicine", "Police", "Sabotage", "Seduction"]
    return all.filter((name) => (character.skills[name] <= 7))
  }, [character.skills])

  function selectSkill(event: any, newValue: any) {
    setSkill((prev) => ({ ...prev, name: newValue }))
  }

  function handleValue(event: any) {
    setSkill((prev) => ({ ...prev, value: event.target.value }))
  }

  function addSkill() {
    dispatch({ type: "skills", ...skill })
    cancelForm()
  }

  function cancelForm() {
    setSkill({ name: "", value: 8 })
    setOpen(false)
  }

  function getOptionLabel(option: any) {
    return option || ""
  }

  const valid = !!(skill?.name)

  const helperText = (skill?.name) ? "" : "Choose a skill"

  return (
    <>
      { !open &&
      <Box>
        <Tooltip title="Add Skill">
          <IconButton onClick={() => setOpen(true)} sx={{color: "white"}}>
            <AddIcon sx={{width: 30, height: 30}} />
          </IconButton>
        </Tooltip>
      </Box> }
      { open &&
        <Stack direction="row" spacing={2}>
          <StyledAutocomplete
            value={skill?.name || null}
            disabled={!skills?.length}
            options={skills || []}
            sx={{ width: 200 }}
            onChange={selectSkill}
            openOnFocus
            getOptionLabel={getOptionLabel}
            renderInput={(params: any) => <StyledTextField autoFocus helperText={helperText} {...params} label="Skill" error={!valid} />}
          />
        <StyledTextField value={skill?.value || ""} type="number" name="value" label="Value" onChange={handleValue} sx={{width: 80}} />
        <Typography sx={{paddingTop: 1}}>
          <Button variant="contained" color="primary" onClick={addSkill}>
            Add
          </Button>
        </Typography>
        <Typography sx={{paddingTop: 1}}>
          <Button variant="contained" color="secondary" onClick={cancelForm}>
            Cancel
          </Button>
        </Typography>
      </Stack> }
    </>
  )
}
