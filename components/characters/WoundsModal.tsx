import { useState } from "react"
import { DialogContent, Box, Stack, TextField, Button, Dialog } from "@mui/material"

import { useFight, useToast, useClient } from "@/contexts"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"
import CS from "@/services/CharacterService"

interface WoundsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

export default function WoundsModal({open, setOpen, character }: WoundsModalParams) {
  const { fight, dispatch:dispatchFight } = useFight()
  const [smackdown, setSmackdown] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSmackdown(parseInt(event.target.value))
  }
  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaving(true)
    event.preventDefault()

    const wounds = CS.calculateWounds(character, smackdown)
    const updatedCharacter = CS.takeSmackdown(character, smackdown)

    try {
      await client.updateCharacter(updatedCharacter, fight)
      dispatchFight({ type: FightActions.EDIT })
      setSmackdown(0)
      setOpen(false)
      toastSuccess(`${character.name} took a smackdown of ${smackdown}, causing ${wounds} wounds.`)
    } catch(error) {
      console.error(error)
      toastError()
    }
    setSaving(false)
  }
  const cancelForm = () => {
    setSmackdown(0)
    setOpen(false)
    setSaving(false)
  }
  const label = "Smackdown"

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
      title={label}
      saving={saving}
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
