import { Avatar, IconButton } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import { usePopup } from "@/components/popups"
import type { Party } from "@/types/types"

interface PartyAvatarProps {
  party: Party
  href?: string
}

interface CustomAvatarProps {
  "data-mention-id"?: string
  "data-mention-class-name"?: string
}

const CustomAvatar = Avatar as React.ComponentType<
  React.ComponentProps<typeof Avatar> & CustomAvatarProps
>

const PartyAvatar = ({ party, href }: PartyAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)
  const { triggerPopup } = usePopup({ containerRef: avatarRef, user, client })

  useEffect(() => {
    const avatar = avatarRef.current
    if (!avatar) return

    const handleMouseOver = () => {
      triggerPopup({
        mentionId: party?.id || "",
        mentionClass: "Party",
        target: avatar,
      })
    }

    avatar.addEventListener("mouseover", handleMouseOver)

    return () => {
      avatar.removeEventListener("mouseover", handleMouseOver)
    }
  }, [party, triggerPopup])

  if (!party?.id) {
    return <></>
  }

  const initials = party.name
    ? party.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""

  const baseAvatar = (
    <CustomAvatar
      alt={party.name}
      src={party.image_url || ""}
      ref={avatarRef}
      data-mention-id={party.id}
      data-mention-class-name="Party"
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

export default PartyAvatar
