import { useEffect, useReducer, useState } from 'react'
import { Tooltip, DialogContent, Box, Stack, TextField, Button, Dialog } from '@mui/material'

import FavoriteIcon from "@mui/icons-material/Favorite"
import { useFight, useToast, useClient } from "@/contexts"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { FormActions, useForm } from '@/reducers/formState'
import { StyledTextField, StyledFormDialog, SaveCancelButtons } from '@/components/StyledFields'
import CS from "@/services/CharacterService"

interface HealModalParams {
  character: Person,
}

type FormData = {
  healing: number
}

export default function HealModal({ character }: HealModalParams) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ healing: 0 })
  const { open, saving, disabled, formData } = formState
  const { healing } = formData

  const { fight, dispatch:dispatchFight } = useFight()
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()

  useEffect(() => {
    dispatchForm({ type: FormActions.DISABLE, payload: !healing })
  }, [healing])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "healing", value: parseInt(event.target.value) })
  }

  const handleOpen = () => {
    dispatchForm({ type: FormActions.OPEN, payload: true })
  }

  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    const updatedCharacter = CS.healWounds(character, healing)

    try {
      await client.updateCharacter(updatedCharacter, fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${character.name} healed ${healing} Wounds.`)
    } catch(error) {
      console.error("Error healing wounds:", error)
      toastError()
    }
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }
  const cancelForm = () => {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  return (<>
    <Tooltip title="Heal Wounds" arrow>
      <Button variant="contained" onClick={handleOpen}>
        <FavoriteIcon color="error" />
      </Button>
    </Tooltip>
    <StyledFormDialog
      open={open}
      onClose={cancelForm}
      onSubmit={submitWounds}
      title="Heal Wounds"
      onCancel={cancelForm}
      disabled={saving || disabled}
      width="xs"
    >
      <StyledTextField
        autoFocus
        type="number"
        label="Heal Wounds"
        required
        name="healing"
        disabled={saving}
        value={healing || ''}
        onChange={handleChange}
      />
    </StyledFormDialog>
  </>)
}
