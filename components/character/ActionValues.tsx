import { Tooltip, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { Box, Stack, Typography } from '@mui/material'
import { tableCellClasses } from "@mui/material/TableCell"

import type { Character, ActionValues } from "../../types/types"
import { SxProps, Theme } from '@mui/material/styles'
import ActionValueDisplay from "../ActionValueDisplay"

interface ActionValuesParams {
  character: Character
}

export default function ActionValues({ character }: ActionValuesParams) {
  const borderColor = "#aaa"
  return (
    <Stack direction="row" spacing={0} sx={{width: 200, border: 0}}>
      <ActionValueDisplay label="Att" description="Attack" name="Guns" character={character} />
      <ActionValueDisplay label="Def" description="Defense" name="Defense" character={character} />
      { character?.action_values?.["Type"] !== "Mook" &&
        <ActionValueDisplay label="Tuf" description="Toughness" name="Toughness" character={character} /> }
      { ["PC", "Ally"].includes(character?.action_values?.["Type"] as string) &&
        <ActionValueDisplay label="Fort" description="Fortune" name="Fortune" character={character} /> }
      <ActionValueDisplay label="Spd" description="Speed" name="Speed" character={character} />
      <Stack sx={{borderLeft: 1, borderLeftColor: borderColor}} />
    </Stack>
  )
}
