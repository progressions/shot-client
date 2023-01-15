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
import AuthButton from "./navbar/AuthButton"

import type { User } from "../types/types"

import { useCampaign } from "../contexts/CampaignContext"

export default function Navbar() {
  const { status, data } = useSession()
  const user:any = data?.user

  const [campaign, setCampaign] = useCampaign()

  const current:Campaign = {
    id: "b107d915-8a46-4515-9e8c-ea4f6f399fa7",
    title: "Born to Revengeance"
  }

  useEffect(() => {
  }, [])

  const handleClick = () => {
    setCampaign(current)
  }
  const handleClear = () => {
    setCampaign(null)
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
          <Button variant="contained" onClick={handleClick}>Set Campaign</Button>
          <Button variant="contained" onClick={handleClear}>Clear Campaign</Button>
          <Typography color="inherit">Campaign {campaign?.title}</Typography>
          <AuthButton status={status} user={user || {}} />

        </Toolbar>
      </AppBar>
    </Box>
  );
}
