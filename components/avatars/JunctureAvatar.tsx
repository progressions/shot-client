import { Avatar, Link } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import type { Juncture } from "@/types/types"

interface JunctureAvatarProps {
  juncture: Juncture
  href?: string
  disablePopup?: boolean
}

const JunctureAvatar = ({ juncture, href, disablePopup }: JunctureAvatarProps) => {
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)

  if (!juncture?.id) {
    return <></>
  }

  const initials = juncture.name
    ? juncture.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""

  const baseAvatar = (
    <Avatar
      alt={juncture.name}
      src={juncture.image_url || ""}
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
        data-mention-id={juncture.id}
        data-mention-class-name="Juncture"
        sx={{ padding: 0, ml: -1.5 }}
      >
        {baseAvatar}
      </Link>
    )
  }

  return baseAvatar
}

export default JunctureAvatar
