import { Badge, Avatar, Box, Typography } from "@mui/material"
import GamemasterOnly from '@/components/GamemasterOnly'
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"

import CS from "@/services/CharacterService"
import { User, Character } from "@/types/types"

interface AvatarBadgeParams {
  character: Character,
  user: User | null
}

export default function AvatarBadge({ character, user }: AvatarBadgeParams) {
  return (
    <>
      <Badge color='error' badgeContent={character.impairments}>
        <Avatar sx={{bgcolor: character.color || 'secondary'}} variant="rounded">{character.name[0]}</Avatar>
      </Badge>
      <GamemasterOnly user={user} character={character}>
        <Box width={40} sx={{textAlign: 'center'}}>
          <Typography variant="caption" sx={{color: 'text.secondary'}}>{CS.type(character)}</Typography>
        </Box>
        <Box width={40} sx={{textAlign: 'center'}}>
          { character.category === "vehicle" &&
            <DirectionsCarIcon sx={{color: "#aaa"}} /> }
          </Box>
      </GamemasterOnly>
    </>
  )
}

