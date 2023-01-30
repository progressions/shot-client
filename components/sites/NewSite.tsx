import { StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"

import type { Character, Site } from "../../types/types"
import { defaultSite } from "../../types/types"

import { useEffect, useReducer } from "react"

const initialState = {
  error: false,
  loading: false,
  site: defaultSite
}

function siteReducer(state: any, action: any) {
  switch(action.type) {
    case "update":
      return {
        ...state,
        site: {
          ...state.site,
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

export default function NewSite() {
  const { character, dispatch:dispatchCharacter, reloadCharacter } = useCharacter()
  const [state, dispatchSite] = useReducer(siteReducer, initialState)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { loading, site } = state

  useEffect(() => {
    dispatchSite({ type: "reset" })
  }, [character])

  async function addSite(event: any) {
    event.preventDefault()
    dispatchSite({ type: "saving" })

    const response = await client.createSite(character, site)
    if (response.status === 200) {
      await reloadCharacter()
      dispatchSite({ type: "reset" })
    } else {
      toastError()
    }
  }

  function handleChange(event: any) {
    dispatchSite({ type: "update", name: event.target.name, value: event.target.value })
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <StyledTextField
        fullWidth
        required
        value={site?.description}
        name="description"
        label="Description"
        onChange={handleChange}
        disabled={loading}
      />
      <CancelButton disabled={loading} />
      <SaveButton disabled={loading} onClick={addSite}>Add</SaveButton>
    </Stack>
  )
}
