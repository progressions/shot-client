import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Router from 'next/router'
import { signIn, signOut } from 'next-auth/react'
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'

export default function Navbar() {
  const { status, data } = useSession()
  const user:any = data?.user

  useEffect(() => {
    if (status === "unauthenticated") {
      Router.replace("/auth/signin")
    }
  }, [status])

  const AuthButton = ({ status, user }: any) => {
    if (status === "authenticated") {
      return (
        <>
          <Button color="inherit" onClick={() => signOut({ redirect: false })}>Logout</Button>
          <Tooltip title="Open profile">
            <IconButton href='/profile'>
              <Avatar alt={user.first_name} src={user.avatar_url} />
            </IconButton>
          </Tooltip>
        </>
      )
    }
    return (
      <>
        <Button color="inherit" onClick={() => signIn()}>Login</Button>
      </>
    )
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" paddingRight={2} sx={{ minWith: 100 }}>
            <Link color="inherit" href='/'>
              Home
            </Link>
          </Typography>
          <Typography variant="h6" component="div" paddingRight={2} sx={{ minWith: 100 }}>
            <Link color="inherit" href='/characters'>
              Characters
            </Link>
          </Typography>
          { user?.admin && (
            <Typography variant="h6" component="div" paddingRight={2} sx={{ minWidth: 100 }}>
              <Link color="inherit" href='/admin/users'>
                Admin
              </Link>
            </Typography>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'right' }}>
            <AuthButton status={status} user={user || {}} />
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
