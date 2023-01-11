import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../FightDetail'
import Client from "../Client"

import type { Vehicle, Character, Fight, Toast, VehicleActionValues } from "../../types/types"

interface WoundsModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  fight: Fight,
  character: Vehicle,
  setFight: React.Dispatch<React.SetStateAction<Fight>>
  setToast: React.Dispatch<React.SetStateAction<Toast>>
}

const WoundsModal = ({open, setOpen, fight, character, setFight, setToast}: WoundsModalParams) => {
  const [wounds, setWounds] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWounds(parseInt(event.target.value))
  }
  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const newWounds: number = (character.action_values["Type"] === "Mook") ?
      (character.action_values["Chase Points"] as number) - wounds :
      (character.action_values["Chase Points"] as number) + wounds
    const actionValues: VehicleActionValues = character.action_values
    actionValues["Chase Points"] = newWounds

    const response = await client.updateVehicle({ ...character, "action_values": actionValues}, fight)
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id as string, setFight})
      setWounds(0)
      setOpen(false)
      if (character.action_values["Type"] === "Mook") {
        setToast({ open: true, message: `${character.name} lost ${wounds} mooks.`, severity: "success" })
      } else {
        setToast({ open: true, message: `Vehicle ${character.name} took ${wounds} Chase Points.`, severity: "success" })
      }
    }
  }
  const cancelForm = () => {
    setWounds(0)
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
      <Box component="form" onSubmit={submitWounds}>
        <Stack p={4} spacing={2}>
          <TextField autoFocus type="number" label={label} required name="wounds" value={wounds || ""} onChange={handleChange} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}

export default WoundsModal
