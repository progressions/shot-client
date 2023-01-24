import { Autocomplete, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useState, useEffect, useReducer } from "react"
import { defaultSchtick } from "../../../types/types"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { useCharacter } from "../../../contexts/CharacterContext"

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

export default function SchtickModal({ open, setOpen }: any) {
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const [state, dispatch] = useReducer(schtickReducer, initialState)
  const [schticks, setSchticks] = useState([])
  const { loading, saving, schtick } = state

  const { state:characterState, dispatch:dispatchCharacter } = useCharacter()
  const { character } = characterState

  async function getSchticks() {
    const response = await client.getSchticks()
    if (response.status === 200) {
      const data = await response.json()
      const ids = character.schticks.map((s: any) => (s.id))
      const availableSchticks = data.filter((s: any) => {
        return !ids?.includes(s.id)
      })
      setSchticks(availableSchticks)
    }
  }

  async function handleSubmit(event: any) {
    const response = await client.addSchtick(character, schtick)
    if (response.status === 200) {
      const data = await response.json()
      dispatchCharacter({ type: "replace", character: data })
      toastSuccess("Character updated.")
    } else {
      toastError()
    }
    cancelForm()
  }

  function cancelForm() {
    dispatch({ type: "reset" })
    setOpen(false)
  }

  function handleSelect(event: any, newValue: any) {
    dispatch({ type: "replace", schtick: newValue })
  }

  function getOptionLabel(option: any) {
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
        <TextField name="title" label="Title" value={schtick?.title || ""} InputProps={{readOnly: true}} />
        <TextField name="category" label="Category" value={schtick?.category || ""} InputProps={{readOnly: true}} />
        <TextField name="path" label="Path" value={schtick?.path || ""} InputProps={{readOnly: true}} />
        <TextField name="description" multiline rows={8} label="Description" value={schtick?.description || ""} InputProps={{readOnly: true}} />
        <Stack alignItems="flex-end" spacing={2} direction="row">
          <Button variant="outlined" color="secondary" disabled={saving} onClick={cancelForm}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saving}>Save</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}
