import * as React from 'react'
import Image from "next/image"
import { Container } from "@mui/material"
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Link from '@mui/material/Link'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import Router from 'next/router'
import { signIn, signOut } from 'next-auth/react'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'
import AuthButton from "./AuthButton"
import Client from "../Client"
import CurrentCampaign from "../campaigns/CurrentCampaign"
import GamemasterOnly from "../GamemasterOnly"

import type { Campaign, User } from "../../types/types"

import { useCampaign } from "../../contexts/CampaignContext"
import { useClient } from "../../contexts/ClientContext"

export default function Navbar() {
  const { session, user, client } = useClient()

  const {campaign, getCurrentCampaign, setCurrentCampaign}:any = useCampaign()

  const handleClick = async () => {
    const newCurrent = await setCurrentCampaign({})
  }
  const handleClear = async () => {
    const newCurrent = await setCurrentCampaign(null)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor: "primary.main"}}>
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
          <Link color="inherit" href='/'>
            <Image src="/ChiWar.svg" alt="ChiWar" width="120" height="40" style={{marginTop: 5, marginRight: 10}} />
          </Link>
          { user && <>
            { campaign?.id &&
            <Typography variant="h6" component="div" paddingRight={2} sx={{ minWith: 100 }}>
              <Link color="inherit" href='/characters'>
                Characters
              </Link>
            </Typography> }
          <Typography variant="h6" component="div" paddingRight={2} sx={{ minWidth: 100 }}>
            <Link color="inherit" href='/campaigns'>
              Campaigns
            </Link>
          </Typography>
          { user?.admin && (<>
            <Typography variant="h6" component="div" paddingRight={2}>
              <Link color="inherit" href='/admin/users'>
                Users
              </Link>
            </Typography>
            <Typography variant="h6" component="div" paddingRight={2}>
              <Link color="inherit" href='/admin/schticks'>
                Schticks
              </Link>
            </Typography>
          </>)}
        </>
          }
          <AuthButton status={session?.status} user={user || {}} />
        </Toolbar>
        { user &&
        <Box sx={{ backgroundColor: "primary.dark" }} p={1}>
          <CurrentCampaign />
        </Box> }
      </AppBar>
    </Box>
  )
}
