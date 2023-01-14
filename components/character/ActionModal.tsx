import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../fights/FightDetail'
import Client from "../Client"

import { useFight } from "../../contexts/FightContext"
import { useToast } from "../../contexts/ToastContext"
import type { Character, Fight, Toast } from "../../types/types"
import type { FightContextType } from "../../contexts/FightContext"

interface ActionModalParams {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  character: Character,
}

const ActionModal = ({open, setOpen, character }: ActionModalParams) => {
  const [fight, setFight]:FightContextType = useFight()
  const [shots, setShots] = useState<number>(3)
  const [saving, setSaving] = useState<boolean>(false)
  const { setToast } = useToast()

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt: jwt })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShots(parseInt(event.target.value))
  }
  const submitAction = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    event.preventDefault()
    if (shots > 0) {
      const response = await client.actCharacter(character, fight as Fight, shots)

      if (response.status === 200) {
        setOpen(false)
        setToast({ open: true, message: `Character ${character.name} spent ${shots} shots.`, severity: "success" })
        await loadFight({jwt, id: fight.id as string, setFight})
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
