import { colors, Paper, Container, Stack, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Typography, Button } from "@mui/material"

import { useState } from "react"
import { useToast, useClient } from "@/contexts"
import Router from 'next/router'
import { StyledFormDialog, StyledDialog, StyledTextField, SaveCancelButtons } from "@/components/StyledFields"

import type { Campaign, Invitation } from "@/types/types"

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
      <StyledFormDialog
        open={open}
        onClose={cancelForm}
        onSubmit={handleSubmit}
      >
        <Box component="form" onSubmit={handleSubmit} pb={1}>
          <DialogTitle>Create Invitation</DialogTitle>
          <DialogContent>

            <Stack direction="column" mt={1}>
              <StyledTextField required error={!!error} helperText={error && `Email ${error}`} label="Email" name="email" value={invitation?.email || ""} onChange={handleChange} />
            </Stack>
          </DialogContent>
        </Box>
      </StyledFormDialog>
    </>
  )
}
