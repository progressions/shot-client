import React from "react"
import { AvatarGroup, Avatar, Typography } from "@mui/material"
import type { Viewer } from "@/types/types"
import { useWebSocket } from "@/contexts/WebSocketContext"

interface FightViewersProps {
}

const FightViewers: React.FC<FightViewersProps> = ({ viewers }) => {
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
        <Avatar
          key={viewer.id}
          alt={viewer.name || "Anonymous"}
          src={viewer.avatar_url}
        >
          {getInitials(viewer.name)}
        </Avatar>
      ))}
    </AvatarGroup>
  )
}

export default FightViewers
