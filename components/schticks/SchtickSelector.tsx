import { Typography, TextField, MenuItem, Box, Stack, Button } from "@mui/material"
import { useReducer, useEffect, useState } from "react"

import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import FilterSchticks from "./FilterSchticks"
import { SchticksActions, initialSchticksState, schticksReducer } from "./schticksState"
import { SaveCancelButtons, StyledTextField } from "../StyledFields"
import { CharacterActions } from "../characters/edit/characterState"

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

    const response = await client.addSchtick(character, schtick)
    if (response.status === 200) {
      const data = await response.json()
      dispatchCharacter({ type: CharacterActions.CHARACTER, payload: data })
      toastSuccess("Schtick added.")
    } else {
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
          <StyledTextField name="title" label="Title" value={schtick?.title || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="category" label="Category" value={schtick?.category || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="path" label="Path" value={schtick?.path || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="description" multiline rows={8} label="Description" value={schtick?.description || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="prerequisite" label="Prerequisite" value={schtick?.prerequisite?.title || ""} InputProps={{readOnly: true}} />
          <SaveCancelButtons onCancel={cancelForm} onSave={handleSubmit} disabled={saving} />
        </Stack>
      </Box>
    </>
  )
}
