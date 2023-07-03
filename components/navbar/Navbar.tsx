import Image from "next/image"
import { Container } from "@mui/material"
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from 'material-ui-popup-state/hooks'
import Link from '@mui/material/Link'
import { useEffect } from 'react'
import Router from 'next/router'
import { signIn, signOut } from 'next-auth/react'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Stack from '@mui/material/Stack'
import AuthButton from "./AuthButton"
import Client from "../../utils/Client"
import CurrentCampaign from "../campaigns/CurrentCampaign"
import GamemasterOnly from "../GamemasterOnly"
import PopupMenu from "./PopupMenu"

import type { Campaign, User } from "../../types/types"
import { defaultCampaign } from "../../types/types"

import { useCampaign, CampaignContextType } from "../../contexts/CampaignContext"
import { useClient } from "../../contexts/ClientContext"

export default function Navbar() {
  const { session, user, client } = useClient()

  const {campaign, getCurrentCampaign, setCurrentCampaign}:CampaignContextType = useCampaign()

  const handleClick = async () => {
    const newCurrent = await setCurrentCampaign(defaultCampaign)
  }
  const handleClear = async () => {
    const newCurrent = await setCurrentCampaign(null)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{backgroundColor: "primary.main"}}>
        <Toolbar>
          <PopupMenu campaign={campaign} user={user} />
          <Link underline="none" color="inherit" href='/'>
            <Image src="/ChiWar.svg" alt="ChiWar" width="120" height="40" style={{marginTop: 5, marginRight: 10}} />
          </Link>
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
