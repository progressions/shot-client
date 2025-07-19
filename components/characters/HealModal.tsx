import { useEffect, useReducer, useState } from 'react'
import { DialogContent, Box, Stack, TextField, Button, Dialog } from '@mui/material'

import { useFight, useToast, useClient } from "@/contexts"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { FormActions, formReducer, initializeFormState } from '@/reducers/formState'
import { StyledTextField, StyledFormDialog, SaveCancelButtons } from '@/components/StyledFields'
import CS from "@/services/CharacterService"

interface HealModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

export default function HealModal({open, setOpen, character }: HealModalParams) {
  const initialFormState = initializeFormState({ healing: 0 })
  const [formState, dispatchForm] = useReducer(formReducer, initialFormState)
  const { saving, disabled, formData } = formState
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

  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    const updatedCharacter = CS.healWounds(character, healing)

    try {
      await client.updateCharacter(updatedCharacter, fight)
      dispatchFight({ type: FightActions.EDIT })
      setOpen(false)
      toastSuccess(`${character.name} healed ${healing} Wounds.`)
    } catch(error) {
      console.error("Error healing wounds:", error)
      toastError()
    }
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }
  const cancelForm = () => {
    setOpen(false)
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
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
  )
}
