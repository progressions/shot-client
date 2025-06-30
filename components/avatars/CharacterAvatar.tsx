import { Avatar, IconButton } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import { usePopup } from "@/components/popups"
import type { Character, Vehicle, Site, Party } from "@/types/types"
import CS from "@/services/CharacterService"

interface CharacterAvatarProps {
  character: Character
  href?: string
}

interface CustomAvatarProps {
  "data-mention-id"?: string
  "data-mention-class-name"?: string
}

const CustomAvatar = Avatar as React.ComponentType<
  React.ComponentProps<typeof Avatar> & CustomAvatarProps
>

const CharacterAvatar = ({ character, href }: CharacterAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)
  const { triggerPopup } = usePopup({ containerRef: avatarRef, user, client })

  useEffect(() => {
    const avatar = avatarRef.current
    if (!avatar) return

    const handleMouseOver = () => {
      triggerPopup({
        mentionId: character?.id || "",
        mentionClass: CS.isVehicle(character) ? "Vehicle" : "Character",
        target: avatar,
      })
    }

    avatar.addEventListener("mouseover", handleMouseOver)

    return () => {
      avatar.removeEventListener("mouseover", handleMouseOver)
    }
  }, [character, triggerPopup])

  if (!character?.id) {
    return <></>
  }

  const initials = character.name
    ? character.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""
  const defaultTooltip = CS.name(character) || "Unknown"

  const baseAvatar = (
    <CustomAvatar
      alt={character.name}
      src={character.image_url || ""}
      ref={avatarRef}
      data-mention-id={character.id}
      data-mention-class-name={CS.isVehicle(character) ? "Vehicle" : "Character"}
    >
      {initials}
    </CustomAvatar>
  )

  if (href) {
    return (
      <IconButton target="_blank" href={href} sx={{ padding: 0 }}>
        {baseAvatar}
      </IconButton>
    )
  }

  return baseAvatar
}

export default CharacterAvatar
