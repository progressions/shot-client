import { IconButton, Box, TextField, MenuItem, Stack, Typography } from "@mui/material"
import { useCampaign } from "../../contexts/CampaignContext"
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { useToast } from "../../contexts/ToastContext"

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
  }

  const startStopCampaignButton = (camp: Campaign, current: Campaign | null) => {
    if (camp?.id === current?.id) {
      return (
        <IconButton onClick={() => startCampaign(null)}>
          <StopCircleIcon />
        </IconButton>
      )
    }
    return (
      <IconButton onClick={() => startCampaign(campaign)}>
        <PlayCircleIcon />
      </IconButton>
    )
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
      <Typography color="inherit">Current Campaign: {campaign?.title || "None"}</Typography>
      {campaign && startStopCampaignButton(campaign, campaign)}
    </Stack>
  )
}
