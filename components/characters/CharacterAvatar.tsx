import { styled, Badge, Avatar, IconButton, Tooltip } from "@mui/material"

import type { Character } from "@/types/types"

interface CharacterAvatarProps {
  character?: Character
  tooltip?: string
  href?: string
}

const CharacterAvatar = ({ character, tooltip, href }: CharacterAvatarProps) => {
  if (!character?.id) {
    return <></>
  }

  const initials = character.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
  const defaultTooltip = character.name || "Character"

  const baseAvatar = (
    <Avatar alt={character.name} src={character.image_url || ""}>
      {initials}
    </Avatar>
  )

  if (href) {
    return (
      <Tooltip title={tooltip || defaultTooltip}>
        <IconButton href='/profile'>
          {baseAvatar}
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={tooltip || defaultTooltip}>
      {baseAvatar}
    </Tooltip>
  )
}

export default CharacterAvatar

