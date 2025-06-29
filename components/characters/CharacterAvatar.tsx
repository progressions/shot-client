import { styled, Badge, Avatar, IconButton, Tooltip } from "@mui/material"
import { useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import { usePopup } from "@/components/popups"
import type { Character } from "@/types/types"
import CS from "@/services/CharacterService"

interface CharacterAvatarProps {
  character?: Character
  tooltip?: string
  href?: string
}

const CharacterAvatar = ({ character, tooltip, href }: CharacterAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef = useRef<HTMLElement>(null)
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
  }, [character?.id, triggerPopup])

  if (!character?.id) {
    return <></>
  }

  const initials = character.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
  const defaultTooltip = character.name || "Character"

  const baseAvatar = (
    <Avatar
      alt={character.name}
      src={character.image_url || ""}
      ref={avatarRef}
      data-mention-id={character.id}
      data-mention-class-name={ CS.isVehicle(character) ? "Vehicle" : "Character" }
    >
      {initials}
    </Avatar>
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
