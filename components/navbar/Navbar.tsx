import * as React from 'react';
import { Container } from "@mui/material"
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
import AuthButton from "./AuthButton"
import Client from "../Client"
import CurrentCampaign from "../campaigns/CurrentCampaign"

import type { Campaign, User } from "../../types/types"

import { useCampaign } from "../../contexts/CampaignContext"

export default function Navbar() {
  const session: any = useSession({ required: false })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt: jwt })

  const { status, data } = session
  const user:any = data?.user

  const {campaign, getCurrentCampaign, setCurrentCampaign}:any = useCampaign()

  useEffect(() => {
  }, [])

  const handleClick = async () => {
    const newCurrent = await setCurrentCampaign({})
  }
  const handleClear = async () => {
    const newCurrent = await setCurrentCampaign(null)
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
          <Typography variant="h6" component="div" paddingRight={2} sx={{ minWidth: 100 }}>
            <Link color="inherit" href='/campaigns'>
              Campaigns
            </Link>
          </Typography>
          { user?.admin && (
            <Typography variant="h6" component="div" paddingRight={2} sx={{ minWidth: 100 }}>
              <Link color="inherit" href='/admin/users'>
                Admin
              </Link>
            </Typography>
          )}
          <AuthButton status={status} user={user || {}} />
        </Toolbar>
        <Box sx={{ backgroundColor: "secondary.main" }} p={1}>
          <CurrentCampaign />
        </Box>
      </AppBar>
    </Box>
  );
}
