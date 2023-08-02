import { Stack, Typography } from "@mui/material"
import GamemasterOnly from "../GamemasterOnly"
import CS from "../../services/CharacterService"

import type { User, Person } from "../../types/types"

interface WoundsDisplayProps {
  character: Person
  user: User | null
}

export default function WoundsDisplay({ character, user }: WoundsDisplayProps) {
  const getColors = (character: Person) =>  {
    if (CS.seriousWounds(character)) {
      return ["primary.contrastText", "error.main"]
    }
    return ["primary.contrastText", "primary.light"]
  }
  const [color, backgroundColor] = getColors(character)

  const wounds = CS.wounds(character)

  const label = CS.woundsLabel(character)

  return (
    <GamemasterOnly user={user} character={character}>
      <Stack direction="column" sx={{width: 70, backgroundColor: backgroundColor, borderRadius: 2}} alignItems="center" p={1}>
        <Typography variant="h4" sx={{color: color}}>{wounds}</Typography>
        <Typography variant="subtitle1" sx={{color: color}}>
          { label }
        </Typography>
      </Stack>
    </GamemasterOnly>
  )
}
