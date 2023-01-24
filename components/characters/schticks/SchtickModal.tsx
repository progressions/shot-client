import { Autocomplete, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useState, useEffect, useReducer } from "react"
import { defaultSchtick } from "../../../types/types"
import { useClient } from "../../../contexts/ClientContext"

const initialState = {
  loading: false,
  saving: false,
  schtick: defaultSchtick
}

function schtickReducer(state: any, action: any) {
  switch(action.type) {
    case "replace":
      return { ...state, schtick: action.schtick }
    case "reset":
      return initialState
    default:
      return state
  }
}

export default function SchtickModal({ open, setOpen, characterState, dispatchCharacter }) {
  const { user, client } = useClient()
  const [state, dispatch] = useReducer(schtickReducer, { ...initialState })
  const [schticks, setSchticks] = useState([])
  const { loading, saving, schtick } = state

  async function getSchticks() {
    const response = await client.getSchticks()
    if (response.status === 200) {
      const data = await response.json()
      setSchticks(data)
    }
  }

  function getOptionLabel(option: any) {
    return option.label || ""
  }

  async function handleSubmit(event: any) {
    cancelForm()
  }

  function cancelForm() {
    dispatch({ type: "reset" })
    setOpen(false)
  }

  function handleSelect(event: any, newValue) {
    dispatch({ type: "replace", schtick: newValue })
  }

  function getOptionLabel(option) {
    return option.title
  }


  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
    >
      <Stack p={4} spacing={2}>
        <Stack direction="row" spacing={2}>
          <Autocomplete
            disabled={loading}
            options={schticks}
            sx={{ width: 300 }}
            onChange={handleSelect}
            onOpen={getSchticks}
            openOnFocus
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => <TextField autoFocus name="Schtick" {...params} label="Schtick" />}
          />
        </Stack>
        <TextField name="title" label="Title" value={schtick?.title || ""} readOnly />
        <Stack alignItems="flex-end" spacing={2} direction="row">
          <Button variant="outlined" color="secondary" disabled={saving} onClick={cancelForm}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saving}>Save</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}
