import { Typography, TextField, MenuItem, Box, Stack, Button } from "@mui/material"
import { useReducer, useEffect, useState } from "react"

import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import FilterSchticks from "./FilterSchticks"
import { initialFilter, filterReducer } from "./filterReducer"
import { StyledTextField } from "../characters/edit/StyledFields"

export default function SchtickSelector({ }) {
  const [filter, dispatchFilter] = useReducer(filterReducer, initialFilter)
  const { character, dispatch:dispatchCharacter } = useCharacter()
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const [open, setOpen] = useState(false)
  const { saving, schtick, schticks } = filter

  function toggleOpen() {
    setOpen(prev => (!prev))
  }

  async function handleSubmit(event: any) {
    event.preventDefault()
    dispatchFilter({ type: "saving" })

    const response = await client.addSchtick(character, schtick)
    if (response.status === 200) {
      const data = await response.json()
      dispatchCharacter({ type: "replace", character: data })
      toastSuccess("Schtick added.")
    } else {
      toastError()
    }

    dispatchFilter({ type: "success" })
  }

  function cancelForm() {
    dispatchFilter({ type: "schtick" })
    setOpen(false)
  }

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleOpen}>Add Schtick</Button>
      <Box sx={{display: open ? "block" : "none"}}>
        <Stack direction="row" spacing={1} alignItems="top" sx={{height: 60}}>
          <FilterSchticks filter={filter} dispatchFilter={dispatchFilter} />
        </Stack>

        <Stack p={4} spacing={2}>
          <StyledTextField name="title" label="Title" value={schtick?.title || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="category" label="Category" value={schtick?.category || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="path" label="Path" value={schtick?.path || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="description" multiline rows={8} label="Description" value={schtick?.description || ""} InputProps={{readOnly: true}} />
          <StyledTextField name="prerequisite" label="Prerequisite" value={schtick?.prerequisite?.title || ""} InputProps={{readOnly: true}} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" color="secondary" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saving}>Save</Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}
