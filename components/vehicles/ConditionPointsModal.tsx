import { Tooltip, Box, Stack, TextField, Button, Dialog } from '@mui/material'
import CarCrashIcon from '@mui/icons-material/CarCrash'

import { useFight, useToast, useClient } from "@/contexts"
import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "@/types/types"
import { FightActions } from '@/reducers/fightState'
import { FormActions, useForm } from '@/reducers/formState'
import { StyledFormDialog, StyledTextField } from "@/components/StyledFields"
import VS from "@/services/VehicleService"

interface ConditionPointsModalParams {
  character: Vehicle,
}

type FormData = {
  conditionPoints: number
}

export default function ConditionPointsModal({ character }: ConditionPointsModalParams) {
  const { formState, dispatchForm, initialFormState } = useForm<FormData>({ conditionPoints: 0 })
  const { open, saving, disabled, formData } = formState
  const { conditionPoints } = formData

  const { fight, dispatch:dispatchFight } = useFight()
  const { toastSuccess, toastError } = useToast()

  const { client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.UPDATE, name: "conditionPoints", value: parseInt(event.target.value) })
  }

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchForm({ type: FormActions.SUBMIT })
    event.preventDefault()

    const points = VS.calculateConditionPoints(character, conditionPoints)
    const updatedVehicle = VS.takeConditionPoints(character, conditionPoints)

    try {
      await client.updateVehicle(updatedVehicle, fight)
      dispatchFight({ type: FightActions.EDIT })
      toastSuccess(`${character.name} took a smackdown of ${conditionPoints}, causing ${points} Condition Points.`)
    } catch(error) {
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
    <Tooltip title="Take Condition Points">
      <Button variant="contained" onClick={handleOpen}>
        <CarCrashIcon color="error" />
      </Button>
    </Tooltip>
    <StyledFormDialog
      title="Condition Points"
      open={open}
      onClose={cancelForm}
      disableRestoreFocus
      onSubmit={handleSubmit}
      disabled={saving || disabled}
      onCancel={cancelForm}
      width="xs"
    >
      <StyledTextField autoFocus type="number" label="Condition Points" required name="Condition Points" value={conditionPoints || ""} onChange={handleChange} />
    </StyledFormDialog>
  </>)
}
