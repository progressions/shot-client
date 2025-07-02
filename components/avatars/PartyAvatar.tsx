import { Avatar, Link } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import type { Party } from "@/types/types"

interface PartyAvatarProps {
  party: Party
  href?: string
  disablePopup?: boolean
}

const PartyAvatar = ({ party, href, disablePopup }: PartyAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)

  if (!party?.id) {
    return <></>
  }

  const initials = party.name
    ? party.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""

  const baseAvatar = (
    <Avatar
      alt={party.name}
      src={party.image_url || ""}
      ref={avatarRef}
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
        data-mention-id={party.id}
        data-mention-class-name="Party"
        sx={{ padding: 0, ml: -1.5 }}
      >
        {baseAvatar}
      </Link>
    )
  }

  return baseAvatar
}

export default PartyAvatar
