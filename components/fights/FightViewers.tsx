import React from "react"
import { Tooltip, AvatarGroup, Avatar, Typography } from "@mui/material"
import type { User, Viewer } from "@/types/types"
import { useWebSocket, useFight } from "@/contexts"
import UserAvatar from "@/components/UserAvatar"
import FS from "@/services/FightService"

interface FightViewersProps {
}

const FightViewers: React.FC<FightViewersProps> = () => {
  const { viewingUsers } = useWebSocket()
  const { fight } = useFight()

  const users = FS.users(fight)

  const userOnline = (u: User | Viewer): boolean => {
    return viewingUsers.some((viewer) => viewer.id === u?.id)
  }

  const allUsers = Array.from(new Set([...users, ...viewingUsers].map(u => u.id)))
    .map(id => viewingUsers.find(v => v.id === id) || users.find(u => u.id === id))
    .filter((u): u is User | Viewer => !!u)

  return (
    <AvatarGroup max={8} sx={{ justifyContent: "flex-start" }}>
      {allUsers.map((viewer) => (
        <UserAvatar user={viewer} online={userOnline(viewer)} key={`user_${viewer.id}`} />
      ))}
    </AvatarGroup>
  )
}

export default FightViewers
