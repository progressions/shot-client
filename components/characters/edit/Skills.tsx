import { Typography, Box, Stack, Autocomplete, TextField } from "@mui/material"
import SkillField from "./SkillField"
import NewSkill from "./NewSkill"
import { Subhead } from "../../StyledFields"

import { useMemo } from "react"

function rowMap(array: any[], itemsPerRow: number) {
  const rows = []
  for (let i=0; i <= array.length; i+=itemsPerRow) {
    const row = []
    for (let j=0; j < itemsPerRow; j++) {
      if (i+j < array.length) {
        row.push(array[i+j])
      }
    }
    rows.push(row)
  }
  return rows
}

export function knownSkills(skills: any) {
  return Object.entries(skills).filter(([name, value]: any) => (value > 0))
}

export default function Skills({ skills, onChange }: any) {

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
