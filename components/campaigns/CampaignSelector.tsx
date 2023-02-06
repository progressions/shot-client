import { IconButton, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, MenuItem, Stack, Typography } from "@mui/material"
import { CampaignContextType, useCampaign } from "../../contexts/CampaignContext"
import { useClient } from "../../contexts/ClientContext"
import { useMemo, useCallback, useEffect, useState } from "react"
import Client from "../../utils/Client"
import NameDisplay from "./NameDisplay"

import type { Campaign, CampaignsResponse } from "../../types/types"
import { defaultCampaign } from "../../types/types"

interface CampaignSelectorProps {
  startCampaign: (campaign: Campaign) => Promise<void>
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
    try {
      const data = await client.getCampaigns()
      setCampaigns(data)
    } catch(error) {
      console.error(error)
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
                campaigns?.["gamemaster"]?.map((camp: Campaign) => <NameDisplay key={camp.id} campaign={camp} onClick={() => startCampaign(camp)} />)
              }
              {
                campaigns?.["player"]?.map((camp: Campaign) => <NameDisplay key={camp.id} campaign={camp} onClick={() => startCampaign(camp)} />)
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
