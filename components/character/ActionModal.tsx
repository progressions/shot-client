import { useState } from 'react'
import { Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../Fight'
import Client from "../Client"

import type { Character, Fight } from "../../types/types"

interface ActionModalParams {
  open: boolean,
  setOpen: (open: boolean) => void,
  fight: Fight,
  character: Character,
  setFight: (fight: Fight) => void
}

const ActionModal = ({open, setOpen, fight, character, setFight}: ActionModalParams) => {
  const [shots, setShots] = useState<number>(3)
  const [saving, setSaving] = useState<boolean>(false)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt: jwt })

  const handleChange = (event: any): void => {
    setShots(event.target.value)
  }
  const submitAction = async (event: any): Promise<void> => {
    event.preventDefault()

    const response = await client.actCharacter(character, fight)

    if (response.status === 200) {
      setOpen(false)
      await loadFight({jwt, id: fight.id as string, setFight})
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
      <Stack p={4} spacing={2} component="form" onSubmit={submitAction}>
        <TextField autoFocus label="Shots" required name="shots" value={shots} onChange={handleChange} />
        <Stack alignItems="flex-end" spacing={2} direction="row">
          <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default ActionModal
