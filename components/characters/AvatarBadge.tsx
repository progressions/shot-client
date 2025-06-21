import { Badge, Box, Typography } from "@mui/material"
import GamemasterOnly from '@/components/GamemasterOnly'
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import ImageDisplay from "@/components/characters/ImageDisplay"
import UserAvatar from '@/components/UserAvatar'
import { useWebSocket, useFight } from "@/contexts"

import CS from "@/services/CharacterService"
import FS from "@/services/FightService"
import { User, Character } from "@/types/types"

interface AvatarBadgeParams {
  character: Character,
  user: User | null
}

export default function AvatarBadge({ character, user }: AvatarBadgeParams) {
  const { viewingUsers } = useWebSocket()
  const { fight } = useFight()

  const users = FS.users(fight)

  const userOnline = (u?: User): boolean => {
    return viewingUsers.some((viewer) => viewer.id === u?.id)
  }

  const avatar = CS.isPC(character) ? (
    <UserAvatar user={character?.user} online={userOnline(character?.user)} />
    ) : <></>

  if (!character) {
    return null
  }

  return (
    <>
      <Badge color='error' badgeContent={character.impairments}>
        <Badge anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={avatar}>
          { <ImageDisplay character={character} /> }
        </Badge>
      </Badge>
      <Box width={75} sx={{textAlign: 'center'}}>
        <Typography variant="caption" sx={{color: 'text.secondary'}}>{CS.type(character)}</Typography>
      </Box>
      <Box width={75} sx={{textAlign: 'center'}}>
        { CS.isVehicle(character) && <DirectionsCarIcon sx={{color: "#aaa"}} /> }
      </Box>
    </>
  )
}

