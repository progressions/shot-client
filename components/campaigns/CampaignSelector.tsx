import { IconButton, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, MenuItem, Stack, Typography } from "@mui/material"
import { CampaignContextType, useCampaign } from "../../contexts/CampaignContext"
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { useClient } from "../../contexts/ClientContext"
import { useMemo, useCallback, useEffect, useState } from "react"
import { useSession } from 'next-auth/react'
import Client from "../Client"

import type { Campaign, CampaignsResponse } from "../../types/types"
import { defaultCampaign } from "../../types/types"

interface CampaignSelectorProps {
  startCampaign: (campaign: Campaign) => Promise<void>
}

interface NameDisplayProps {
  camp: Campaign
}

declare module "@mui/material/styles" {
  interface CustomPalette {
    highlight: {
      main: string
    }
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    highlight: true
  }
}

export default function CampaignSelector({ startCampaign }: CampaignSelectorProps) {
  const {campaign, getCurrentCampaign, setCurrentCampaign}: CampaignContextType = useCampaign()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [campaigns, setCampaigns] = useState<CampaignsResponse>({
    gamemaster: [],
    player: []
  })
  const [campaignId, setCampaignId] = useState(null)

  const { user, client } = useClient()

  const getCampaigns = useCallback(async () => {
    const response = await client.getCampaigns()
    if (response.status === 200) {
      const data = await response.json()
      setCampaigns(data)
    }
  }, [client])

  const cancelForm = () => {
    setOpen(false)
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setSaving(true)

    const camp = campaigns?.["gamemaster"]?.find((c: Campaign) => (campaignId === c.id)) ||
      campaigns?.["player"]?.find((c: Campaign) => (campaignId === c.id))
    await startCampaign(camp as Campaign)

    setSaving(false)
    setOpen(false)
  }

  const handleOpen = async () => {
    if (user) {
      await getCampaigns()
    }
    setOpen(true)
  }

  const NameDisplay = ({ camp }: NameDisplayProps) => {
    return (
      <>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="contained" startIcon={<PlayCircleIcon />} color="secondary" onClick={() => startCampaign(camp)}>
            Start
          </Button>
          <Typography>{camp.title}</Typography>
        </Stack>
      </>
    )
  }

  if (campaign?.id) {
    return <></>
  }
  return (
    <>
      <Button variant="outlined" color="inherit" onClick={handleOpen}>None</Button>
      <Dialog
        open={open}
        onClose={cancelForm}
      >
        <Box component="form" onSubmit={handleSubmit} pb={1} sx={{width: 400}}>
          <DialogTitle>Select Campaign</DialogTitle>
          <DialogContent>
            <Stack spacing={1}>
              {
                campaigns?.["gamemaster"]?.map((camp: Campaign) => <NameDisplay key={camp.id} camp={camp} />)
              }
              {
                campaigns?.["player"]?.map((camp: Campaign) => <NameDisplay key={camp.id} camp={camp} />)
              }
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack spacing={2} direction="row">
              <Button variant="contained" color="highlight" disabled={saving} onClick={cancelForm}>Cancel</Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
