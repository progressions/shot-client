import { Typography, Box, Stack, Autocomplete, TextField } from "@mui/material"
import SkillField from "./SkillField"
import NewSkillButton from "./NewSkillButton"

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

export default function Skills({ skills, onChange }) {

  const knownSkills = useMemo(() => {
    return Object.entries(skills).filter(([name, value]) => (value > 7))
  }, [skills])

  const rowsOfData = rowMap(knownSkills, 6)

  const outputRows = useMemo(() => {
    const output = (
      rowsOfData.map((row: any, index: number) => (
        <Stack spacing={1} direction="row" key={`row_${index}`}>
          { row.map(([name, value]) => (
            <SkillField key={name} name={name} value={value} onChange={onChange} />
          )) }
        </Stack>
      ))
    )
    return output
  }, [rowsOfData])

  return (
    <>
      <Box>
        <Typography variant="h5" gutterBottom>Skills</Typography>
          <Stack spacing={2}>
            {
              outputRows
            }
            <NewSkillButton />
          </Stack>
      </Box>
    </>
  )
}
