import React from "react"
import { AvatarGroup, Avatar, Box, Typography, Chip, List, ListItem, ListItemText } from "@mui/material"
import type { Viewer } from "@/types/types"

interface FightViewersProps {
  viewers: Viewer[]
}

const FightViewers: React.FC<FightViewersProps> = ({ viewers }) => {
  return (
    <AvatarGroup>
      <Avatar alt="John Carter" src="user.avatar_url">JC</Avatar>
      <Avatar alt="Austin Katan" src="user.avatar_url">AK</Avatar>
      <Avatar alt="Jim Grindrod" src="user.avatar_url">JG</Avatar>
    </AvatarGroup>
  )
}

export default FightViewers
