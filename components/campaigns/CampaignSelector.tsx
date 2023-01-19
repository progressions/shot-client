import { IconButton, Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, MenuItem, Stack, Typography } from "@mui/material"
import { useCampaign } from "../../contexts/CampaignContext"
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useMemo, useCallback, useEffect, useState } from "react"
import { useSession } from 'next-auth/react'
import Client from "../Client"

import type { Campaign } from "../../types/types"

export default function CampaignSelector({ startCampaign }: any) {
  const {campaign, getCurrentCampaign, setCurrentCampaign}:any = useCampaign()
  const { setToast } = useToast()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [campaigns, setCampaigns] = useState<any>({})
  const [campaignId, setCampaignId] = useState(null)

  const { user, client } = useClient()

  const getCampaigns = useCallback(async () => {
    const response = await client.getCampaigns()
    if (response.status === 200) {
      const data = await response.json()
      setCampaigns(data)
    }
  }, [client])

  useEffect(() => {
    if (user) {
      getCampaigns().catch(alert)
    }
  }, [user, getCampaigns])

  const handleChange = (event: any) => {
    setCampaignId(event.target.value)
  }

  const cancelForm = () => {
    setOpen(false)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setSaving(true)

    const camp = campaigns?.["gamemaster"]?.find((c: any) => (campaignId === c.id)) ||
      campaigns?.["player"]?.find((c: any) => (campaignId === c.id))
    await startCampaign(camp)

    setSaving(false)
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  console.log(campaigns)

  const NameDisplay = ({ camp }: any) => {
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
              <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
              <Button variant="contained" type="submit" disabled={saving}>Select</Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
