import { Avatar, IconButton } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import { usePopup } from "@/components/popups"
import type { Site } from "@/types/types"

interface SiteAvatarProps {
  site: Site
  href?: string
}

interface CustomAvatarProps {
  "data-mention-id"?: string
  "data-mention-class-name"?: string
}

const CustomAvatar = Avatar as React.ComponentType<
  React.ComponentProps<typeof Avatar> & CustomAvatarProps
>

const SiteAvatar = ({ site, href }: SiteAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)
  const { triggerPopup } = usePopup({ containerRef: avatarRef, user, client })

  useEffect(() => {
    const avatar = avatarRef.current
    if (!avatar) return

    const handleMouseOver = () => {
      triggerPopup({
        mentionId: site?.id || "",
        mentionClass: "Site",
        target: avatar,
      })
    }

    avatar.addEventListener("mouseover", handleMouseOver)

    return () => {
      avatar.removeEventListener("mouseover", handleMouseOver)
    }
  }, [site, triggerPopup])

  if (!site?.id) {
    return <></>
  }

  const initials = site.name
    ? site.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""

  const baseAvatar = (
    <CustomAvatar
      alt={site.name}
      src={site.image_url || ""}
      ref={avatarRef}
      data-mention-id={site.id}
      data-mention-class-name="Site"
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

export default SiteAvatar
