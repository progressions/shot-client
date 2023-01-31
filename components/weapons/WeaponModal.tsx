import { StyledSelect, StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { MenuItem, Box, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"

import type { Character, Weapon } from "../../types/types"
import { defaultWeapon } from "../../types/types"

import { useEffect, useReducer } from "react"

const initialState = {
  error: false,
  loading: false,
  weapon: defaultWeapon
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
    case "reset":
      return initialState
    default:
      return state
  }
}

export default function WeaponModal({ filter, dispatchFilter, open, setOpen }) {
  const [state, dispatchWeapon] = useReducer(weaponReducer, initialState)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { loading, weapon } = state
  const { junctures } = filter

  async function addWeapon(event: any) {
    event.preventDefault()
    dispatchWeapon({ type: "saving" })

    const response = await client.createWeapon(weapon)
    if (response.status === 200) {
      dispatchFilter({ type: "edit" })
      setOpen(false)
    } else {
      toastError()
    }
  }

  function cancelForm() {
    dispatchWeapon({ type: "reset" })
    setOpen(false)
  }

  function handleChange(event: any) {
    dispatchWeapon({ type: "update", name: event.target.name, value: event.target.value })
  }

  function changeJuncture(event: any) {
    dispatchWeapon({ type: "update", name: "juncture", value: event.target.value })
  }

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledTextField
          sx={{width: 400}}
          required
          value={weapon?.name}
          name="name"
          label="Name"
          onChange={handleChange}
          disabled={loading}
        />
        <Box sx={{width: 300}}>
          <StyledSelect
            value={weapon?.juncture}
            name="juncture"
            label="Juncture"
            onChange={changeJuncture}
            disabled={loading}
            fullWidth
            select
          >
            {
              junctures.map((juncture) => (
                <MenuItem key={juncture} value={juncture}>{juncture}</MenuItem>
              ))
            }
          </StyledSelect>
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <StyledTextField
          sx={{width: 80}}
          type="number"
          required
          value={weapon?.damage}
          name="damage"
          label="Damage"
          onChange={handleChange}
          disabled={loading}
        />
        <StyledTextField
          sx={{width: 80}}
          type="number"
          required
          value={weapon?.concealment}
          name="concealment"
          label="Concealment"
          onChange={handleChange}
          disabled={loading}
        />
        <StyledTextField
          sx={{width: 80}}
          type="number"
          required
          value={weapon?.reload_value}
          name="reload_value"
          label="Reload"
          onChange={handleChange}
          disabled={loading}
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
      <Stack direction="row" spacing={1} alignItems="center">
        <CancelButton disabled={loading} onClick={cancelForm} />
        <SaveButton disabled={loading} onClick={addWeapon}>Add</SaveButton>
      </Stack>
    </>
  )
}
