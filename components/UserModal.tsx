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

export default function UserModal(props: any) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const open = props.open
  const setOpen = props.setOpen
  const [saving, setSaving] = useState(false);

  const { endpoint, fight } = props
  const [user, setUser] = useState(props.user || {fight_id: fight.id, name: '', defense: null, current_shot: 0, impairments: null})
  const method = props.user ? 'PATCH' : 'POST'

  function handleClose() {
    cancelForm()
  }

  const handleChange = (event: any) => {
    setUser((prevState: any) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const cancelForm = () => {
    setUser(props.user || {fight_id: fight.id, name: '', defense: null, current_shot: 0, impairments: null})
    setOpen(false)
  }

  async function handleSubmit(event: any) {
    setSaving(true)
    event.preventDefault()
    const JSONdata = JSON.stringify({"user": user})
    // Form the request for sending data to the server.
    const options: RequestInit = {
      // The method is POST because we are sending data.
      method: method,
      mode: 'cors',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    const url = props.user ? `${endpoint}/${user.id}` : endpoint
    const response = await fetch(url, options)
    const result = await response.json()
    setSaving(false)
    cancelForm()
    Router.reload()
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableRestoreFocus
      >
        <Box p={4} component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField label="First Name" name="first_name" value={user.first_name || ''} onChange={handleChange} />
              <TextField label="Last Name" name="last_name" value={user.last_name || ''} onChange={handleChange} />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField fullWidth label="Email" name="email" value={user.email || ''} onChange={handleChange} />
            </Stack>
            <Stack spacing={2} direction="row">
              <FormGroup>
                <FormControlLabel control={<Checkbox label="Admin" name="admin" checked={user.admin} onChange={handleChange} />} label="Admin" />
              </FormGroup>
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
}
