import { useState, useReducer } from 'react'
import { Tooltip, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useToast, useClient, useFight } from "@/contexts"

import CommuteIcon from '@mui/icons-material/Commute'
import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { FormActions, useForm } from '@/reducers/formState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"
import VS from "@/services/VehicleService"

interface ChasePointsModalParams {
  character: Vehicle,
}

type FormData = {
  chasePoints: number
}

const ChasePointsModal = ({ character }: ChasePointsModalParams) => {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ chasePoints: 0 })
  const { open, saving, disabled, formData } = formState
  const { chasePoints } = formData

  const { fight, dispatch } = useFight()
  const { toastError, toastSuccess } = useToast()

  const { client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "chasePoints", value: parseInt(event.target.value) })
  }

  const submitChasePoints = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    const points = VS.calculateChasePoints(character, chasePoints)
    const updatedVehicle = VS.takeChasePoints(character, chasePoints)

    try {
      await client.updateVehicle(updatedVehicle, fight)
      dispatch({ type: FightActions.EDIT })
      toastSuccess(`${character.name} took a smackdown of ${chasePoints}, causing ${points} Chase Points.`)
    } catch(error) {
      console.error("Error taking chase points:", error)
      toastError()
    }
    cancelForm()
  }

  const cancelForm = () => {
    dispatchForm({ type: FormActions.RESET, payload: initialFormState })
  }

  const handleOpen = () => {
    dispatchForm({ type: FormActions.OPEN, payload: true })
  }

  return (<>
    <Tooltip title="Take Chase Points" arrow>
      <Button onClick={handleOpen}>
        <CommuteIcon color="error" />
      </Button>
    </Tooltip>
    <StyledFormDialog
      title="Chase Points"
      open={open}
      onClose={cancelForm}
      onSubmit={submitChasePoints}
      disabled={saving || disabled}
      onCancel={cancelForm}
      width="xs"
    >
      <StyledTextField autoFocus type="number" label="Chase Points" required name="chasePoints" value={chasePoints || ""} onChange={handleChange} />
    </StyledFormDialog>
  </>)
}

export default ChasePointsModal
