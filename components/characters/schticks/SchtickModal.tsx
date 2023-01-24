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
    case "reset":
      return initialState
    default:
      return state
  }
}

export default function SchtickModal({ open, setOpen }) {
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
  }

  function cancelForm() {
    dispatch({ type: "reset" })
    setOpen(false)
  }

  function handleChange(event: any) {
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
      <Box component="form" onSubmit={handleSubmit} sx={{width: 500}}>
        <Stack p={4} spacing={2}>
          <Autocomplete
            disabled={loading}
            options={schticks}
            sx={{ width: 300 }}
            value={schtick?.id}
            onChange={handleChange}
            onOpen={getSchticks}
            openOnFocus
            getOptionLabel={getOptionLabel}
            renderInput={(params) => <TextField autoFocus name="Faction" {...params} label="Faction" />}
          />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}
