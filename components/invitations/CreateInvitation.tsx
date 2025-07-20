import { colors, Paper, Container, Stack, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Typography, Button } from "@mui/material"

import { useReducer, useState } from "react"
import { useToast, useClient } from "@/contexts"
import Router from 'next/router'
import { StyledFormDialog, StyledTextField, SaveCancelButtons } from "@/components/StyledFields"
import { FormActions, useForm } from '@/reducers/formState'

import type { Campaign, Invitation } from "@/types/types"

interface CreateInvitationProps {
  campaign: Campaign
}

type FormData = {
  invitation: Invitation
  campaign: Campaign
}

export default function CreateInvitation({ campaign:initialCampaign }: CreateInvitationProps) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ invitation: {} as Invitation, campaign: initialCampaign })
  const { open, saving, disabled, error, formData } = formState
  const { invitation, campaign } = formData

  const { client } = useClient()
  const { toastError, toastSuccess } = useToast()

  const handleOpen = () => {
    dispatchForm({ type: FormActions.OPEN, payload: true })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "invitation", value: { ...invitation, [event.target.name]: event.target.value } })
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    try {
      const data = await client.createInvitation(invitation as Invitation, campaign)
      toastSuccess(`Invitation created for ${invitation?.email}.`)
      Router.reload()
    } catch(error: any) {
      console.error("Error creating invitation:", error)
      dispatchForm({ type: FormActions.ERROR, payload: error.message })
      toastError()
    }

    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  const cancelForm = () => {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>Invite User</Button>
      <StyledFormDialog
        open={open}
        onClose={cancelForm}
        disabled={disabled}
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
