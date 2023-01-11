import { Tooltip, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { Box, Stack, Typography } from '@mui/material'
import { tableCellClasses } from "@mui/material/TableCell"

import type { Character, ActionValues } from "../../types/types"
import ActionValueDisplay from "../ActionValueDisplay"

interface ActionValuesParams {
  character: Character
}

export default function ActionValues({ character }: ActionValuesParams) {
  const borderColor = "#aaa"

  return (
    <Stack>
      <Stack direction="row" spacing={0} sx={{width: 200, border: 0}}>
        <ActionValueDisplay label="Acc" description="Acceleration (Chase Speed)" name="Acceleration" character={character} />
        <ActionValueDisplay label="Han" description="Handling (Chase Toughness)" name="Handling" character={character} />
        <ActionValueDisplay label="Sq" description="Squeal (Chase Damage)" name="Squeal" character={character} />
        <ActionValueDisplay label="Fra" description="Frame (Collision Toughness)" name="Frame" character={character} />
        <ActionValueDisplay label="Cr" description="Crunch (Collision Damage)" name="Crunch" character={character} />
        <Stack sx={{borderLeft: 1, borderLeftColor: borderColor}} />
      </Stack>
    </Stack>
  )
}
