import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "../../types/types"
import { FightActions } from '../../reducers/fightState'
import { StyledFormDialog, StyledTextField } from "../StyledFields"
import VS from "../../services/VehicleService"

interface ConditionPointsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Vehicle,
}

const ConditionPointsModal = ({open, setOpen, character }: ConditionPointsModalParams) => {
  const { fight, dispatch:dispatchFight } = useFight()
  const [conditionPoints, setConditionPoints] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()

  const { client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConditionPoints(parseInt(event.target.value))
  }

  const submitConditionPoints = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const points = VS.calculateConditionPoints(character, conditionPoints)
    const updatedVehicle = VS.takeConditionPoints(character, conditionPoints)

    try {
      await client.updateVehicle(updatedVehicle, fight)
      dispatchFight({ type: FightActions.EDIT })
      setConditionPoints(0)
      setOpen(false)
      toastSuccess(`${character.name} took a smackdown of ${conditionPoints}, causing ${points} Condition Points.`)
      return
    } catch(error) {
      toastError()
    }
  }

  const cancelForm = () => {
    setConditionPoints(0)
    setOpen(false)
  }
  const label = "Condition Points"

  return (
    <StyledFormDialog
      title={label}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
      onSubmit={submitConditionPoints}
      saving={saving}
      onCancel={cancelForm}
    >
      <StyledTextField autoFocus type="number" label={label} required name="Condition Points" value={conditionPoints || ""} onChange={handleChange} />
    </StyledFormDialog>
  )
}

export default ConditionPointsModal
