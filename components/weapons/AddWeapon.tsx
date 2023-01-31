import { StyledSelect, StyledDialog, StyledAutocomplete, StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { Box, DialogContent, DialogContentText, DialogActions, Button, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import FilterWeapons from "./FilterWeapons"

import type { Character, Weapon } from "../../types/types"
import { defaultWeapon } from "../../types/types"

import { useState, useEffect, useReducer } from "react"

const initialState = {
  error: false,
  loading: false,
  weapon: defaultWeapon,
  weapons: [],
  meta: {}
}

function weaponReducer(state: any, action: any) {
  switch(action.type) {
    case "update":
      return {
        ...state,
        weapon: {
          ...state.weapon,
          [action.name]: action.value
        }
      }
    case "saving":
      return {
        ...state,
        loading: true
      }
    case "weapon":
      return {
        ...state,
        weapon: action.payload
      }
    case "weapons":
      return {
        ...state,
        weapons: action.payload.weapons,
        meta: action.payload.meta
      }
    case "reset":
      return initialState
    default:
      return state
  }
}

export default function AddWeapon() {
  const { character, dispatch:dispatchCharacter, reloadCharacter } = useCharacter()
  const [state, dispatchWeapon] = useReducer(weaponReducer, initialState)
  const { toastSuccess, toastError } = useToast()
  const { user, client } = useClient()
  const { loading, weapon, weapons } = state
  const [open, setOpen] = useState(false)

  useEffect(() => {
    dispatchWeapon({ type: "reset" })
  }, [character])

  useEffect(() => {
    if (!open) return

    async function getWeapons() {
      const response = await client.getWeapons()
      if (response.status === 200) {
        const data = await response.json()
        dispatchWeapon({ type: "weapons", payload: data })
      }
    }

    if (user?.id) {
      getWeapons().catch(toastError)
    }
  }, [open, user?.id, client, dispatchWeapon, toastError])

  async function addWeapon(event: any) {
    event.preventDefault()
    dispatchWeapon({ type: "saving" })

    const response = await client.addWeapon(character, weapon)
    if (response.status === 200) {
      await reloadCharacter()
      handleClose()
    } else {
      toastError()
    }
  }

  function handleChange(event: any) {
    dispatchWeapon({ type: "update", name: event.target.name, value: event.target.value })
  }

  function handleClose() {
    setOpen(false)
    dispatchWeapon({ type: "reset" })
  }

  function selectWeapon(event: any, newValue: any) {
    dispatchWeapon({ type: "weapon", payload: newValue })
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
          <DialogContentText>
            Select a weapon
          </DialogContentText>
          <Stack spacing={2}>
            <Box mt={3}>
              <StyledAutocomplete
                freeSolo
                value={weapon || null}
                disabled={loading || !weapons?.length}
                options={weapons || []}
                sx={{ width: 300 }}
                onChange={selectWeapon}
                openOnFocus
                getOptionLabel={getOptionLabel}
                renderInput={(params: any) => <StyledSelect autoFocus helperText={helperText} {...params} label="Weapon" />}
              />
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <StyledTextField
                sx={{width: 400}}
                required
                value={weapon?.name}
                name="name"
                label="Name"
                disabled={loading}
                InputProps={{readOnly: true}}
              />
              <StyledTextField
                sx={{width: 80}}
                type="number"
                required
                value={weapon?.damage || ""}
                name="damage"
                label="Damage"
                disabled={loading}
                InputProps={{readOnly: true}}
              />
              <StyledTextField
                sx={{width: 80}}
                type="number"
                required
                value={weapon?.concealment || ""}
                name="concealment"
                label="Concealment"
                disabled={loading}
                InputProps={{readOnly: true}}
              />
              <StyledTextField
                sx={{width: 80}}
                type="number"
                required
                value={weapon?.reload_value || ""}
                name="reload_value"
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
                required
                value={weapon?.description}
                name="description"
                label="Description"
                onChange={handleChange}
                disabled={loading}
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
