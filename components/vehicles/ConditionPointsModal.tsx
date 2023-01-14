import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../fights/FightDetail'
import Client from "../Client"

import { useToast } from "../../contexts/ToastContext"
import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "../../types/types"

interface ConditionPointsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  fight: Fight,
  character: Vehicle,
  setFight: React.Dispatch<React.SetStateAction<Fight>>
}

const ConditionPointsModal = ({open, setOpen, fight, character, setFight }: ConditionPointsModalParams) => {
  const [conditionPoints, setConditionPoints] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { setToast } = useToast()

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConditionPoints(parseInt(event.target.value))
  }
  const submitConditionPoints = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const newConditionPoints: number = (character.action_values["Type"] === "Mook") ?
      (character.action_values["Condition Points"] as number) - conditionPoints :
      (character.action_values["Condition Points"] as number) + conditionPoints
    const actionValues: VehicleActionValues = character.action_values
    actionValues["Condition Points"] = newConditionPoints

    const response = await client.updateVehicle({ ...character, "action_values": actionValues}, fight)
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id as string, setFight})
      setConditionPoints(0)
      setOpen(false)
      if (character.action_values["Type"] === "Mook") {
        setToast({ open: true, message: `${character.name} lost ${conditionPoints} mooks.`, severity: "success" })
      } else {
        setToast({ open: true, message: `Vehicle ${character.name} took ${conditionPoints} Condition Points.`, severity: "success" })
      }
    }
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
