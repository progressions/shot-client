import { useState } from 'react'
import { Box, Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../FightDetail'
import Client from "../Client"

import type { Character, Fight } from "../../types/types"

interface WoundsModalParams {
  open: boolean,
  setOpen: (open: boolean) => void,
  fight: Fight,
  character: Character,
  setFight: (fight: Fight) => void
}

const WoundsModal = ({open, setOpen, fight, character, setFight}: WoundsModalParams) => {
  const [wounds, setWounds] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWounds(event.target.value)
  }
  const submitWounds = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    const newWounds = (character.action_values["Type"] === "Mook") ?
      parseInt(character.action_values["Wounds"]) - parseInt(wounds) :
      parseInt(character.action_values["Wounds"]) + parseInt(wounds)
    const actionValues = character.action_values
    actionValues['Wounds'] = `${newWounds}`

    const response = await client.updateCharacter({ ...character, "action_values": actionValues}, fight)
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id as string, setFight})
      setWounds('')
      setOpen(false)
    }
  }
  const cancelForm = () => {
    setWounds('')
    setOpen(false)
  }
  const label = (character.action_values["Type"] === "Mook") ? "Mooks" : "Wounds"

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      disableRestoreFocus
    >
      <Stack p={4} spacing={2} onSubmit={submitWounds}>
        <Box component="form">
          <TextField autoFocus label={label} required name="wounds" value={wounds} onChange={handleChange} />
          <Stack alignItems="flex-end" spacing={2} direction="row">
            <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
            <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
          </Stack>
        </Box>
      </Stack>
    </Dialog>
  )
}

export default WoundsModal
