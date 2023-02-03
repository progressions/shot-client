import { Stack, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Typography, Button } from "@mui/material"

import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import Router from 'next/router'

import type { Campaign, Invitation } from "../../types/types"

interface CreateOpenInvitationProps {
  campaign: Campaign
}

export default function CreateOpenInvitation({ campaign }: CreateOpenInvitationProps) {
  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()

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

    const response = await client.createInvitation(invitation as Invitation, campaign)
    if (response.status === 200) {
      const data = await response.json()
      toastSuccess(`Invitation created.`)
      Router.reload()
    }
    if (response.status === 400) {
      const data = await response.json()
      setError(data?.email?.[0])
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
      <Button variant="contained" onClick={handleOpen}>Create Invitation</Button>
      <Dialog
        open={open}
        onClose={cancelForm}
      >
        <Box component="form" onSubmit={handleSubmit} pb={1} sx={{width: 400}}>
          <DialogTitle>Create Invitation</DialogTitle>
          <DialogContent>
            <Stack direction="column" mt={1}>
              <TextField required error={!!error} helperText={error && `Email ${error}`} label="Maximum Number of Invitations" name="maximum_count" value={invitation?.maximum_count || ""} onChange={handleChange} />
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
