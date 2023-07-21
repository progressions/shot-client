import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { Vehicle, Character, Fight, Toast } from "../../types/types"
import { FightActions } from '../../reducers/fightState'
import { StyledFormDialog, StyledTextField } from "../StyledFields"

interface ActionModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Vehicle
}

export default function ActionModal({open, setOpen, character }: ActionModalParams) {
  const { fight, dispatch:dispatchFight } = useFight()
  const [shots, setShots] = useState<number>(3)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()
  const { jwt, client } = useClient()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShots(parseInt(event.target.value))
  }
  const submitAction = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    event.preventDefault()
    if (shots > 0) {
      try {
        await client.actVehicle(character, fight, shots)

        setOpen(false)
        dispatchFight({ type: FightActions.EDIT })
        toastSuccess(`${character.name} spent ${shots} shots.`)
      } catch(error) {
        console.error(error)
        toastError()
      }
    }
  }
  const cancelForm = () => {
    setShots(3)
    setOpen(false)
  }

  return (
    <StyledFormDialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
      onSubmit={submitAction}
      saving={saving}
      onCancel={cancelForm}
      title="Spend Shots"
      width="xs"
    >
      <StyledTextField autoFocus type="number" label="Shots" required name="shots" value={shots || ''} onChange={handleChange} />
    </StyledFormDialog>
  )
}
