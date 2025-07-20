import { Autocomplete, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useState, useEffect, useReducer } from "react"
import type { Schtick } from "@/types/types"
import { defaultSchtick } from "@/types/types"
import { useClient, useToast } from "@/contexts"
import { StyledTextField, StyledDialog, SaveCancelButtons } from "@/components/StyledFields"
import { SchticksActions } from "@/reducers/schticksState"
import { FormActions, useForm } from '@/reducers/formState'
import { Editor } from "@/components/editor"

import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"

interface SchtickModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  state: SchticksStateType
  dispatch: React.Dispatch<SchticksActionType>
  schtick?: Schtick
}

type FormData = {
  schtick: Schtick
}

export default function SchtickModal({ open, setOpen, state, dispatch, schtick:initialSchtick }: SchtickModalProps) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ schtick: initialSchtick || defaultSchtick })
  const { saving, disabled, formData } = formState
  const { schtick } = formData

  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { category, path } = state

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
    dispatchForm({ type: FormActions.UPDATE, name: "schtick", value: { ...schtick, [event.target.name]: event.target.value } })
  }

  function cancelForm() {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
    setOpen(false)
  }

  return (
    <StyledDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Schtick"
      disabled={saving || disabled}
      onSubmit={handleSubmit}
    >
      <Stack p={4} spacing={2} sx={{width: 530}}>
        <StyledTextField name="name" label="Title" value={schtick?.name || ""} onChange={handleChange} />
        <StyledTextField name="category" label="Category" value={schtick?.category || ""} onChange={handleChange} />
        <StyledTextField name="path" label="Path" value={schtick?.path || ""} onChange={handleChange} />
        <Editor name="description" value={schtick?.description || ""} onChange={handleChange} />
        <SaveCancelButtons disabled={saving || disabled} onCancel={cancelForm} />
      </Stack>
    </StyledDialog>
  )
}
