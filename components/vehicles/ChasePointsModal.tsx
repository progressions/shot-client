import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../fights/FightDetail'
import Client from "../Client"
import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"

import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "../../types/types"

interface ChasePointsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Vehicle,
}

const ChasePointsModal = ({open, setOpen, character }: ChasePointsModalParams) => {
  const [fight, setFight] = useFight()
  const [chasePoints, setChasePoints] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)
  const { setToast } = useToast()

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

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
      return (character.action_values["Chase Points"] - chasePoints)
    }

    return (character.action_values["Chase Points"] + chasePoints)
  }

  const submitChasePoints = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    const originalPoints: number = calculateOriginalPoints()
    const newChasePoints: number = calculateNewTotal(originalPoints)
    const actionValues: VehicleActionValues = character.action_values
    actionValues["Chase Points"] = newChasePoints

    const response = await client.updateVehicle({ ...character, "action_values": actionValues}, fight)
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id as string, setFight})
      setChasePoints(0)
      setOpen(false)
      if (character.action_values["Type"] === "Mook") {
        setToast({ open: true, message: `${character.name} lost ${originalPoints} mooks.`, severity: "success" })
      } else {
        setToast({ open: true, message: `${character.name} took a smackdown of ${chasePoints}, causing ${originalPoints} Chase Points.`, severity: "success" })
      }
    }
  }
  const cancelForm = () => {
    setChasePoints(0)
    setOpen(false)
  }
  const label = (character.action_values["Type"] === "Mook") ? "Mooks" : "Chase Points"

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
    >
      <Box component="form" onSubmit={submitChasePoints}>
        <Stack p={4} spacing={2}>
          <TextField autoFocus type="number" label={label} required name="chasePoints" value={chasePoints || ""} onChange={handleChange} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}

export default ChasePointsModal
