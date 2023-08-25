import { Button, IconButton, Box, TextField, MenuItem, Stack, Typography } from "@mui/material"
import { useCampaign, CampaignContextType } from "@/contexts/CampaignContext"
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { useToast } from "@/contexts/ToastContext"
import CampaignSelector from "./CampaignSelector"
import Router from 'next/router'

import { Campaign } from "@/types/types"

interface CampaignNameProps {
  campaign: Campaign | null
}

export default function CurrentCampaign() {
  const {campaign, getCurrentCampaign, setCurrentCampaign}:CampaignContextType = useCampaign()
  const { toastSuccess } = useToast()

  const startCampaign = async (camp: Campaign | null) => {
    await setCurrentCampaign(camp)
    if (camp) {
      toastSuccess(`${camp.name} activated`)
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

  function CampaignName({ campaign }: CampaignNameProps) {
    if (campaign?.id) {
      return (<>
        <Typography color="white">{campaign.name}</Typography>
        { startStopCampaignButton(campaign, campaign) }
      </>)
    }
    return (
      <CampaignSelector startCampaign={startCampaign} />
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
