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
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <ActionValueDisplay name={character.action_values["MainAttack"] as string} description={character.action_values["MainAttack"] as string} label={character.action_values["MainAttack"] as string} character={character} />
      <ActionValueDisplay name={character.action_values["SecondaryAttack"] as string} description={character.action_values["SecondaryAttack"] as string} label={character.action_values["SecondaryAttack"] as string} character={character} />
      <ActionValueDisplay name="Defense" description="Defense" label="Defense" character={character} />
      <ActionValueDisplay name="Fortune" description={character.action_values["FortuneType"] as string} label={character.action_values["FortuneType"] as string} character={character} />
      <ActionValueDisplay name="Speed" description="Speed" label="Speed" character={character} />
    </Stack>
  )
}
