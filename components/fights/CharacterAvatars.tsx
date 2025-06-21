import React from "react"
import { Tooltip, AvatarGroup, Avatar, Typography } from "@mui/material"
import type { Fight, Character } from "@/types/types"
import { useWebSocket, useFight } from "@/contexts"
import CharacterAvatar from "@/components/characters/CharacterAvatar"
import FS from "@/services/FightService"

interface CharacterAvatarsProps {
  characters?: Character[]
}

const CharacterAvatars: React.FC<CharacterAvatarsProps> = ({ characters }) => {
  const { fight } = useFight()

  return (
    <AvatarGroup max={20} sx={{ justifyContent: "flex-start" }}>
      {(characters || []).map((character) => (
        <CharacterAvatar character={character} key={`character_${character.id}`} />
      ))}
    </AvatarGroup>
  )
}

export default CharacterAvatars
