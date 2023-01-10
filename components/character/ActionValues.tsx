import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { Box, Stack, Typography } from '@mui/material'
import { tableCellClasses } from "@mui/material/TableCell"

import type { Character, ActionValues } from "../../types/types"
import { SxProps, Theme } from '@mui/material/styles'

interface ActionValuesParams {
  character: Character
}

interface ActionValueDisplayParams {
  name: string,
  label: string,
  character: Character,
  sx?: SxProps<Theme>
}

export default function ActionValues({ character }: ActionValuesParams) {
  const borderColor = "#aaa"
  const color = character.impairments ? 'red' : borderColor
  const styles = {
    width: 60,
    borderColor: borderColor,
    borderRight: 'none'
  }
  const ActionValueDisplay = ({ name, label, character, sx }: ActionValueDisplayParams) => {
    if (character.action_values?.[name]) {
      return (
        <Stack spacing={1} sx={sx || styles} border={1}>
          <Typography variant="body2" color="white" align="center" component="div"><Box bgcolor={borderColor}>{label}</Box></Typography>
          <Typography variant="h6" align="center" sx={{color: color}}>{(character.action_values[name] as number) - (character.impairments || 0)}</Typography>
        </Stack>
      )
    } else {
      return <></>
    }
  }

  return (
    <Stack direction="row" spacing={0}>
      <ActionValueDisplay label="Attack" name="Guns" character={character} />
      <ActionValueDisplay label="Defense" name="Defense" character={character} />
      { character?.action_values?.["Type"] !== "Mook" &&
        <ActionValueDisplay label="Tough" name="Toughness" character={character} /> }
      { ["PC", "Ally"].includes(character?.action_values?.["Type"] as string) &&
        <ActionValueDisplay label="Fortune" name="Fortune" character={character} /> }
      <ActionValueDisplay label="Speed" name="Speed" character={character} />
      <Stack sx={{borderLeft: 1, borderLeftColor: borderColor}} />
    </Stack>
  )
}
