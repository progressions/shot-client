import Image from "next/image"
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Link from '@mui/material/Link'
import AuthButton from "./AuthButton"
import CurrentCampaign from "../campaigns/CurrentCampaign"
import PopupMenu from "./PopupMenu"

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
