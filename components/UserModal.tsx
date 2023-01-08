import { useState } from 'react'
import { FormGroup, FormControlLabel } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Router from "next/router"
import { useSession } from 'next-auth/react'

import Client from "./Client"

export default function UserModal(props: any) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt: jwt })

  const user = props.user
  const setUser = props.setUser
  const [saving, setSaving] = useState(false);

  const method = props.user ? 'PATCH' : 'POST'

  function handleClose() {
    cancelForm()
  }

  const handleChange = (event: any) => {
    setUser((prevState: any) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const handleCheck = (event: any) => {
    setUser((prevState: any) => ({ ...prevState, [event.target.name]: event.target.checked }))
  }

  const cancelForm = () => {
    setUser(null)
  }

  async function handleSubmit(event: any) {
    setSaving(true)
    event.preventDefault()

    const response = user ?
      await client.updateUser(user)
    : await client.createUser(user)

    const data = await response.json()
    setSaving(false)
    cancelForm()
    Router.reload()
  }

  if (user) {
    return (
      <>
        <Dialog
          open={!!user}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableRestoreFocus
        >
          <Box p={4} component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField autoFocus label="First Name" name="first_name" value={user.first_name || ''} onChange={handleChange} />
                <TextField label="Last Name" name="last_name" value={user.last_name || ''} onChange={handleChange} />
              </Stack>
              <Stack spacing={2} direction="row">
                <TextField fullWidth label="Email" name="email" value={user.email || ''} onChange={handleChange} />
              </Stack>
              <Stack spacing={2} direction="row">
                <FormControlLabel control={<Checkbox name="admin" checked={user.admin} onChange={handleCheck} />} label="Admin" />
                <FormControlLabel control={<Checkbox name="gamemaster" checked={user.gamemaster} onChange={handleCheck} />} label="GM" />
              </Stack>
              <Stack alignItems="flex-end" spacing={2} direction="row">
                <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
                <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
              </Stack>
            </Stack>
          </Box>
        </Dialog>
      </>
    )
  } else {
    return (<></>)
  }
}
