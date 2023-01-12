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
    <Stack direction="row" spacing={1} alignItems="center">
      <ActionValueDisplay name="Acceleration" description="Acceleration" label="Acceleration" character={character} />
      <ActionValueDisplay name="Handling" description="Handling" label="Handling" character={character} />
      <ActionValueDisplay name="Squeal" description="Squeal" label="Squeal" character={character} />
      <ActionValueDisplay name="Frame" description="Frame" label="Frame" character={character} />
      <ActionValueDisplay name="Crunch" description="Crunch" label="Crunch" character={character} />
      <ActionValueDisplay name="Condition Points" description="Condition" label="Condition" character={character} />
    </Stack>
  )
}
/*
    <Stack>
      <Stack direction="row" spacing={0} sx={{width: 200, border: 0}}>
        <ActionValueDisplay label="Acc" description="Acceleration (Chase Speed)" name="Acceleration" character={character} />
        <ActionValueDisplay label="Han" description="Handling (Chase Toughness)" name="Handling" character={character} />
        <ActionValueDisplay label="Sq" description="Squeal (Chase Damage)" name="Squeal" character={character} />
        <Stack sx={{borderLeft: 1, borderLeftColor: borderColor}} />
      </Stack>
      <Stack direction="row" spacing={0} sx={{width: 200, border: 0}}>
        <ActionValueDisplay label="Fra" description="Frame (Collision Toughness)" name="Frame" character={character} />
        <ActionValueDisplay label="Cr" description="Crunch (Collision Damage)" name="Crunch" character={character} />
        <ActionValueDisplay label="Cond" description="Condition Points" name="Condition Points" character={character} />
        <Stack sx={{borderLeft: 1, borderLeftColor: borderColor}} />
      </Stack>
    </Stack>
    */
