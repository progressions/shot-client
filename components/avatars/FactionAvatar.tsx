import { Avatar, IconButton } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import { usePopup } from "@/components/popups"
import type { Faction } from "@/types/types"

interface FactionAvatarProps {
  faction: Faction
  href?: string
}

interface CustomAvatarProps {
  "data-mention-id"?: string
  "data-mention-class-name"?: string
}

const CustomAvatar = Avatar as React.ComponentType<
  React.ComponentProps<typeof Avatar> & CustomAvatarProps
>

const FactionAvatar = ({ faction, href }: FactionAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)
  const { triggerPopup } = usePopup({ containerRef: avatarRef, user, client })

  useEffect(() => {
    const avatar = avatarRef.current
    if (!avatar) return

    const handleMouseOver = () => {
      triggerPopup({
        mentionId: faction?.id || "",
        mentionClass: "Faction",
        target: avatar,
      })
    }

    avatar.addEventListener("mouseover", handleMouseOver)

    return () => {
      avatar.removeEventListener("mouseover", handleMouseOver)
    }
  }, [faction, triggerPopup])

  if (!faction?.id) {
    return <></>
  }

  const initials = faction.name
    ? faction.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""

  const baseAvatar = (
    <CustomAvatar
      alt={faction.name}
      src={faction.image_url || ""}
      ref={avatarRef}
      data-mention-id={faction.id}
      data-mention-class-name="Faction"
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

export default FactionAvatar
