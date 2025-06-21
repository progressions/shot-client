import { Button, IconButton, Box, TextField, MenuItem, Stack, Typography } from "@mui/material"
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { useCampaign, CampaignContextType, useToast } from "@/contexts"
import CampaignSelector from "@/components/campaigns/CampaignSelector"
import Router from 'next/router'
import { useEffect } from "react"

import { Campaign } from "@/types/types"

interface CampaignNameProps {
  campaign: Campaign | null
}

export default function CurrentCampaign() {
  const {campaign, setCurrentCampaign}:CampaignContextType = useCampaign()
  const { toastSuccess } = useToast()

  const startCampaign = async (camp: Campaign | null) => {
    await setCurrentCampaign(camp)
    if (camp) {
      toastSuccess(`${camp.name} activated`)
      Router.push('/')
    } else {
      toastSuccess(`Campaign cleared`)
      Router.push('/campaigns')
    }
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
