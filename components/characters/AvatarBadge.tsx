import { Badge, Avatar, Box, Typography } from "@mui/material"
import GamemasterOnly from '@/components/GamemasterOnly'
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import ImageDisplay from "@/components/characters/ImageDisplay"

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
        { !character.image_url && <Avatar sx={{width: 75, height: 75, bgcolor: character.color || 'secondary'}} variant="rounded">{character.name[0]}</Avatar> }
        { character.image_url && <ImageDisplay character={character} /> }
      </Badge>
      <GamemasterOnly user={user} character={character}>
        <Box width={75} sx={{textAlign: 'center'}}>
          <Typography variant="caption" sx={{color: 'text.secondary'}}>{CS.type(character)}</Typography>
        </Box>
        <Box width={90} sx={{textAlign: 'center'}}>
          { character.category === "vehicle" &&
            <DirectionsCarIcon sx={{color: "#aaa"}} /> }
          </Box>
      </GamemasterOnly>
    </>
  )
}

