import { useReducer, useEffect, useState } from "react"
import { Tooltip, DialogContent, Box, Stack, TextField, Button, Dialog } from "@mui/material"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"

import { useFight, useToast, useClient } from "@/contexts"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
import { FormActions, useForm } from '@/reducers/formState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"
import CS from "@/services/CharacterService"

interface WoundsModalParams {
  character: Person,
}

type FormData = {
  smackdown: number
}

export default function WoundsModal({ character }: WoundsModalParams) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ smackdown: 0 });
  const { open, saving, disabled, formData } = formState;
  const { smackdown } = formData

  const { fight, dispatch:dispatchFight } = useFight()
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  useEffect(() => {
    dispatchForm({ type: FormActions.DISABLE, payload: !smackdown })
  }, [smackdown])

  const handleOpen = () => {
    dispatchForm({ type: FormActions.OPEN, payload: true })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "smackdown", value: parseInt(event.target.value) })
  }

  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    const wounds = CS.calculateWounds(character, smackdown)
    const updatedCharacter = CS.takeSmackdown(character, smackdown)

    try {
      await client.updateCharacter(updatedCharacter, fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${character.name} took a smackdown of ${smackdown}, causing ${wounds} wounds.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    dispatchForm({ type: FormActions.RESET, payload: initialFormState }) 
  }
  const cancelForm = () => {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  return (<>
    <Tooltip title="Take Smackdown" arrow>
      <Button onClick={handleOpen}>
        <HeartBrokenIcon color='error' />
      </Button>
    </Tooltip>
    <StyledFormDialog
      open={open}
      onClose={cancelForm}
      title="Smackdown"
      disabled={saving || disabled}
      onSubmit={submitWounds}
      onCancel={cancelForm}
      width="xs"
    >
      <StyledTextField
        autoFocus
        type="number"
        label="Smackdown"
        required
        disabled={saving}
        name="wounds"
        value={smackdown || ""}
        onChange={handleChange}
      />
    </StyledFormDialog>
  </>)
}
