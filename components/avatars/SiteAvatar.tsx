import { Avatar, Link } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import type { Site } from "@/types/types"

interface SiteAvatarProps {
  site: Site
  href?: string
  disablePopup?: boolean
}

const SiteAvatar = ({ site, href, disablePopup }: SiteAvatarProps) => {
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)

  if (!site?.id) {
    return <></>
  }

  const initials = site.name
    ? site.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""

  const baseAvatar = (
    <Avatar
      alt={site.name}
      src={site.image_url || ""}
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
        data-mention-id={site.id}
        data-mention-class-name="Site"
        sx={{ padding: 0, ml: -1.5 }}
      >
        {baseAvatar}
      </Link>
    )
  }

  return baseAvatar
}

export default SiteAvatar
