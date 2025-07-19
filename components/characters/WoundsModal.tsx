import { useReducer, useEffect, useState } from "react"
import { DialogContent, Box, Stack, TextField, Button, Dialog } from "@mui/material"

import { useFight, useToast, useClient } from "@/contexts"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
import { FormActions, formReducer, initializeFormState } from '@/reducers/formState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"
import CS from "@/services/CharacterService"

interface WoundsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

export default function WoundsModal({open, setOpen, character }: WoundsModalParams) {
  const initialFormState = initializeFormState({ smackdown: 0 })
  const [formState, dispatchForm] = useReducer(formReducer, initialFormState)
  const { saving, disabled, formData } = formState
  const { smackdown } = formData

  const { fight, dispatch:dispatchFight } = useFight()
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  useEffect(() => {
    dispatchForm({ type: FormActions.DISABLE, payload: !smackdown })
  }, [smackdown])

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
      setOpen(false)
      toastSuccess(`${character.name} took a smackdown of ${smackdown}, causing ${wounds} wounds.`)
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
  const label = "Smackdown"

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
      title={label}
      disabled={saving || disabled}
      onSubmit={submitWounds}
      onCancel={cancelForm}
      width="xs"
    >
      <StyledTextField
        autoFocus
        type="number"
        label={label}
        required
        disabled={saving}
        name="wounds"
        value={smackdown || ""}
        onChange={handleChange}
      />
    </StyledFormDialog>
  )
}
