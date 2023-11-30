import { useState } from 'react'
import { DialogContent, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import Client from "@/utils/Client"

import { useFight } from "@/contexts/FightContext"
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import type { Person, Character, Fight, Toast, ActionValues } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { StyledTextField, StyledFormDialog, SaveCancelButtons } from '@/components/StyledFields'
import CS from "@/services/CharacterService"

interface HealModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Person,
}

export default function HealModal({open, setOpen, character }: HealModalParams) {
  const { fight, dispatch:dispatchFight } = useFight()
  const [healing, setHealing] = useState<number>(0)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHealing(parseInt(event.target.value))
  }
  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const updatedCharacter = CS.healWounds(character, healing)

    try {
      await client.updateCharacter(updatedCharacter, fight)
      dispatchFight({ type: FightActions.EDIT })
      setHealing(0)
      setOpen(false)
      toastSuccess(`${character.name} healed ${healing} Wounds.`)
    } catch(error) {
      toastError()
    }
  }
  const cancelForm = () => {
    setHealing(0)
    setOpen(false)
  }

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={submitWounds}
      title="Heal Wounds"
      onCancel={cancelForm}
      width="xs"
    >
      <StyledTextField autoFocus type="number" label="Heal Wounds" required name="healing" value={healing || ""} onChange={handleChange} />
    </StyledFormDialog>
  )
}
