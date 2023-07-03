import { Typography, TextField, MenuItem, Box, Stack, Button } from "@mui/material"
import { useReducer, useEffect, useState } from "react"

import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import FilterSchticks from "./FilterSchticks"
import { SchticksActions, initialSchticksState, schticksReducer } from "../../reducers/schticksState"
import { SaveCancelButtons, StyledTextField } from "../StyledFields"
import { CharacterActions } from "../../reducers/characterState"

export default function SchtickSelector() {
  const [state, dispatch] = useReducer(schticksReducer, initialSchticksState)
  const { character, dispatch:dispatchCharacter } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const [open, setOpen] = useState(false)
  const { saving, schtick, schticks } = state

  function toggleOpen() {
    setOpen(prev => (!prev))
  }

  async function handleSubmit(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    if (!schtick?.id) return
    dispatch({ type: SchticksActions.SAVING })

    try {
      const data = await client.addSchtick(character, schtick)
      dispatchCharacter({ type: CharacterActions.CHARACTER, payload: data })
      toastSuccess("Schtick added.")
    } catch(error) {
      toastError()
    }

    dispatch({ type: SchticksActions.SUCCESS })
    dispatch({ type: SchticksActions.RESET })
  }

  function cancelForm() {
    dispatch({ type: SchticksActions.RESET })
    setOpen(false)
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleOpen}>Add Schtick</Button>
      <Box sx={{display: open ? "block" : "none"}}>
        <Stack direction="row" spacing={1} alignItems="top" sx={{height: 60}}>
          <FilterSchticks state={state} dispatch={dispatch} />
        </Stack>

        <Stack p={4} spacing={2}>
          <StyledTextField name="name" label="Name" value={schtick?.name || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="category" label="Category" value={schtick?.category || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="path" label="Path" value={schtick?.path || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="description" multiline rows={8} label="Description" value={schtick?.description || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="prerequisite" label="Prerequisite" value={schtick?.prerequisite?.name || ""} InputProps={{readOnly: true}} />
          <SaveCancelButtons onCancel={cancelForm} onSave={handleSubmit} disabled={saving} />
        </Stack>
      </Box>
    </>
  )
}
