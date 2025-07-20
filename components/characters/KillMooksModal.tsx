import { useReducer, useEffect, useState } from "react"
import { Tooltip, DialogContent, Box, Stack, TextField, Button, Dialog } from "@mui/material"
import HeartBrokenIcon from "@mui/icons-material/HeartBroken"

import { useFight, useToast, useClient } from "@/contexts"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
import { FormActions, useForm } from '@/reducers/formState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"
import CS from "@/services/CharacterService"

interface KillMooksModalProps {
  character: Person,
}

type FormData = {
  mooks: number
}

export default function KillMooksModal({ character }: KillMooksModalProps) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ mooks: 0 })
  const { open, saving, disabled, formData } = formState
  const { mooks } = formData

  const { fight, dispatch:dispatchFight } = useFight()
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  useEffect(() => {
    dispatchForm({ type: FormActions.DISABLE, payload: !mooks })
  }, [mooks])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "mooks", value: parseInt(event.target.value) })
  }

  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    const newCount: number = character.count - mooks

    try {
      if (CS.isVehicle(character)) {
        await client.updateVehicle({ ...character, count: newCount }, fight)
      } else {
        await client.updateCharacter({ ...character, count: newCount }, fight)
      }
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${character.name} lost ${mooks} mooks.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  const cancelForm = () => {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  const handleOpen = () => {
    dispatchForm({ type: FormActions.OPEN, payload: true })
  }

  return (<>
    <Tooltip title="Kill Mooks" arrow>
      <Button onClick={handleOpen}>
        <HeartBrokenIcon color='error' />
      </Button>
    </Tooltip>
    <StyledFormDialog
      open={open}
      onClose={handleOpen}
      title="Kill Mooks"
      onSubmit={submitWounds}
      disabled={saving || disabled}
      onCancel={cancelForm}
      width="xs"
    >
      <StyledTextField autoFocus type="number" label="Kill Mooks" required name="wounds" value={mooks || ""} onChange={handleChange} />
    </StyledFormDialog>
  </>)
}
