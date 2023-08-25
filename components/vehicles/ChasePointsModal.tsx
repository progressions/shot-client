import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useToast } from "@/contexts/ToastContext"
import { useClient } from "@/contexts/ClientContext"
import { useFight } from "@/contexts/FightContext"

import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"
import VS from "@/services/VehicleService"

interface ChasePointsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Vehicle,
}

const ChasePointsModal = ({open, setOpen, character }: ChasePointsModalParams) => {
  const { fight, dispatch } = useFight()
  const [chasePoints, setChasePoints] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastError, toastSuccess } = useToast()

  const { client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChasePoints(parseInt(event.target.value))
  }

  const submitChasePoints = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const points = VS.calculateChasePoints(character, chasePoints)
    const updatedVehicle = VS.takeChasePoints(character, chasePoints)

    try {
      await client.updateVehicle(updatedVehicle, fight)
      dispatch({ type: FightActions.EDIT })
      setChasePoints(0)
      setOpen(false)
      toastSuccess(`${character.name} took a smackdown of ${chasePoints}, causing ${points} Chase Points.`)
    } catch(error) {
      toastError()
    }
  }
  const cancelForm = () => {
    setChasePoints(0)
    setOpen(false)
  }
  const label = "Chase Points"

  return (
    <StyledFormDialog
      title={label}
      open={open}
      onClose={() => setOpen(false)}
      onSubmit={submitChasePoints}
      saving={saving}
      onCancel={cancelForm}
    >
      <StyledTextField autoFocus type="number" label={label} required name="chasePoints" value={chasePoints || ""} onChange={handleChange} />
    </StyledFormDialog>
  )
}

export default ChasePointsModal
