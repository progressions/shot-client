import { Avatar, IconButton } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import { usePopup } from "@/components/popups"
import type { Weapon } from "@/types/types"

interface WeaponAvatarProps {
  weapon: Weapon
  href?: string
}

interface CustomAvatarProps {
  "data-mention-id"?: string
  "data-mention-class-name"?: string
}

const CustomAvatar = Avatar as React.ComponentType<
  React.ComponentProps<typeof Avatar> & CustomAvatarProps
>

const WeaponAvatar = ({ weapon, href }: WeaponAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)
  const { triggerPopup } = usePopup({ containerRef: avatarRef, user, client })

  useEffect(() => {
    const avatar = avatarRef.current
    if (!avatar) return

    const handleMouseOver = () => {
      triggerPopup({
        mentionId: weapon?.id || "",
        mentionClass: "Weapon",
        target: avatar,
      })
    }

    avatar.addEventListener("mouseover", handleMouseOver)

    return () => {
      avatar.removeEventListener("mouseover", handleMouseOver)
    }
  }, [weapon, triggerPopup])

  if (!weapon?.id) {
    return <></>
  }

  const initials = weapon.name
    ? weapon.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""

  const baseAvatar = (
    <CustomAvatar
      alt={weapon.name}
      src={weapon.image_url || ""}
      ref={avatarRef}
      data-mention-id={weapon.id}
      data-mention-class-name="Weapon"
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

export default WeaponAvatar
