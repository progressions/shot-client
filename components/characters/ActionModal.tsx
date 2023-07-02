import { useEffect, useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import Client from "../../utils/Client"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { Character, Fight, Toast } from "../../types/types"
import { FightActions } from '../../reducers/fightState'

interface ActionModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Character,
}

const ActionModal = ({open, setOpen, character }: ActionModalParams) => {
  const { fight, dispatch:dispatchFight } = useFight()
  const [shots, setShots] = useState<number>(3)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()

  useEffect(() => {
    if (["Boss", "Uber-Boss"].includes(character.action_values["Type"] as string)) {
      setShots(2)
    }
  }, [character.action_values])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShots(parseInt(event.target.value))
  }
  const submitAction = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    event.preventDefault()
    if (shots > 0) {
      try {
        await client.actCharacter(character, fight as Fight, shots)

        setOpen(false)
        toastSuccess(`${character.name} spent ${shots} shots.`)
        dispatchFight({ type: FightActions.EDIT })
      } catch(error) {
        toastError()
      }
    }
  }
  const cancelForm = () => {
    setShots(3)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
    >
      <Box component="form" onSubmit={submitAction}>
        <Stack p={4} spacing={2}>
          <TextField autoFocus type="number" label="Shots" required name="shots" value={shots || ''} onChange={handleChange} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}

export default ActionModal
