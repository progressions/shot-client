import { Tooltip, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import { Box, Stack, Typography } from '@mui/material'

import type { Character, ActionValues } from "@/types/types"
import ActionValueDisplay from "@/components/characters/ActionValueDisplay"
import PlayerTypeOnly from "@/components/PlayerTypeOnly"
import CS from "@/services/CharacterService"

interface ActionValuesParams {
  character: Character
}

export default function ActionValues({ character }: ActionValuesParams) {
  return (
    <>
      <Box sx={{width: 450}}>
        <PlayerTypeOnly character={character} only="Mook">
          <Stack direction="row" spacing={1} alignItems="center">
            <ActionValueDisplay name={CS.mainAttack(character)} description={CS.mainAttack(character)} label={CS.mainAttack(character)} character={character} />
            <ActionValueDisplay name="Defense" description="Defense" label="Defense" character={character} />
            <ActionValueDisplay name="Speed" description="Speed" label="Speed" character={character} ignoreImpairments />
            <ActionValueDisplay name="Damage" description="Damage" label="Damage" character={character} ignoreImpairments />
          </Stack>
        </PlayerTypeOnly>
        <PlayerTypeOnly character={character} except="Mook">
          <Stack direction="row" spacing={1} alignItems="center">
            <ActionValueDisplay name={CS.mainAttack(character)} description={CS.mainAttack(character)} label={CS.mainAttack(character)} character={character} />
            <ActionValueDisplay name={CS.secondaryAttack(character)} description={CS.secondaryAttack(character)} label={CS.secondaryAttack(character)} character={character} />
            <ActionValueDisplay name="Defense" description="Defense" label="Defense" character={character} />
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <PlayerTypeOnly character={character} only="PC">
              <ActionValueDisplay name="Fortune" description={CS.fortuneType(character)} label={CS.fortuneType(character)} character={character} ignoreImpairments />
            </PlayerTypeOnly>
            <ActionValueDisplay name="Toughness" description="Toughness" label="Toughness" character={character} ignoreImpairments />
            <ActionValueDisplay name="Speed" description="Speed" label="Speed" character={character} ignoreImpairments />
            <ActionValueDisplay name="Damage" description="Damage" label="Damage" character={character} ignoreImpairments />
          </Stack>
        </PlayerTypeOnly>
      </Box>
    </>
  )
}
