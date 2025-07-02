import { Link, Avatar } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import type { Character, Vehicle, Site, Party } from "@/types/types"
import CS from "@/services/CharacterService"

interface CharacterAvatarProps {
  character: Character
  href?: string
  disablePopup?: boolean
}

const CharacterAvatar = ({ character, href, disablePopup }: CharacterAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)

  if (!character?.id) {
    return <></>
  }

  const initials = character.name
    ? character.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""
  const defaultTooltip = CS.name(character) || "Unknown"

  const avatar = (
    <Avatar
      alt={character.name}
      src={character.image_url || ""}
      ref={avatarRef}
    >
      {initials}
    </Avatar>
  )

  return disablePopup ? (
    avatar
  ) : (
    <Link href={href} data-mention-id={character.id} data-mention-class-name="Character" sx={{ padding: 0, ml: -1.5 }}>
      {avatar}
    </Link>
  )
}

export default CharacterAvatar
