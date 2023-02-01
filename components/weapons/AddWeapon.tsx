import { StyledSelect, StyledDialog, StyledAutocomplete, StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { Box, DialogContent, DialogContentText, DialogActions, Button, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import FilterWeapons from "./FilterWeapons"
import { initialFilter, filterReducer } from "./filterReducer"

import type { Character, Weapon } from "../../types/types"
import { defaultWeapon } from "../../types/types"

import { useState, useEffect, useReducer } from "react"

export default function AddWeapon() {
  const { character, dispatch:dispatchCharacter, reloadCharacter } = useCharacter()
  const { toastSuccess, toastError } = useToast()
  const { user, client } = useClient()
  const [open, setOpen] = useState(false)
  const [weaponsFilter, dispatchWeapons] = useReducer(filterReducer, initialFilter)
  const { weapons, weapon, edited, page, loading, juncture, category, name } = weaponsFilter

  useEffect(() => {
    async function getWeapons() {
      const response = await client.getWeapons({ page, juncture, category, name, character_id: character?.id as string })
      if (response.status === 200) {
        const data = await response.json()
        dispatchWeapons({ type: "weapons", payload: data })
      }
    }

    if (user?.id && edited) {
      getWeapons().catch(toastError)
    }
  }, [edited, character?.id, dispatchWeapons, user?.id, juncture, category, toastError, client, page, name])

  async function addWeapon(event: any) {
    event.preventDefault()
    dispatchWeapons({ type: "saving" })

    const response = await client.addWeapon(character, weapon)
    if (response.status === 200) {
      await reloadCharacter()
      handleClose()
    } else {
      toastError()
    }
  }

  function handleChange(event: any) {
    dispatchWeapons({ type: "update", name: event.target.name, value: event.target.value })
  }

  function handleClose() {
    setOpen(false)
    dispatchWeapons({ type: "reset" })
  }

  function selectWeapon(event: any, newValue: any) {
    dispatchWeapons({ type: "weapon", payload: newValue })
  }

  function getOptionLabel(option: any) {
    return option?.name || ""
  }

  const helperText = (weapons?.length) ? "" : "There are no available weapons."

  return (
    <>
      <Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add
        </Button>
      </Typography>
      <StyledDialog
        open={open}
        onClose={handleClose}
        onSubmit={addWeapon}
        title="Add Weapon"
      >
        <DialogContent>
          <Stack spacing={2}>
            <Box mt={3}>
              <FilterWeapons filter={weaponsFilter} dispatchFilter={dispatchWeapons} />
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <StyledTextField
                sx={{width: 400}}
                value={weapon?.name}
                name="name"
                label="Name"
                disabled={loading}
                InputProps={{readOnly: true}}
              />
              <StyledTextField
                sx={{width: 80}}
                type="number"
                value={weapon?.damage || ""}
                name="damage"
                label="Damage"
                disabled={loading}
                InputProps={{readOnly: true}}
              />
              <StyledTextField
                sx={{width: 80}}
                type="number"
                value={weapon?.concealment || ""}
                name="concealment"
                label="Concealment"
                disabled={loading}
                InputProps={{readOnly: true}}
              />
              <StyledTextField
                sx={{width: 80}}
                type="number"
                value={weapon?.reload_value || ""}
                label="Reload"
                disabled={loading}
                InputProps={{readOnly: true}}
              />
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <StyledTextField
                fullWidth
                multiline
                rows={3}
                value={weapon?.description || ""}
                label="Description"
                disabled={loading}
                InputProps={{readOnly: true}}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <CancelButton disabled={loading} onClick={handleClose} />
          <SaveButton disabled={loading}>Add</SaveButton>
        </DialogActions>
      </StyledDialog>
    </>
  )
}
