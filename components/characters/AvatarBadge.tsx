import { Badge, Avatar, Box, Typography } from "@mui/material"
import GamemasterOnly from '../GamemasterOnly'
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"

import type { User, Character } from "../../types/types"

interface AvatarBadgeParams {
  character: Character,
  user: User | null
}

export default function AvatarBadge({ character, user }: AvatarBadgeParams) {
  const names = {
    "PC": "PC",
    "Ally": "Ally",
    "Mook": "Mook",
    "Featured Foe": "Foe",
    "Boss": "Boss",
    "Uber-Boss": "Uber"
  }

  const charType = character.action_values['Type']

  return (
    <>
      <Badge color='error' badgeContent={character.impairments}>
        <Avatar sx={{bgcolor: character.color || 'secondary'}} variant="rounded">{character.name[0]}</Avatar>
      </Badge>
      <GamemasterOnly user={user} character={character}>
        <Box width={40} sx={{textAlign: 'center'}}>
          <Typography variant="caption" sx={{color: 'text.secondary'}}>{charType && names[charType]}</Typography>
        </Box>
        <Box width={40} sx={{textAlign: 'center'}}>
          { character.category === "vehicle" &&
            <DirectionsCarIcon sx={{color: "#aaa"}} /> }
          </Box>
      </GamemasterOnly>
    </>
  )
}

