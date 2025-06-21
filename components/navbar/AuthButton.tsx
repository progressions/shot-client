import { Stack, Link, Typography, Button, Tooltip, IconButton, Avatar } from "@mui/material"
import { signIn, signOut } from 'next-auth/react'

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
          <Tooltip title="Open profile">
            <IconButton href='/profile'>
              <Avatar alt={user.first_name} src={user.image_url || ""} />
            </IconButton>
          </Tooltip>
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
