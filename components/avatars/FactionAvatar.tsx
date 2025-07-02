import { Avatar, Link } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import type { Faction } from "@/types/types"

interface FactionAvatarProps {
  faction: Faction
  href?: string
  disablePopup?: boolean
}

const FactionAvatar = ({ faction, href, disablePopup }: FactionAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)

  if (!faction?.id) {
    return <></>
  }

  const initials = faction.name
    ? faction.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""

  const baseAvatar = (
    <Avatar
      alt={faction.name}
      src={faction.image_url || ""}
      ref={avatarRef}
      data-mention-id={faction.id}
      data-mention-class-name="Faction"
    >
      {initials}
    </Avatar>
  )

  if (disablePopup) {
    return baseAvatar
  }

  if (href) {
    return (
      <Link
        href={href}
        target="_blank"
        data-mention-id={faction.id}
        data-mention-class-name="Faction"
        sx={{ padding: 0, ml: -1.5 }}
      >
        {baseAvatar}
      </Link>
    )
  }

  return baseAvatar
}

export default FactionAvatar
