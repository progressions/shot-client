import { Typography, TextField, MenuItem, Box, Stack, Button } from "@mui/material"
import { useReducer, useEffect, useState } from "react"

import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { useCharacter } from "../../../contexts/CharacterContext"
import FilterSchticks from "./FilterSchticks"

const schtickSelectorState = {
  schticks: [],
  meta: {},
  paths: []
}

export function schtickSelectorReducer(state: any, action: any) {
  switch(action.type) {
    case "replace_schticks":
      return {
      ...state,
      ...action.payload
    }
    default:
      return state
  }
}

export default function SchtickSelector({ }) {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [schtick, setSchtick] = useState({})

  const [state, dispatch] = useReducer(schtickSelectorReducer, schtickSelectorState)
  const { schticks } = state

  useEffect(() => {
    async function getSchticks() {
      const response = await client.getSchticks()
      if (response.status === 200) {
        const data = await response.json()
        dispatch({ type: "replace_schticks", payload: data })
      }
    }

    if (user) {
      getSchticks().catch(toastError)
    }
  }, [client, toastError, user, dispatch])

  function toggleOpen() {
    setOpen(prev => (!prev))
  }

  async function handleSubmit(event: any) {
  }

  function cancelForm() {
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleOpen}>Add Schtick</Button>
      <Box sx={{display: open ? "block" : "none"}}>
        <Stack direction="row" spacing={1}>
          <FilterSchticks state={state} dispatch={dispatch} />
        </Stack>

        <Stack p={4} spacing={2}>
          <TextField name="title" label="Title" value={schtick?.title || ""} InputProps={{readOnly: true}} />
          <TextField name="category" label="Category" value={schtick?.category || ""} InputProps={{readOnly: true}} />
          <TextField name="path" label="Path" value={schtick?.path || ""} InputProps={{readOnly: true}} />
          <TextField name="description" multiline rows={8} label="Description" value={schtick?.description || ""} InputProps={{readOnly: true}} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" color="secondary" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saving}>Save</Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
