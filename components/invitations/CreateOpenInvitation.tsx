import { Stack, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Typography, Button } from "@mui/material"

import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import Client from "../Client"
import { useSession } from 'next-auth/react'
import Router from 'next/router'

import type { Invitation } from "../../types/types"

export default function CreateOpenInvitation({ campaign }: any) {
  const { client } = useClient()
  const { setToast } = useToast()

  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [invitation, setInvitation] = useState<Invitation>({} as Invitation)
  const [error, setError] = useState(null)

  const handleOpen = () => {
    setInvitation({} as Invitation)
    setOpen(true)
  }

  const handleChange = (event: any) => {
    setInvitation((prev: any) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setSaving(true)

    const response = await client.createInvitation(invitation as Invitation, campaign)
    if (response.status === 200) {
      const data = await response.json()
      console.log({ data })
      setToast({ open: true, message: `Invitation created.`, severity: "success" })
      Router.reload()
    }
    if (response.status === 400) {
      const data = await response.json()
      console.error({ data })
      setError(data?.email?.[0])
      setToast({ open: true, message: `There was an error.`, severity: "error" })
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
