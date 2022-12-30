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

export default function Navbar() {
  const { status, data } = useSession()
  useEffect(() => {
    if (status === "unauthenticated") {
      Router.replace("/auth/signin")
    }
  }, [status])

  if (status !== "authenticated") {
    return (
      <p>Loading...</p>
    )
  }
  console.log(data)
  const AuthButton = ({ status, user }: any) => {
    if (status === "authenticated") {
      return (
        <>
          <Typography>
            {user?.email}
          </Typography>
          <Button color="inherit" onClick={() => signOut({ redirect: false })}>Logout</Button>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link color="inherit" href='/'>
              Home
            </Link>
          </Typography>
          <AuthButton status={status} user={data?.user || {}} />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
