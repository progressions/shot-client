import React from "react"
import { Tooltip, AvatarGroup, Avatar, Typography } from "@mui/material"
import type { Viewer } from "@/types/types"
import { useWebSocket } from "@/contexts/WebSocketContext"

interface FightViewersProps {
}

const FightViewers: React.FC<FightViewersProps> = () => {
  const { viewingUsers } = useWebSocket()

  const getInitials = (name: string): string => {
    if (!name) return "?"
    const names = name.trim().split(/\s+/)
    return names
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() || "")
      .join("")
  }

  return (
    <AvatarGroup max={4} sx={{ justifyContent: "flex-start" }}>
      {viewingUsers.map((viewer) => (
        <Tooltip title={viewer.name} key={`avatar_${viewer.id}`} placement="top">
          <Avatar
            key={viewer.id}
            alt={viewer.name || "Anonymous"}
            src={viewer.image_url}
          >
              {getInitials(viewer.name)}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  )
}

export default FightViewers
