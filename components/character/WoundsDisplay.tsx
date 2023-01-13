import { Stack, Typography } from "@mui/material"
import GamemasterOnly from "../GamemasterOnly"

import type { Person } from "../../types/types"

interface WoundsDisplayProps {
  character: Person
  session: any
}

export default function WoundsDisplay({ character, session }: WoundsDisplayProps) {
  const wounds = character.action_values["Wounds"] || 0

  return (
    <GamemasterOnly user={session?.data?.user} character={character}>
      <Stack direction="column" sx={{width: 70}} alignItems="center">
        <Typography variant="h4">{wounds}</Typography>
        <Typography variant="subtitle1" sx={{color: 'text.secondary'}}>
          { character.action_values["Type"] === "Mook" ? "Mooks" : "Wounds" }
        </Typography>
      </Stack>
    </GamemasterOnly>
  )
}
