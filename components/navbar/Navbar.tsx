import Image from "next/image"
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Link from '@mui/material/Link'
import AuthButton from "@/components/navbar/AuthButton"
import CurrentCampaign from "@/components/campaigns/CurrentCampaign"
import PopupMenu from "@/components/navbar/PopupMenu"
import DiceRoller from '@/components/dice/DiceRoller'

import { useState, useEffect } from "react"

import { defaultCampaign, defaultUser } from "@/types/types"
import type { User } from "@/types/types"

import { useCampaign, CampaignContextType, useClient } from "@/contexts"

export default function Navbar() {
  const { session, user, client, currentUserState, dispatchCurrentUser } = useClient()
  const { campaign, getCurrentCampaign, setCurrentCampaign } = useCampaign()
  const [currentUser, setCurrentUser] = useState<User>(user || defaultUser)

  useEffect(() => {
    if (!user?.id) return

    if (user?.id) {
      client.getUser(user).then((data) => {
        setCurrentUser(data)
      }).catch((error) => {
        console.error("Error fetching user data:", error)
      })
    } else {
      setCurrentUser(defaultUser)
    }
  }, [user, currentUserState])

  const handleClick = async () => {
    const newCurrent = await setCurrentCampaign(defaultCampaign)
  }
  const handleClear = async () => {
    const newCurrent = await setCurrentCampaign(null)
  }

  return (
    <Box sx={{ flexGrow: 1, minWidth: 700 }}>
      <AppBar position="static" sx={{backgroundColor: "primary.main"}}>
        <Toolbar>
          <PopupMenu campaign={campaign} user={user} />
          <Link underline="none" color="inherit" href='/'>
            <Image src="/ChiWar.svg" alt="ChiWar" width="120" height="40" style={{marginTop: 5, marginRight: 10}} />
          </Link>
          <DiceRoller />
          <AuthButton status={session?.status} user={currentUser || {}} />
        </Toolbar>
        { user &&
        <Box sx={{ backgroundColor: "primary.dark" }} p={1}>
          <CurrentCampaign />
        </Box> }
      </AppBar>
    </Box>
  )
}
