import { Autocomplete, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useState, useEffect, useReducer } from "react"
import { defaultSchtick } from "../../../types/types"
import { useClient } from "../../../contexts/ClientContext"
import { useToast } from "../../../contexts/ToastContext"
import { useCharacter } from "../../../contexts/CharacterContext"

export const initialState = {
  loading: false,
  saving: false,
  schtick: defaultSchtick
}

export function schtickReducer(state: any, action: any) {
  switch(action.type) {
    case "replace":
      return { ...state, schtick: action.schtick }
    case "reset":
      return initialState
    default:
      return state
  }
}

export default function SchtickAutocomplete({ schticksState, schticksDispatch }: any) {
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const [state, dispatch] = useReducer(schtickReducer, initialState)
  const { loading, saving, schtick } = state
  const { schticks } = schticksState

  const { state:characterState, dispatch:dispatchCharacter } = useCharacter()
  const { character } = characterState

  async function handleSubmit(event: any) {
    const response = await client.addSchtick(character, schtick)
    if (response.status === 200) {
      const data = await response.json()
      dispatchCharacter({ type: "replace", character: data })
      toastSuccess("Character updated.")
    } else {
      toastError()
    }
    cancelForm()
  }

  function cancelForm() {
    dispatch({ type: "reset" })
  }

  function handleSelect(event: any, newValue: any) {
    dispatch({ type: "replace", schtick: newValue })
  }

  function getOptionLabel(option: any) {
    return option.title
  }

  return (
    <Autocomplete
      disabled={loading}
      options={schticks}
      sx={{ width: 300 }}
      onChange={handleSelect}
      openOnFocus
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option?.id === value?.id}
      renderInput={(params) => <TextField autoFocus name="Schtick" {...params} label="Schtick" />}
    />
  )
}
