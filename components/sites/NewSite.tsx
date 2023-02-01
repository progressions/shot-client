import { StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"

import type { Character, Site } from "../../types/types"

import { useEffect, useReducer } from "react"
import { initialState, siteReducer } from "./siteReducer"
import type { SiteStateType, SiteActionType } from "./siteReducer"

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

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
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
