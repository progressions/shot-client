import { useReducer, useEffect, useState } from "react"
import { DialogContent, Box, Stack, TextField, Button, Dialog } from "@mui/material"

import { useFight, useToast, useClient } from "@/contexts"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
import { FormActions, formReducer, initializeFormState } from '@/reducers/formState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"

interface WoundsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

export default function WoundsModal({open, setOpen, character }: WoundsModalParams) {
  const initialFormState = initializeFormState({ mooks: 0 })
  const [formState, dispatchForm] = useReducer(formReducer, initialFormState)
  const { saving, disabled, formData } = formState
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
      await client.updateCharacter({ ...character, count: newCount }, fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${character.name} lost ${mooks} mooks.`)
      setOpen(false)
    } catch(error) {
      console.error(error)
      toastError()
    }
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }
  const cancelForm = () => {
    setOpen(false)
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }
  const label = "Kill Mooks"

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
      title={label}
      onSubmit={submitWounds}
      disabled={saving || disabled}
      onCancel={cancelForm}
      width="xs"
    >
      <StyledTextField autoFocus type="number" label={label} required name="wounds" value={mooks || ""} onChange={handleChange} />
    </StyledFormDialog>
  )
}
