import { Stack, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Typography, Button } from "@mui/material"

import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import Router from 'next/router'

import type { Campaign, Invitation } from "../../types/types"

interface CreateInvitationProps {
  campaign: Campaign
}

export default function CreateInvitation({ campaign:initialCampaign }: CreateInvitationProps) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()

  const [campaign, setCampaign] = useState(initialCampaign)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [invitation, setInvitation] = useState<Invitation>({} as Invitation)
  const [error, setError] = useState(null)

  const handleOpen = () => {
    setInvitation({} as Invitation)
    setOpen(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvitation((prev: Invitation) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setSaving(true)

    try {
      const data = await client.createInvitation(invitation as Invitation, campaign)
      toastSuccess(`Invitation created for ${invitation?.email}.`)
      Router.reload()
    } catch(error) {
      toastError()
    }

    setSaving(false)
  }

  const cancelForm = () => {
    setInvitation({} as Invitation)
    setOpen(false)
    setError(null)
  }

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>Invite User</Button>
      <Dialog
        open={open}
        onClose={cancelForm}
      >
        <Box component="form" onSubmit={handleSubmit} pb={1} sx={{width: 400}}>
          <DialogTitle>Create Invitation</DialogTitle>
          <DialogContent>
            <Stack direction="column" mt={1}>
              <TextField required error={!!error} helperText={error && `Email ${error}`} label="Email" name="email" value={invitation?.email || ""} onChange={handleChange} />
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
