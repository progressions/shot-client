import { useReducer, useEffect, useState } from 'react'
import { Tooltip, Box, Stack, TextField, Button, Dialog } from '@mui/material'

import BoltIcon from "@mui/icons-material/Bolt"
import { useFight, useToast, useClient } from "@/contexts"
import type { Character, Fight, Toast } from "@/types/types"
import { CharacterTypes } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { FormActions, useForm } from '@/reducers/formState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"
import CS from "@/services/CharacterService"
import FES from "@/services/FightEventService"

interface ActionModalParams {
  character: Character,
}

type FormData = {
  shots: number
}

export default function ActionModal({ character }: ActionModalParams) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ shots: 3 })
  const { open, saving, disabled, formData } = formState
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
        if (CS.isVehicle(character)) {
          await client.actVehicle(character, fight as Fight, shots)
        } else {
          await client.actCharacter(character, fight as Fight, shots)
        }
        await FES.spendShots(client, fight as Fight, character, shots)

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
    dispatchForm({ type: FormActions.RESET, payload: initialFormState})
  }

  const handleOpen = () => {
    dispatchForm({ type: FormActions.OPEN, payload: true })
  }

  return (<>
    <Tooltip title="Take Action" arrow>
      <Button sx={{width: 60}} variant="contained" color="highlight" onClick={handleOpen}>
        <BoltIcon sx={{width: 50, height: 50}} />
      </Button>
    </Tooltip>
    <StyledFormDialog
      open={open}
      onClose={cancelForm}
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
  </>)
}
