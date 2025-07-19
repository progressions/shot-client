import { useReducer, useEffect, useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'

import { useFight, useToast, useClient } from "@/contexts"
import type { Character, Fight, Toast } from "@/types/types"
import { CharacterTypes } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { FormActions, formReducer, initializeFormState } from '@/reducers/formState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"
import CS from "@/services/CharacterService"
import FES from "@/services/FightEventService"

interface ActionModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Character,
}

export default function ActionModal({open, setOpen, character }: ActionModalParams) {
  const initialFormState = initializeFormState({ shots: 3 })
  const [formState, dispatchForm] = useReducer(formReducer, initialFormState)
  const { saving, disabled, formData } = formState
  const { shots } = formData

  const { fight, dispatch:dispatchFight } = useFight()
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()

  useEffect(() => {
    dispatchForm({ type: FormActions.DISABLE, payload: !shots })
  }, [shots])

  useEffect(() => {
    if (CS.isType(character, [CharacterTypes.Boss, CharacterTypes.UberBoss])) {
      dispatchForm({ type: FormActions.UPDATE, name: 'shots', value: 2 })
    }
  }, [character])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatchForm({ type: FormActions.UPDATE, name: event.target.name, value: parseInt(event.target.value) })
  }

  const submitAction = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    if (shots > 0) {
      try {
        await client.actCharacter(character, fight as Fight, shots)
        await FES.spendShots(client, fight as Fight, character, shots)

        setOpen(false)
        toastSuccess(`${character.name} spent ${shots} shots.`)
        dispatchFight({ type: FightActions.EDIT })
      } catch(error) {
        console.error("Error spending shots:", error)
        toastError()
      }
    }
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  const cancelForm = () => {
    setOpen(false)
    dispatchForm({ type: FormActions.RESET, payload: initialFormState})
  }

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
      onSubmit={submitAction}
      disabled={saving || disabled}
      onCancel={cancelForm}
      title="Spend Shots"
      width="xs"
    >
      <StyledTextField
        autoFocus
        type="number"
        label="Shots"
        required
        name="shots"
        disabled={saving}
        value={shots || ''}
        onChange={handleChange}
      />
    </StyledFormDialog>
  )
}
