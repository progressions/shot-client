import { StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { Stack, Typography } from "@mui/material"
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

export default function AddWeapon() {
  const { character, dispatch:dispatchCharacter, reloadCharacter } = useCharacter()
  const [state, dispatchWeapon] = useReducer(weaponReducer, initialState)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { loading, weapon } = state

  useEffect(() => {
    dispatchWeapon({ type: "reset" })
  }, [character])

  async function addWeapon(event: any) {
    event.preventDefault()
    dispatchWeapon({ type: "saving" })

    const response = await client.createWeapon(character, weapon)
    if (response.status === 200) {
      await reloadCharacter()
      dispatchWeapon({ type: "reset" })
    } else {
      toastError()
    }
  }

  function handleChange(event: any) {
    dispatchWeapon({ type: "update", name: event.target.name, value: event.target.value })
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
        <CancelButton disabled={loading} />
        <SaveButton disabled={loading} onClick={addWeapon}>Add</SaveButton>
      </Stack>
    </>
  )
}
