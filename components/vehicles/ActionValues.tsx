import { Tooltip, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { Box, Stack, Typography } from '@mui/material'
import { tableCellClasses } from "@mui/material/TableCell"

import type { Character, ActionValues } from "../../types/types"
import ActionValueDisplay from "../characters/ActionValueDisplay"

interface ActionValuesParams {
  character: Character
}

export default function ActionValues({ character }: ActionValuesParams) {
  return (
    <>
      <Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <ActionValueDisplay name="Acceleration" description="Acceleration" label="Acceleration" character={character} ignoreImpairments />
          <ActionValueDisplay name="Handling" description="Handling" label="Handling" character={character} ignoreImpairments />
          <ActionValueDisplay name="Squeal" description="Squeal" label="Squeal" character={character} ignoreImpairments />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <ActionValueDisplay name="Frame" description="Frame" label="Frame" character={character} ignoreImpairments />
          <ActionValueDisplay name="Crunch" description="Crunch" label="Crunch" character={character} ignoreImpairments />
        </Stack>
      </Box>
    </>
  )
}
