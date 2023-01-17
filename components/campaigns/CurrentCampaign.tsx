import { Button, IconButton, Box, TextField, MenuItem, Stack, Typography } from "@mui/material"
import { useCampaign } from "../../contexts/CampaignContext"
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { useToast } from "../../contexts/ToastContext"
import CampaignSelector from "./CampaignSelector"
import Router from 'next/router'

import { Campaign } from "../../types/types"

export default function CurrentCampaign() {
  const {campaign, getCurrentCampaign, setCurrentCampaign}:any = useCampaign()
  const { setToast } = useToast()

  const startCampaign = async (camp?: Campaign | null) => {
    await setCurrentCampaign(camp)
    if (camp) {
      setToast({ open: true, message: `${camp.title} activated`, severity: "success" })
    } else {
      setToast({ open: true, message: `Campaign cleared`, severity: "success" })
    }
    Router.reload()
  }

  const startStopCampaignButton = (camp: Campaign, current: Campaign | null) => {
    if (camp?.id === current?.id) {
      return (
        <IconButton onClick={() => startCampaign(null)}>
          <StopCircleIcon sx={{color: "white"}} />
        </IconButton>
      )
    }
    return (<></>)
  }

  function CampaignName({ campaign }: any) {
    if (campaign) {
      return (<>
        <Typography color="white">{campaign.title}</Typography>
        { startStopCampaignButton(campaign, campaign) }
      </>)
    }
    return (
      <CampaignSelector campaign={campaign} startCampaign={startCampaign} />
    )
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
      <Typography color="inherit">
        Current Campaign:
      </Typography>
      <CampaignName campaign={campaign} />
    </Stack>
  )
}
