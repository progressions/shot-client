import { Typography, Box, Stack, Autocomplete, TextField } from "@mui/material"
import SkillField from "./SkillField"
import NewSkill from "./NewSkill"
import { Subhead } from "../../StyledFields"
import { rowMap } from "../../../utils/rowMap"

import { useMemo } from "react"
import { SkillValues } from "../../../types/types"

type SkillType = [string, number]

export function knownSkills(skills: SkillValues) {
  return Object.entries(skills).filter(([name, value]) => (value as number > 0))
}

interface SkillsProps {
  skills: SkillValues
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Skills({ skills, onChange }: SkillsProps) {

  const rowsOfData = rowMap(knownSkills(skills), 6)

  const outputRows = useMemo(() => {
    const output = (
      rowsOfData.map((row: any, index: number) => (
        <Stack spacing={1} direction="row" key={`row_${index}`}>
          { row.map(([name, value]: any) => (
            <SkillField key={name} name={name} value={value} onChange={onChange} />
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
