import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"

import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "../../types/types"
import { FightActions } from '../../reducers/fightState'
import { StyledDialog, StyledTextField, SaveCancelButtons } from "../StyledFields"

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

  const { jwt, client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChasePoints(parseInt(event.target.value))
  }

  const calculateOriginalPoints = (): number => {
    if (character.action_values["Type"] === "Mook") {
      return chasePoints
    }

    const result = chasePoints - (character.action_values["Handling"] || 0) + (character.impairments)

    if (result >= 0) {
      return result
    }
    return 0
  }

  const calculateNewTotal = (chasePoints: number) => {
    if (character.action_values["Type"] === "Mook") {
      return (character.count - chasePoints)
    }

    return (character.action_values["Chase Points"] + chasePoints)
  }

  const submitChasePoints = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const originalPoints: number = calculateOriginalPoints()
    const newChasePoints: number = calculateNewTotal(originalPoints)
    const actionValues: VehicleActionValues = character.action_values
    actionValues["Chase Points"] = newChasePoints

    try {
      await client.updateVehicle({ ...character, count: newChasePoints, "action_values": actionValues}, fight)
      dispatch({ type: FightActions.EDIT })
      setChasePoints(0)
      setOpen(false)
      if (character.action_values["Type"] === "Mook") {
        toastSuccess(`${character.name} lost ${originalPoints} mooks.`)
      } else {
        toastSuccess(`${character.name} took a smackdown of ${chasePoints}, causing ${originalPoints} Chase Points.`)
      }
    } catch(error) {
      toastError()
    }
  }
  const cancelForm = () => {
    setChasePoints(0)
    setOpen(false)
  }
  const label = (character.action_values["Type"] === "Mook") ? "Mooks" : "Chase Points"

  return (
    <StyledDialog
      title={label}
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
      onSubmit={submitChasePoints}
    >
      <Stack p={2} spacing={2}>
        <StyledTextField autoFocus type="number" label={label} required name="chasePoints" value={chasePoints || ""} onChange={handleChange} />
        <Stack alignItems="flex-end" spacing={2} direction="row">
          <SaveCancelButtons saving={saving} onCancel={cancelForm} />
        </Stack>
      </Stack>
    </StyledDialog>
  )
}

export default ChasePointsModal
