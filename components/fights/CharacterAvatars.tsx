import React from "react"
import { AvatarGroup } from "@mui/material"
import type { Character, Vehicle } from "@/types/types"
import { useFight } from "@/contexts"
import CharacterAvatar from "@/components/avatars/CharacterAvatar"
import VehicleAvatar from "@/components/avatars/VehicleAvatar" // Assumed import
import CS from "@/services/CharacterService"

interface CharacterAvatarsProps {
  characters?: Character[] | Vehicle[] // Allow both Character and Vehicle
}

const CharacterAvatars: React.FC<CharacterAvatarsProps> = ({ characters }) => {
  const { fight } = useFight()

  return (
    <AvatarGroup max={20} sx={{ mx: 2 }}>
      {(characters || []).map((character, index) =>
        CS.isVehicle(character) ? (
          <VehicleAvatar
            href={`/vehicles/${character.id}`}
            key={`${character.id}-${index}`}
            vehicle={character}
          />
        ) : (
          <CharacterAvatar
            href={`/characters/${character.id}`}
            key={`${character.id}-${index}`}
            character={character}
          />
        )
      )}
    </AvatarGroup>
  )
}

export default CharacterAvatars
