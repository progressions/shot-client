import { Typography, Box, Stack, Autocomplete, TextField } from "@mui/material"
import SkillField from "./SkillField"
import NewSkill from "./NewSkill"
import { Subhead } from "../../StyledFields"
import { rowMap } from "../../../utils/rowMap"

import { useMemo } from "react"
import { SkillValue, SkillValues } from "../../../types/types"

export function knownSkills(skills: SkillValues) {
  return Object.entries(skills).filter(([name, value]: SkillValue) => (value as number > 0))
}

interface SkillsProps {
  skills: SkillValues
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Skills({ skills, onChange }: SkillsProps) {

  const rowsOfData = rowMap<SkillValue>(knownSkills(skills), 6)

  const outputRows = useMemo(() => {
    const output = (
      rowsOfData.map((row: SkillValue[], index: number) => (
        <Stack spacing={1} direction="row" key={`row_${index}`}>
          { row.map(([name, value]: SkillValue) => (
            <SkillField key={name} name={name} value={value as number} onChange={onChange} />
          )) }
        </Stack>
      ))
    )
    return output
  }, [onChange, rowsOfData])

  return (
    <>
      <Box>
        <Subhead>Skills</Subhead>
        <Stack spacing={2}>
          {
            outputRows
          }
          <NewSkill />
        </Stack>
      </Box>
    </>
  )
}
