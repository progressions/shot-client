import { StyledTextField, SaveButton, CancelButton } from "../StyledFields"
import { Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import type { Character, Advancement } from "../../types/types"
import { defaultAdvancement } from "../../types/types"
import { useEffect, useReducer } from "react"
import { initialState, advancementReducer } from "./advancementReducer"

export default function NewAdvancement() {
  const { character, dispatch:dispatchCharacter, reloadCharacter } = useCharacter()
  const [state, dispatchAdvancement] = useReducer(advancementReducer, initialState)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { loading, advancement } = state

  useEffect(() => {
    dispatchAdvancement({ type: "reset" })
  }, [character])

  async function addAdvancement(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatchAdvancement({ type: "saving" })

    const response = await client.createAdvancement(character, advancement)
    if (response.status === 200) {
      await reloadCharacter()
      dispatchAdvancement({ type: "reset" })
    } else {
      toastError()
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchAdvancement({ type: "update", name: event.target.name, value: event.target.value })
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <StyledTextField
        fullWidth
        required
        value={advancement?.description}
        name="description"
        label="Description"
        onChange={handleChange}
        disabled={loading}
      />
      <CancelButton disabled={loading} />
      <SaveButton disabled={loading} onClick={addAdvancement}>Add</SaveButton>
    </Stack>
  )
}
