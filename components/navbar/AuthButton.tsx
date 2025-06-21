import { Stack, Link, Typography, Button, Tooltip, IconButton, Avatar } from "@mui/material"
import { signIn, signOut } from 'next-auth/react'
import UserAvatar from "@/components/UserAvatar"

import type { User } from "@/types/types"

interface AuthButtonParams {
  status: string,
  user: User
}

const AuthButton = ({ status, user }: AuthButtonParams) => {
  if (status === "authenticated") {
    return (
      <>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'right' }}>
          <Button color="inherit" onClick={() => signOut({ redirect: false })}>Logout</Button>
          <UserAvatar user={user} href="/profile" tooltip="Open profile" />
        </Typography>
      </>
    )
  }
  return (
    <>
      <Stack component="div" spacing={2} direction="row" sx={{ marginLeft: "auto"}}>
        <Typography variant="h6">
          <Button color="inherit" href="/auth/signup">Sign Up</Button>
        </Typography>
        <Typography variant="h6">
          <Button color="inherit" onClick={() => signIn()}>Sign In</Button>
        </Typography>
      </Stack>
    </>
  )
}

export default AuthButton
