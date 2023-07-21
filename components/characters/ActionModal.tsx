import { useEffect, useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import Client from "../../utils/Client"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import type { Character, Fight, Toast } from "../../types/types"
import { FightActions } from '../../reducers/fightState'
import { StyledFormDialog, StyledTextField } from "../StyledFields"
import CS from "../../services/CharacterService"

interface ActionModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Character,
}

export default function ActionModal({open, setOpen, character }: ActionModalParams) {
  const { fight, dispatch:dispatchFight } = useFight()
  const [shots, setShots] = useState<number>(3)
  const [saving, setSaving] = useState<boolean>(false)
  const { toastSuccess, toastError } = useToast()
  const { client } = useClient()

  useEffect(() => {
    if (CS.isType(character, ["Boss", "Uber-Boss"])) {
      setShots(2)
    }
  }, [character])

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
