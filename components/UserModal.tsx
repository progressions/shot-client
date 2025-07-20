import { useEffect, useReducer, useState } from 'react'
import { StyledFormDialog, StyledTextField, SaveCancelButtons } from "@/components/StyledFields"
import { FormGroup, FormControlLabel, Checkbox, Box, Stack, TextField, Button, Dialog, DialogContent, DialogActions } from '@mui/material'
import Router from "next/router"

import { useClient, useToast } from "@/contexts"
import { defaultUser } from "@/types/types"
import type { User } from "@/types/types"
import { loadUsers } from "@/pages/admin/users"
import { FormActions, useForm } from '@/reducers/formState'

interface UserModalParams {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
}

type FormData = {
  user: User
}

export default function UserModal({ user: initialUser, setUser, setUsers }: UserModalParams) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ user: initialUser })
  const { open, saving, disabled, formData } = formState
  const { user } = formData

  useEffect(() => {
    dispatchForm({ type: FormActions.UPDATE, name: "user", value: initialUser })
    dispatchForm({ type: FormActions.OPEN, payload: !!initialUser?.id })
  }, [initialUser, user])

  const { jwt, client } = useClient()
  const { toastSuccess, toastError } = useToast()

  function handleClose(): void {
    cancelForm()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatchForm({ type: FormActions.DISABLE, payload: false })
    dispatchForm({ type: FormActions.EDIT })
    dispatchForm({ type: FormActions.UPDATE, name: "user", value: { ...user, [event.target.name]: event.target.value } })
  }

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatchForm({ type: FormActions.DISABLE, payload: false })
    dispatchForm({ type: FormActions.EDIT })
    dispatchForm({ type: FormActions.UPDATE, name: "user", value: { ...user, [event.target.name]: event.target.checked } })
  }

  const cancelForm = (): void => {
    setUser(defaultUser)
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    const message = user.id ? "User updated." : "User created."
    try {
      user.id ? await client.updateUser(user) : await client.createUser(user)
      toastSuccess(message)
    } catch(error) {
      toastError()
    }

    cancelForm()
    loadUsers({ jwt, setUsers })
  }

  if (!user?.id) return null
  return (
    <>
      <StyledFormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onCancel={cancelForm}
        disabled={saving || disabled}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableRestoreFocus
        title={user.id ? "Edit User" : "Create User"}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <StyledTextField disabled={saving} autoFocus label="First Name" name="first_name" value={user.first_name || ''} onChange={handleChange} />
            <StyledTextField disabled={saving} label="Last Name" name="last_name" value={user.last_name || ''} onChange={handleChange} />
          </Stack>
          <Stack spacing={2} direction="row">
            <StyledTextField disabled={saving} fullWidth label="Email" name="email" value={user.email || ''} onChange={handleChange} />
          </Stack>
          <Stack spacing={2} direction="row">
            <FormControlLabel disabled={saving} control={<Checkbox name="admin" checked={!!user.admin} onChange={handleCheck} />} label="Admin" />
            <FormControlLabel disabled={saving} control={<Checkbox name="gamemaster" checked={!!user.gamemaster} onChange={handleCheck} />} label="GM" />
          </Stack>
        </Stack>
      </StyledFormDialog>
    </>
  )
}
