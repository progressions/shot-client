import { Grid, Typography, Box, Stack, Autocomplete, TextField } from "@mui/material"
import SkillField from "./SkillField"
import NewSkill from "./NewSkill"
import { Subhead } from "../../StyledFields"

import { useMemo } from "react"
import { Character, SkillValue, SkillValues } from "../../../types/types"

import CS from "../../../services/CharacterService"

interface SkillsProps {
  character: Character
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Skills({ character, onChange }: SkillsProps) {

  const knownSkills = CS.knownSkills(character)

  return (
    <>
      <Box>
        <Subhead>Skills</Subhead>
        <Grid container spacing={2}>
          { knownSkills.map (([name, value]: SkillValue) => (
            <Grid key={name} item xs={2}>
              <SkillField key={name} name={name} value={value as number} onChange={onChange} />
            </Grid>
          )) }
        </Grid>
        <NewSkill />
      </Box>
    </>
  )
}
