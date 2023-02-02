import { TextField, Button, Tooltip, Box, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { useEffect, useState } from "react"
import Client from "../Client"

import { defaultCampaign } from "../../types/types"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"

import type { Campaign } from "../../types/types"

interface CampaignModalProps {
  open: Campaign
  setOpen: React.Dispatch<React.SetStateAction<Campaign>>
  campaign: Campaign
  reload: () => Promise<void>
}

export default function CampaignModal({ open, setOpen, campaign:activeCampaign, reload }: CampaignModalProps) {
  const [campaign, setCampaign] = useState(activeCampaign)
  const [saving, setSaving] = useState(false)

  const { client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setSaving(true)

    const response = await client.createCampaign(campaign)
    if (response.status === 200) {
      const data = await response.json()
      setCampaign(data)
      setSaving(false)
      cancelForm()

      toastSuccess(`${campaign.title} created.`)
      await reload()
    } else {
      toastError()
      setSaving(false)
      cancelForm()
    }
  }

  const cancelForm = () => {
    setOpen(defaultCampaign)
    setCampaign(defaultCampaign)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCampaign((prevState: Campaign) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  return (
    <>
      <Dialog
        open={!!(open.id || open.new)}
        onClose={cancelForm}
        disableAutoFocus
      >
        <Box component="form" onSubmit={handleSubmit} pb={1} sx={{width: 600}}>
          <DialogTitle>Campaign</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField autoFocus name="title" value={campaign.title} label="Title" onChange={handleChange} />
              <TextField name="description" multiline rows={3} value={campaign.description} label="Description" onChange={handleChange} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack spacing={2} direction="row">
              <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
              <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
