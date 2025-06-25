import { Autocomplete, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useState, useEffect, useReducer } from "react"
import type { Schtick } from "@/types/types"
import { defaultSchtick } from "@/types/types"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { StyledTextField, StyledDialog, SaveCancelButtons } from "@/components/StyledFields"
import { initialSchticksState, schticksReducer } from "@/reducers/schticksState"
import { SchticksActions } from "@/reducers/schticksState"

import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"

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

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    try {
      (schtick?.id) ? await client.updateSchtick(schtick) : await client.createSchtick(schtick)
      dispatch({ type: SchticksActions.EDIT })
      toastSuccess("Schtick updated.")
    } catch(error) {
      console.error(error)
      toastError()
    }
    cancelForm()
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSchtick(oldSchtick => ({ ...schtick, [event.target.name]: event.target.value }))
  }

  function cancelForm() {
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
