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
  const { toastSuccess } = useToast()

  const startCampaign = async (camp?: Campaign | null) => {
    await setCurrentCampaign(camp)
    if (camp) {
      toastSuccess(`${camp.title} activated`)
    } else {
      toastSuccess(`Campaign cleared`)
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
    if (campaign?.id) {
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
