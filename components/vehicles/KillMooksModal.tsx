import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"

import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"

interface MooksKilledModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Vehicle,
}

export default function MooksKilledModal({open, setOpen, character }: MooksKilledModalParams) {
  const { fight, dispatch } = useFight()
  const [mooksKilled, setMooksKilled] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastError, toastSuccess } = useToast()
  const { client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMooksKilled(parseInt(event.target.value))
  }

  const calculateNewTotal = (damage: number) => {
    return (character.count - damage)
  }

  const submitMooksKilled = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const originalPoints: number = character.count
    const newCount: number = calculateNewTotal(mooksKilled)

    try {
      await client.updateVehicle({ ...character, count: newCount }, fight)
      dispatch({ type: FightActions.EDIT })
      setMooksKilled(0)
      setOpen(false)
      toastSuccess(`${character.name} lost ${originalPoints} mooks.`)
    } catch(error) {
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
      title={label}
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={submitMooksKilled}
      saving={saving}
      onCancel={cancelForm}
    >
      <StyledTextField autoFocus type="number" label={label} required name="mooksKilled" value={mooksKilled || ""} onChange={handleChange} />
    </StyledFormDialog>
  )
}
