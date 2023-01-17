import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, MenuItem, Stack, Typography } from "@mui/material"
import { useCampaign } from "../../contexts/CampaignContext"
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import { useToast } from "../../contexts/ToastContext"
import { useMemo, useCallback, useEffect, useState } from "react"
import { useSession } from 'next-auth/react'
import Client from "../Client"
import Router from 'next/router'

import { Campaign } from "../../types/types"

export default function CampaignSelector() {
  const {campaign, getCurrentCampaign, setCurrentCampaign}:any = useCampaign()
  const { setToast } = useToast()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  const [campaignId, setCampaignId] = useState({})

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = useMemo(() => (new Client({ jwt })), [jwt])

  const startCampaign = async (camp?: Campaign | null) => {
    await setCurrentCampaign(camp)
    if (camp) {
      setToast({ open: true, message: `${camp.title} activated`, severity: "success" })
    } else {
      setToast({ open: true, message: `Campaign cleared`, severity: "success" })
    }
  }

  const getCampaigns = useCallback(async () => {
    const response = await client.getCampaigns()
    if (response.status === 200) {
      const data = await response.json()
      setCampaigns(data)
    }
  }, [client])

  useEffect(() => {
    if (jwt) {
      getCampaigns().catch(console.error)
    }
  }, [jwt, getCampaigns])

  const handleChange = (event: any) => {
    setCampaignId(event.target.value)
  }

  const cancelForm = () => {
    setOpen(false)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setSaving(true)

    const camp = campaigns.find((c: any) => (campaignId === c.id))
    await startCampaign(camp)

    Router.reload()

    setSaving(false)
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  if (campaign) {
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
            <TextField
              sx={{marginTop: 1}}
              fullWidth
              name="campaign"
              label="Campaign"
              select
              value={campaign?.id}
              onChange={handleChange}
            >
              {
                campaigns.map((camp) => (<MenuItem key={camp.id} value={camp.id}>{camp.title}</MenuItem>))
              }
            </TextField>
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
