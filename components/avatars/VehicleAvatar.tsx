import { Link, Avatar, IconButton } from "@mui/material"
import { RefObject, useRef, useEffect } from "react"
import type { Vehicle } from "@/types/types"
import VS from "@/services/VehicleService"

interface VehicleAvatarProps {
  vehicle: Vehicle
  href?: string
  disablePopup?: boolean
}

const VehicleAvatar = ({ vehicle, href, disablePopup }: VehicleAvatarProps) => {
  const avatarRef: RefObject<HTMLDivElement> = useRef(null)

  if (!vehicle?.id) {
    return <></>
  }

  const initials = vehicle.name
    ? vehicle.name.split(" ").map((part) => part.charAt(0).toUpperCase()).join("")
    : ""
  const defaultTooltip = VS.name(vehicle) || "Unknown"

  const avatar = (
    <Avatar
      alt={vehicle.name}
      src={vehicle.image_url || ""}
      ref={avatarRef}
    >
      {initials}
    </Avatar>
  )

  return disablePopup ? (
    avatar
  ) : (
    <Link href={href} data-mention-id={vehicle.id} data-mention-class-name="Vehicle" sx={{ padding: 0, ml: -1.5 }}>
      {avatar}
    </Link>
  )
}

export default VehicleAvatar
