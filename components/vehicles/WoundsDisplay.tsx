import { Divider, Box, Stack, Typography } from "@mui/material"
import GamemasterOnly from "../GamemasterOnly"
import PlayerTypeOnly from "../PlayerTypeOnly"

import type { Vehicle } from "../../types/types"

interface WoundsDisplayProps {
  character: Vehicle
  session: any
}

export default function WoundsDisplay({ character, session }: WoundsDisplayProps) {
  const getColors = (character: Vehicle) =>  {
    if (["Boss", "Uber-Boss"].includes(character.action_values["Type"]) && character.action_values["Chase Points"] > 50) {
      return ["primary.contrastText", "error.main"]
    }
    if (["Mook"].includes(character.action_values["Type"])) {
      return ["primary.contrastText", "primary.light"]
    }
    if (character.action_values["Chase Points"] > 35) {
      return ["primary.contrastText", "error.main"]
    }
    return ["primary.contrastText", "primary.light"]
  }
  const [color, backgroundColor] = getColors(character)
  const wounds = character.action_values["Chase Points"] || 0

  return (
    <GamemasterOnly user={session?.data?.user} character={character}>
      <Stack direction="column" sx={{width: 70}} alignItems="center" spacing={1}>
        <Stack direction="column" sx={{width: 70, backgroundColor: backgroundColor, borderRadius: 2}} alignItems="center" p={1}>
          <Typography variant="h4" sx={{color: color}}>{wounds}</Typography>
          <PlayerTypeOnly character={character} except="Mook">
            <Typography variant="subtitle1" sx={{color: color}}>
              Chase
            </Typography>
          </PlayerTypeOnly>
          <PlayerTypeOnly character={character} only="Mook">
            <Typography variant="subtitle1" sx={{color: color}}>
              Mooks
            </Typography>
          </PlayerTypeOnly>
        </Stack>
        <PlayerTypeOnly character={character} except="Mook">
          <Stack direction="column" sx={{width: 70, backgroundColor: backgroundColor, borderRadius: 2}} alignItems="center" p={1}>
            <Typography variant="h4" sx={{color: color}}>{character.action_values["Condition Points"]}</Typography>
            <Typography variant="subtitle1" sx={{color: color}}>
              Cond
            </Typography>
          </Stack>
        </PlayerTypeOnly>
      </Stack>
    </GamemasterOnly>
  )
}
