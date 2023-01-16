import { Stack, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Typography, Button } from "@mui/material"

import { useState } from "react"
import { useToast } from "../../contexts/ToastContext"
import Client from "../Client"
import { useSession } from 'next-auth/react'

export default function CreateInvitation({ campaign }) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })
  const { setToast } = useToast()

  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [invitation, setInvitation] = useState({})

  const handleOpen = () => {
    setInvitation({})
    setOpen(true)
  }

  const handleChange = (event: any) => {
    setInvitation((prev: any) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    setSaving(true)

    const response = client.createInvitation(invitation, campaign)
    if (response.status === 200) {
      const data = response.json()
      console.log({ data })
      setToast({ open: true, message: `Invitation created for ${invitation.email}.`, severity: "success" })
    }

    setSaving(false)
  }

  const cancelForm = () => {
    setInvitation({})
    setOpen(false)
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
              <TextField label="Email" name="email" value={invitation?.email || ""} onChange={handleChange} />
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
