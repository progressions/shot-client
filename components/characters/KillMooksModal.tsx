import { useState } from "react"
import { DialogContent, Box, Stack, TextField, Button, Dialog } from "@mui/material"

import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from "@/reducers/fightState"
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"

interface WoundsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

export default function WoundsModal({open, setOpen, character }: WoundsModalParams) {
  const { fight, dispatch:dispatchFight } = useFight()
  const [mooksKilled, setMooksKilled] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMooksKilled(parseInt(event.target.value))
  }

  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const newCount: number = character.count - mooksKilled

    try {
      await client.updateCharacter({ ...character, count: newCount }, fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${character.name} lost ${mooksKilled} mooks.`)
      setMooksKilled(0)
      setOpen(false)
    } catch(error) {
      console.error(error)
      toastError()
    }
  }
  const cancelForm = () => {
    setMooksKilled(0)
    setOpen(false)
  }
  const label = "Kill Mooks"

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
      title={label}
      onSubmit={submitWounds}
      saving={saving}
      onCancel={cancelForm}
    >
      <StyledTextField autoFocus type="number" label={label} required name="wounds" value={mooksKilled || ""} onChange={handleChange} />
    </StyledFormDialog>
  )
}
