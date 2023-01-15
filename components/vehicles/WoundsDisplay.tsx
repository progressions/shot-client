import { Divider, Box, Stack, Typography } from "@mui/material"
import GamemasterOnly from "../GamemasterOnly"
import PlayerTypeOnly from "../PlayerTypeOnly"

import type { Vehicle } from "../../types/types"

interface WoundsDisplayProps {
  character: Vehicle
  session: any
}

export default function WoundsDisplay({ character, session }: WoundsDisplayProps) {
  const wounds = character.action_values["Chase Points"] || 0

  return (
    <GamemasterOnly user={session?.data?.user} character={character}>
      <Stack direction="column" sx={{width: 70}} alignItems="center" spacing={1}>
        <Stack direction="column" sx={{width: 70}} alignItems="center">
          <Typography variant="h4">{wounds}</Typography>
          <PlayerTypeOnly character={character} except="Mook">
            <Typography variant="subtitle1" sx={{color: 'text.secondary'}}>
              Chase
            </Typography>
          </PlayerTypeOnly>
          <PlayerTypeOnly character={character} type="Mook">
            <Typography variant="subtitle1" sx={{color: 'text.secondary'}}>
              Mooks
            </Typography>
          </PlayerTypeOnly>
        </Stack>
        <PlayerTypeOnly character={character} except="Mook">
          <Typography variant="h4">{character.action_values["Condition Points"]}</Typography>
          <Typography variant="subtitle1" sx={{color: 'text.secondary'}}>
            Cond
          </Typography>
        </PlayerTypeOnly>
      </Stack>
    </GamemasterOnly>
  )
}
