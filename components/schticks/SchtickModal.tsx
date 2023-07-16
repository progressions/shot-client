import { Autocomplete, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useState, useEffect, useReducer } from "react"
import type { Schtick } from "../../types/types"
import { defaultSchtick } from "../../types/types"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { StyledTextField, StyledDialog, SaveCancelButtons } from "../StyledFields"
import { initialSchticksState, schticksReducer } from "../../reducers/schticksState"
import { SchticksActions } from "../../reducers/schticksState"

import type { SchticksStateType, SchticksActionType } from "../../reducers/schticksState"

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
  const { saving, category, path } = state
  const [schtick, setSchtick] = useState<Schtick>(initialSchtick || defaultSchtick)

  useEffect(() => {
    if (!dispatch) return

    setSchtick(initialSchtick || defaultSchtick)
      // dispatch({ type: SchticksActions.SCHTICK, payload: initialSchtick as Schtick })
  }, [dispatch, initialSchtick])

  useEffect(() => {
    if (!dispatch) return

    dispatch({ type: SchticksActions.UPDATE, name: "category", value: category })
    dispatch({ type: SchticksActions.UPDATE, name: "path", value: path })
  }, [dispatch, category, path])

  async function reloadSchticks() {
    try {
      const data = await client.getSchticks()
      dispatch({ type: SchticksActions.SCHTICKS, payload: data })
    } catch(error) {
      console.error(error)
      toastError()
    }
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    try {
      (schtick?.id) ? await client.updateSchtick(schtick) : await client.createSchtick(schtick)
      await reloadSchticks()
      toastSuccess("Schtick updated.")
    } catch(error) {
      console.log(error)
      toastError()
    }
    cancelForm()
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!dispatch) return

    // dispatch({ type: SchticksActions.UPDATE, name: event.target.name, value: event.target.value })
    setSchtick(oldSchtick => ({ ...schtick, [event.target.name]: event.target.value }))
  }

  function cancelForm() {
    if (!dispatch) return

      // dispatch({ type: SchticksActions.RESET })
    setSchtick(defaultSchtick)
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
        <StyledTextField name="name" label="Title" value={schtick?.name || ""} onChange={handleChange} />
        <StyledTextField name="category" label="Category" value={schtick?.category || ""} onChange={handleChange} />
        <StyledTextField name="path" label="Path" value={schtick?.path || ""} onChange={handleChange} />
        <StyledTextField name="description" multiline rows={8} label="Description" value={schtick?.description || ""} onChange={handleChange} />
        <SaveCancelButtons disabled={saving} onCancel={cancelForm} />
      </Stack>
    </StyledDialog>
  )
}
