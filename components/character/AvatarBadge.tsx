import { Badge, Avatar, Box, Typography } from "@mui/material"
import GamemasterOnly from '../GamemasterOnly'

import type { Character } from "../../types/types"

interface AvatarBadgeParams {
  character: Character,
  session: any
}

export default function AvatarBadge({ character, session }: AvatarBadgeParams) {
  const names = {
    "PC": "PC",
    "Ally": "Ally",
    "Mook": "Mook",
    "Featured Foe": "Foe",
    "Boss": "Boss",
    "Uber-Boss": "Uber"
  } as any

  const charType = character.action_values['Type']

  return (
    <>
      <Badge color='error' badgeContent={character.impairments}>
        <Avatar sx={{bgcolor: character.color || 'secondary'}} variant="rounded">{character.name[0]}</Avatar>
      </Badge>
      <GamemasterOnly user={session?.data?.user} character={character}>
        <Box width={40} sx={{textAlign: 'center'}}>
          <Typography variant="h6" sx={{color: 'text.secondary', fontVariant: 'small-caps', textTransform: 'lowercase'}}>{charType && names[charType]}</Typography>
        </Box>
      </GamemasterOnly>
    </>
  )
}

