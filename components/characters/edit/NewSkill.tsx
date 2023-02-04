import { createFilterOptions, Typography, Button, Stack, Box, Tooltip, IconButton } from "@mui/material"
import { useCharacter } from "../../../contexts/CharacterContext"
import AddIcon from '@mui/icons-material/Add'
import { StyledTextField, StyledAutocomplete } from "../../StyledFields"

import { useEffect, useMemo, useState } from "react"
import type { OptionType, FilterParamsType, InputParamsType } from "../../../types/types"
import { CharacterActions } from "../../../reducers/characterState"

const filter = createFilterOptions<string>();

interface SkillValue {
  name: string
  value: number
}

export default function NewSkill() {
  const [skill, setSkill] = useState<SkillValue>({ name: "", value: 8 })
  const { state, dispatch } = useCharacter()
  const { edited, character } = state
  const [open, setOpen] = useState(false)

  const initialSkills = useMemo(() => {
    const all = ["Deceit", "Detective", "Driving", "Fix-It", "Gambling", "Intimidation", "Intrusion", "Leadership", "Medicine", "Police", "Sabotage", "Seduction", "Constituion", "Will", "Notice", "Strength"]
    return all.filter((name: string) => ((character.skills?.[name] as number) <= 7))
  }, [character.skills])

  const [skills, setSkills] = useState(initialSkills)

  function selectSkill(event: React.ChangeEvent<HTMLInputElement>, newValue: string): void {
    const value = newValue.replace('Add "', "").replace('"', "");
    setSkill((prev: SkillValue) => ({ ...prev, name: value } as SkillValue))
  }

  function handleValue(event: React.ChangeEvent<HTMLInputElement>): void {
    setSkill((prev: SkillValue) => ({ ...prev, value: parseInt(event.target.value as string) } as SkillValue))
  }

  function addSkill(): void {
    dispatch({ type: CharacterActions.SKILLS, ...skill })
    cancelForm()
  }

  function cancelForm(): void {
    setSkill({ name: "", value: 8 })
    setOpen(false)
  }

  function getOptionLabel(option: string | OptionType): string {
    // Value selected with enter, right from the input
    if (typeof option === 'string') {
      return option
    }
    // Add "xxx" option created dynamically
    if (option.inputValue) {
      return option.inputValue as string
    }
    // Regular option
    return option as unknown as string
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
            freeSolo
            value={skill?.name || null}
            disabled={!skills?.length}
            options={skills || []}
            sx={{ width: 200 }}
            onChange={selectSkill}
            openOnFocus
            getOptionLabel={getOptionLabel}
            filterOptions={(options: string[], params: FilterParamsType) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some((option: string) => inputValue === option);
              if (inputValue !== '' && !isExisting) {
                filtered.push(
                  `Add "${inputValue}"`
                );
              }

              return filtered;
            }}
            renderInput={(params: InputParamsType) => <StyledTextField autoFocus helperText={helperText} {...params} label="Skill" error={!valid} />}
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
