import { styled, Badge, Avatar, IconButton, Tooltip } from "@mui/material"
import { useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import { usePopup } from "@/components/popups/usePopup"
import type { Character } from "@/types/types"

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
        mentionClass: "Character",
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
      data-mention-class-name="Character"
    >
      {initials}
    </Avatar>
  )

  if (href) {
    return (
      <IconButton href={href} sx={{ padding: 0 }}>
        {baseAvatar}
      </IconButton>
    )
  }

  return baseAvatar
}

export default CharacterAvatar
