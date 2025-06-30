import React from "react"
import { Tooltip, AvatarGroup, Avatar, Typography } from "@mui/material"
import type { Fight, Character } from "@/types/types"
import { useWebSocket, useFight } from "@/contexts"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"
import FS from "@/services/FightService"
import CS from "@/services/CharacterService"

interface CharacterAvatarsProps {
  characters?: Character[]
}

const CharacterAvatars: React.FC<CharacterAvatarsProps> = ({ characters }) => {
  const { fight } = useFight()

  return (
    <AvatarGroup max={20} sx={{mx: 2}}>
      {(characters || [])
        // .filter(character => CS.isCharacter(character))
        .map((character, index) => (
          <CharacterAvatar href={CS.isVehicle(character) ? `/vehicles/${character.id}` : `/characters/${character.id}`} character={character} key={`character_${character.id}_${index}`} />
          )
        )
      }
    </AvatarGroup>
  )
}

export default CharacterAvatars
