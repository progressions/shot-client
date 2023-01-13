import { Tooltip, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { Box, Stack, Typography } from '@mui/material'
import { tableCellClasses } from "@mui/material/TableCell"

import type { Character, ActionValues } from "../../types/types"
import ActionValueDisplay from "../ActionValueDisplay"

interface ActionValuesParams {
  character: Character
}

export default function ActionValues({ character }: ActionValuesParams) {
  return (
    <>
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <ActionValueDisplay name="Acceleration" description="Acceleration" label="Acceleration" character={character} />
          <ActionValueDisplay name="Handling" description="Handling" label="Handling" character={character} />
          <ActionValueDisplay name="Squeal" description="Squeal" label="Squeal" character={character} />
          <ActionValueDisplay name="Frame" description="Frame" label="Frame" character={character} />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <ActionValueDisplay name="Crunch" description="Crunch" label="Crunch" character={character} />
          <ActionValueDisplay name="Condition Points" description="Condition" label="Condition" character={character} />
        </Stack>
      </Box>
    </>
  )
}
