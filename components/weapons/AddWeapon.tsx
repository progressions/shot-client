import { StyledSelect, StyledDialog, StyledTextField, SaveButton, CancelButton } from "@/components/StyledFields"
import { Box, DialogContent, DialogContentText, DialogActions, Button, Stack, Typography } from "@mui/material"
import { useClient } from "@/contexts/ClientContext"
import { useToast } from "@/contexts/ToastContext"
import { useCharacter } from "@/contexts/CharacterContext"
import FilterWeapons from "@/components/weapons/FilterWeapons"
import { WeaponsActions, initialWeaponsState, weaponsReducer } from "@/reducers/weaponsState"
import { CharacterActions } from "@/reducers/characterState"

import type { Character, Weapon } from "@/types/types"
import { defaultWeapon } from "@/types/types"

import { useState, useEffect, useReducer } from "react"

export default function AddWeapon() {
  const { character, dispatch:dispatchCharacter, reloadCharacter } = useCharacter()
  const { toastSuccess, toastError } = useToast()
  const { user, client } = useClient()
  const [open, setOpen] = useState(false)
  const [weaponsFilter, dispatchWeapons] = useReducer(weaponsReducer, initialWeaponsState)
  const { weapons, weapon, edited, page, loading, juncture, category, name } = weaponsFilter

  useEffect(() => {
    async function getWeapons() {
      try {
        const data = await client.getWeapons({ page, juncture, category, name, character_id: character?.id as string })
        dispatchWeapons({ type: WeaponsActions.WEAPONS, payload: data })
      } catch(error) {
        toastError()
      }
    }

    if (user?.id && edited) {
      getWeapons().catch(toastError)
    }
  }, [edited, character?.id, dispatchWeapons, user?.id, juncture, category, toastError, client, page, name])

  async function addWeapon(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatchWeapons({ type: WeaponsActions.SAVING })

    try {
      const data = await client.addWeapon(character, weapon)
      dispatchCharacter({ type: CharacterActions.EDIT })
      await reloadCharacter()
      handleClose()
    } catch(error) {
      console.error("Error adding weapon:", error)
      toastError()
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchWeapons({ type: WeaponsActions.UPDATE, name: event.target.name, value: event.target.value })
  }

  function handleClose() {
    setOpen(false)
    dispatchWeapons({ type: WeaponsActions.RESET })
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
              <FilterWeapons state={weaponsFilter} dispatch={dispatchWeapons} />
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
