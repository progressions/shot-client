import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import Client from "../Client"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "../../types/types"

interface ConditionPointsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Vehicle,
}

const ConditionPointsModal = ({open, setOpen, character }: ConditionPointsModalParams) => {
  const { fight, setFight, reloadFight } = useFight()
  const [conditionPoints, setConditionPoints] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()

  const { jwt, client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConditionPoints(parseInt(event.target.value))
  }

  const calculateOriginalPoints = (): number => {
    if (character.action_values["Type"] === "Mook") {
      return conditionPoints
    }

    const result = conditionPoints - (character.action_values["Frame"] || 0) + (character.impairments)

    if (result >= 0) {
      return result
    }
    return 0
  }

  const calculateNewTotal = (conditionPoints: number) => {
    if (character.action_values["Type"] === "Mook") {
      return (character.action_values["Condition Points"] - conditionPoints)
    }

    return (character.action_values["Condition Points"] + conditionPoints)
  }

  const submitConditionPoints = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const originalPoints: number = calculateOriginalPoints()
    const newConditionPoints: number = calculateNewTotal(originalPoints)
    const actionValues: VehicleActionValues = character.action_values
    actionValues["Condition Points"] = newConditionPoints

    const response = await client.updateVehicle({ ...character, "action_values": actionValues}, fight)
    if (response.status === 200) {
      await reloadFight(fight)
      setConditionPoints(0)
      setOpen(false)
      if (character.action_values["Type"] === "Mook") {
        toastSuccess(`${character.name} lost ${conditionPoints} mooks.`)
      } else {
        toastSuccess(`${character.name} took a smackdown of ${conditionPoints}, causing ${originalPoints} Condition Points.`)
      }
      return
    }
    toastError()
  }

  const cancelForm = () => {
    setConditionPoints(0)
    setOpen(false)
  }
  const label = (character.action_values["Type"] === "Mook") ? "Mooks" : "Condition Points"

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
    >
      <Box component="form" onSubmit={submitConditionPoints}>
        <Stack p={4} spacing={2}>
          <TextField autoFocus type="number" label={label} required name="Condition Points" value={conditionPoints || ""} onChange={handleChange} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}

export default ConditionPointsModal
