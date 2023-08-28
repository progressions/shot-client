import { useState } from 'react'
import { FormGroup, FormControlLabel } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Router from "next/router"

import Client from "@/utils/Client"

import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { defaultUser } from "@/types/types"
import type { User } from "@/types/types"
import { loadUsers } from "@/pages/admin/users"

interface UserModalParams {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

export default function UserModal({ user, setUser, setUsers }: UserModalParams) {
  const { jwt, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  const [saving, setSaving] = useState<boolean>(false);

  function handleClose(): void {
    cancelForm()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((prev: User) => ({ ...prev, [event.target.name]: event.target.value}))
  }

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUser((prev: User) => ({ ...prev, [event.target.name]: event.target.checked}))
  }

  const cancelForm = (): void => {
    setUser(defaultUser)
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    setSaving(true)
    event.preventDefault()

    const message = user.id ? "User updated." : "User created."
    try {
      user.id ? await client.updateUser(user) : await client.createUser(user)
      toastSuccess(message)
    } catch(error) {
      toastError()
    }

    setSaving(false)
    cancelForm()
    loadUsers({ jwt, setUsers })
  }

  if (user) {
    return (
      <>
        <Dialog
          open={!!user?.id}
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
                <FormControlLabel control={<Checkbox name="admin" checked={!!user.admin} onChange={handleCheck} />} label="Admin" />
                <FormControlLabel control={<Checkbox name="gamemaster" checked={!!user.gamemaster} onChange={handleCheck} />} label="GM" />
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
