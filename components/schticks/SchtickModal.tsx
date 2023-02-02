import { Autocomplete, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useState, useEffect, useReducer } from "react"
import type { Schtick } from "../../types/types"
import { defaultSchtick } from "../../types/types"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { StyledTextField, StyledDialog, SaveCancelButtons } from "../StyledFields"
import { initialSchticksState, schticksReducer } from "./schticksState"
import { SchticksActions } from "./schticksState"

import type { SchticksStateType, SchticksActionType } from "./schticksState"

interface SchtickModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  state: SchticksStateType
  dispatch: React.Dispatch<SchticksActionType>
  schtick?: Schtick
}

export default function SchtickModal({ open, setOpen, state, dispatch, schtick:initialSchtick }: SchtickModalProps) {
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { saving, schtick, category, path } = state

  useEffect(() => {
    if (!dispatch) return

    dispatch({ type: SchticksActions.SCHTICK, payload: initialSchtick as Schtick })
  }, [dispatch, initialSchtick])

  useEffect(() => {
    if (!dispatch) return

    dispatch({ type: SchticksActions.UPDATE, name: "category", value: category })
    dispatch({ type: SchticksActions.UPDATE, name: "path", value: path })
  }, [dispatch, category, path])

  async function reloadSchticks() {
    const response = await client.getSchticks()
    if (response.status === 200) {
      const data = await response.json()
      dispatch({ type: SchticksActions.SCHTICKS, payload: data })
    }
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    const response = schtick?.id ? await client.updateSchtick(schtick) : await client.createSchtick(schtick)
    if (response.status === 200) {
      await reloadSchticks()
      toastSuccess("Schtick updated.")
    } else {
      toastError()
    }
    cancelForm()
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!dispatch) return

    dispatch({ type: SchticksActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  function cancelForm() {
    if (!dispatch) return

    dispatch({ type: SchticksActions.RESET })
    setOpen(false)
  }

  return (
    <StyledDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Schtick"
      onSubmit={handleSubmit}
    >
      <Stack p={4} spacing={2} sx={{width: 400}}>
        <StyledTextField name="title" label="Title" value={schtick?.title || ""} onChange={handleChange} />
        <StyledTextField name="category" label="Category" value={schtick?.category || ""} onChange={handleChange} />
        <StyledTextField name="path" label="Path" value={schtick?.path || ""} onChange={handleChange} />
        <StyledTextField name="description" multiline rows={8} label="Description" value={schtick?.description || ""} onChange={handleChange} />
        <SaveCancelButtons disabled={saving} onCancel={cancelForm} />
      </Stack>
    </StyledDialog>
  )
}
