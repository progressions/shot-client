import { SaveCancelButtons, StyledTextField } from "../StyledFields"
import { Box, Stack, Typography } from "@mui/material"
import { useClient } from "../../contexts/ClientContext"
import { useToast } from "../../contexts/ToastContext"
import { useCharacter } from "../../contexts/CharacterContext"
import type { Character, Advancement } from "../../types/types"
import { defaultAdvancement } from "../../types/types"
import { useEffect, useReducer } from "react"
import { AdvancementActions, initialState, advancementReducer } from "../../reducers/advancementState"

export default function NewAdvancement() {
  const { character, dispatch:dispatchCharacter, reloadCharacter } = useCharacter()
  const [state, dispatchAdvancement] = useReducer(advancementReducer, initialState)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()
  const { loading, advancement } = state

  useEffect(() => {
    dispatchAdvancement({ type: AdvancementActions.RESET })
  }, [character])

  async function addAdvancement(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    dispatchAdvancement({ type: AdvancementActions.SAVING })

    try {
      await client.createAdvancement(character, advancement)
      await reloadCharacter()
      dispatchAdvancement({ type: AdvancementActions.RESET })
    } catch(error) {
      toastError()
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    dispatchAdvancement({ type: AdvancementActions.UPDATE, name: event.target.name, value: event.target.value })
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
        helperText=" "
      />
      <Box sx={{ height: 60 }}>
        <SaveCancelButtons disabled={loading} onSave={addAdvancement} saveText="Add" />
      </Box>
    </Stack>
  )
}
