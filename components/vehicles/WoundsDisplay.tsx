import { Stack, Typography } from "@mui/material"
import GamemasterOnly from "../GamemasterOnly"

import type { Vehicle } from "../../types/types"

interface WoundsDisplayProps {
  character: Vehicle
  session: any
}

export default function WoundsDisplay({ character, session }: WoundsDisplayProps) {
  const wounds = character.action_values["Wounds"] || 0

  return (
    <GamemasterOnly user={session?.data?.user} character={character}>
      <Stack direction="column" sx={{width: 70}} alignItems="center">
        <Typography variant="h3">{wounds}</Typography>
        <Typography variant="subtitle1" sx={{color: 'text.secondary'}}>
          { character.action_values["Type"] === "Mook" ? "Mooks" : "Chase" }
        </Typography>
      </Stack>
    </GamemasterOnly>
  )
}
