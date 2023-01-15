import { Stack, Typography } from "@mui/material"
import GamemasterOnly from "../GamemasterOnly"

import type { Person } from "../../types/types"

interface WoundsDisplayProps {
  character: Person
  session: any
}

export default function WoundsDisplay({ character, session }: WoundsDisplayProps) {
  const getColors = (character: Person) =>  {
    if (["Boss", "Uber-Boss"].includes(character.action_values["Type"] as string) && character.action_values["Wounds"] > 50) {
      return ["primary.contrastText", "error.main"]
    }
    if (!["Mook"].includes(character.action_values["Type"] as string) && character.action_values["Wounds"] > 35) {
      return ["primary.contrastText", "error.main"]
    }
    return ["primary.contrastText", "primary.light"]
  }
  const [color, backgroundColor] = getColors(character)

  const wounds = character.action_values["Wounds"] || 0

  return (
    <GamemasterOnly user={session?.data?.user} character={character}>
      <Stack direction="column" sx={{width: 70, backgroundColor: backgroundColor, borderRadius: 2}} alignItems="center" p={1}>
        <Typography variant="h4" sx={{color: color}}>{wounds}</Typography>
        <Typography variant="subtitle1" sx={{color: color}}>
          { character.action_values["Type"] === "Mook" ? "Mooks" : "Wounds" }
        </Typography>
      </Stack>
    </GamemasterOnly>
  )
}
