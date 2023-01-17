import { Tooltip, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { Box, Stack, Typography } from '@mui/material'
import { tableCellClasses } from "@mui/material/TableCell"

import type { Character, ActionValues } from "../../types/types"
import { SxProps, Theme } from '@mui/material/styles'
import ActionValueDisplay from "./ActionValueDisplay"
import PlayerTypeOnly from "../PlayerTypeOnly"

interface ActionValuesParams {
  character: Character
}

export default function ActionValues({ character }: ActionValuesParams) {
  return (
    <>
      <Box>
        <PlayerTypeOnly character={character} only="Mook">
          <Stack direction="row" spacing={1} alignItems="center">
            <ActionValueDisplay name={character.action_values["MainAttack"] as string} description={character.action_values["MainAttack"] as string} label={character.action_values["MainAttack"] as string} character={character} />
            <ActionValueDisplay name="Defense" description="Defense" label="Defense" character={character} />
            <ActionValueDisplay name="Speed" description="Speed" label="Speed" character={character} />
            <ActionValueDisplay name="Damage" description="Damage" label="Damage" character={character} />
          </Stack>
        </PlayerTypeOnly>
        <PlayerTypeOnly character={character} except="Mook">
          <Stack direction="row" spacing={1} alignItems="center">
            <ActionValueDisplay name={character.action_values["MainAttack"] as string} description={character.action_values["MainAttack"] as string} label={character.action_values["MainAttack"] as string} character={character} />
            <ActionValueDisplay name={character.action_values["SecondaryAttack"] as string} description={character.action_values["SecondaryAttack"] as string} label={character.action_values["SecondaryAttack"] as string} character={character} />
            <ActionValueDisplay name="Defense" description="Defense" label="Defense" character={character} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <PlayerTypeOnly character={character} only="PC">
              <ActionValueDisplay name="Fortune" description={character.action_values["FortuneType"] as string} label={character.action_values["FortuneType"] as string} character={character} />
            </PlayerTypeOnly>
            <ActionValueDisplay name="Toughness" description="Toughness" label="Toughness" character={character} />
            <ActionValueDisplay name="Speed" description="Speed" label="Speed" character={character} />
            <ActionValueDisplay name="Damage" description="Damage" label="Damage" character={character} ignoreImpairments />
          </Stack>
        </PlayerTypeOnly>
      </Box>
    </>
  )
}
