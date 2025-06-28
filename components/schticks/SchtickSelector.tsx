import { Typography, TextField, MenuItem, Box, Stack, Button } from "@mui/material"
import { useReducer, useEffect, useState } from "react"

import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"
import FilterSchticks from "@/components/schticks/FilterSchticks"
import { SchticksActions, initialSchticksState, schticksReducer } from "@/reducers/schticksState"
import type { SchticksStateType, SchticksActionType } from "@/reducers/schticksState"
import { SaveCancelButtons, StyledTextField } from "@/components/StyledFields"
import { CharacterActions } from "@/reducers/characterState"

interface SchtickSelectorProps {
  allSchticksState: SchticksStateType
  dispatchAllSchticks: React.Dispatch<SchticksActionType>
}

export default function SchtickSelector({ allSchticksState, dispatchAllSchticks }: SchtickSelectorProps) {
  const [state, dispatch] = useReducer(schticksReducer, initialSchticksState)
  const { character, dispatch:dispatchCharacter } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const [open, setOpen] = useState(false)
  const { saving, loading, edited, category, path, name, schtick, schticks, meta, page } = state

  const reload = async () => {
    try {
      const data = await client.getSchticks({ page, category, path, name, character_id: character?.id as string })
      console.log("SchtickSelector data", data)
      dispatch({ type: SchticksActions.SCHTICKS, payload: data })
    } catch (error) {
      console.error("Error fetching schticks:", error)
      toastError()
    }
  }

  useEffect(() => {
    if (user) {
      reload().catch(console.error)
    }
  }, [user, edited])

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
    dispatchAllSchticks({ type: SchticksActions.EDIT })
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
