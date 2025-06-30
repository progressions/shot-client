import { Avatar, IconButton } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import { useClient } from "@/contexts"
import { usePopup } from "@/components/popups"
import type { Vehicle } from "@/types/types"
import VS from "@/services/VehicleService"

interface VehicleAvatarProps {
  vehicle: Vehicle
  href?: string
}

interface CustomAvatarProps {
  "data-mention-id"?: string
  "data-mention-class-name"?: string
}

const CustomAvatar = Avatar as React.ComponentType<
  React.ComponentProps<typeof Avatar> & CustomAvatarProps
>

const VehicleAvatar = ({ vehicle, href }: VehicleAvatarProps) => {
  const { user, client } = useClient()
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)
  const { triggerPopup } = usePopup({ containerRef: avatarRef, user, client })

  useEffect(() => {
    const avatar = avatarRef.current
    if (!avatar) return

    const handleMouseOver = () => {
      triggerPopup({
        mentionId: vehicle?.id || "",
        mentionClass: "Vehicle",
        target: avatar,
      })
    }

    avatar.addEventListener("mouseover", handleMouseOver)

    return () => {
      avatar.removeEventListener("mouseover", handleMouseOver)
    }
  }, [vehicle, triggerPopup])

  if (!vehicle?.id) {
    return <></>
  }

  const initials = vehicle.name
    ? vehicle.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""
  const defaultTooltip = VS.name(vehicle) || "Unknown"

  const baseAvatar = (
    <CustomAvatar
      alt={vehicle.name}
      src={vehicle.image_url || ""}
      ref={avatarRef}
      data-mention-id={vehicle.id}
      data-mention-class-name="Vehicle"
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

export default VehicleAvatar
