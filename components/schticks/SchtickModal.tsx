import { Autocomplete, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useState, useEffect, useReducer } from "react"
import { defaultSchtick } from "../../types/types"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { StyledTextField, StyledDialog, SaveCancelButtons } from "../StyledFields"

const initialState = {
  loading: false,
  saving: false,
  schtick: defaultSchtick
}

function schtickReducer(state: any, action: any) {
  switch(action.type) {
    case "replace":
      return { ...state, schtick: action.schtick }
    case "update":
      return {
      ...state,
      schtick: {
        ...state.schtick,
        [action.name]: action.value
      }
    }
    case "reset":
      return initialState
    default:
      return state
  }
}

export default function SchtickModal({ open, setOpen, filter, dispatchFilter, schtick:initialSchtick }: any) {
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const [state, dispatch] = useReducer(schtickReducer, initialState)
  const { saving, schtick } = state
  const { category, path } = filter

  useEffect(() => {
    dispatch({ type: "replace", schtick: initialSchtick })
  }, [initialSchtick])

  useEffect(() => {
    dispatch({ type: "update", name: "category", value: category })
    dispatch({ type: "update", name: "path", value: path })
  }, [category, path])

  async function reloadSchticks() {
    const response = await client.getSchticks()
    if (response.status === 200) {
      const data = await response.json()
      dispatchFilter({ type: "schticks", payload: data })
    }
  }

  async function handleSubmit(event: any) {
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

  function handleChange(event: any) {
    dispatch({ type: "update", name: event.target.name, value: event.target.value })
  }

  function cancelForm() {
    dispatch({ type: "reset" })
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
