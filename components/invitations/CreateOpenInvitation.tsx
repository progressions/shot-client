import { colors, Paper, Stack, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Typography, Button } from "@mui/material"

import { StyledTextField, SaveCancelButtons } from "@/components/StyledFields"
import { useState } from "react"
import { useToast, useClient } from "@/contexts"
import Router from 'next/router'

import type { Campaign, Invitation } from "@/types/types"

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

    try {
      const data = await client.createInvitation(invitation as Invitation, campaign)
      toastSuccess(`Invitation created.`)
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
      <Button variant="contained" onClick={handleOpen}>Create Invitation</Button>
      <Dialog
        open={open}
        onClose={cancelForm}
      >
        <Box component="form" onSubmit={handleSubmit} pb={1} sx={{width: 400}}>
          <DialogTitle>Create Invitation</DialogTitle>
          <DialogContent>
            <Stack direction="column" mt={1}>
              <StyledTextField required error={!!error} helperText={error && `Email ${error}`} label="Maximum Number of Invitations" name="maximum_count" value={invitation?.maximum_count || ""} onChange={handleChange} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Stack spacing={2} direction="row">
              <SaveCancelButtons saving={saving} cancelForm={cancelForm} />
            </Stack>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}
