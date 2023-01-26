import { Autocomplete, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useState, useEffect, useReducer } from "react"
import { defaultSchtick } from "../../../types/types"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"

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

export default function CreateSchtick({ open, setOpen, dispatchFilter }: any) {
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const [state, dispatch] = useReducer(schtickReducer, initialState)
  const { saving, schtick } = state

  async function reloadSchticks() {
    const response = await client.getSchticks()
    if (response.status === 200) {
      const data = await response.json()
      dispatchFilter({ type: "schticks", payload: data })
    }
  }

  async function handleSubmit(event: any) {
    const response = await client.createSchtick(schtick)
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
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
    >
      <Box sx={{width: 400}}>
        <Stack p={4} spacing={2}>
          <TextField name="title" label="Title" value={schtick?.title || ""} onChange={handleChange} />
          <TextField name="category" label="Category" value={schtick?.category || ""} onChange={handleChange} />
          <TextField name="path" label="Path" value={schtick?.path || ""} onChange={handleChange} />
          <TextField name="description" multiline rows={8} label="Description" value={schtick?.description || ""} onChange={handleChange} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" color="secondary" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saving}>Save</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}
