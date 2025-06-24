import { styled, Badge, Avatar, IconButton, Tooltip } from "@mui/material"

import type { User, Viewer } from "@/types/types"

interface UserAvatarProps {
  user?: User | Viewer
  tooltip?: string
  href?: string
  online?: boolean
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const UserAvatar = ({ user, tooltip, href, online }: UserAvatarProps) => {
  if (!user?.id) {
    return <></>
  }

  const initials = [user.first_name?.[0]?.toUpperCase(), user.last_name?.[0]?.toUpperCase()].filter(Boolean).join("")
  const defaultTooltip = [user.first_name, user.last_name].filter(Boolean).join(" ") || "User"

  const baseAvatar = (
    <Avatar alt={user.first_name} src={user.image_url || ""}>
      {initials}
    </Avatar>
  )

  const avatar = online ? (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
    >
      {baseAvatar}
    </StyledBadge>
  ) : baseAvatar

  if (href) {
    return (
      <Tooltip title={tooltip || defaultTooltip}>
        <IconButton href='/profile'>
          {avatar}
        </IconButton>
      </Tooltip>
    )
  }

  return (
    <Tooltip title={tooltip || defaultTooltip}>
      {avatar}
    </Tooltip>
  )
}

export default UserAvatar
