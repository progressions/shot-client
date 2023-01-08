import { useState } from 'react'
import { Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../Fight'
import Client from "../Client"

import type { Character, Fight } from "../../types/types"

interface WoundsModalParams {
  open: boolean,
  setOpen: any,
  fight: Fight,
  character: Character,
  setFight: any
}

const WoundsModal = ({open, setOpen, fight, character, setFight}: WoundsModalParams) => {
  const [wounds, setWounds] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const handleChange = (event: any) => {
    setWounds(event.target.value)
  }
  const submitWounds = async (event: any) => {
    event.preventDefault()
    const newWounds = (character.action_values["Type"] === "Mook") ?
      parseInt(character.action_values["Wounds"]) - parseInt(wounds) :
      parseInt(character.action_values["Wounds"]) + parseInt(wounds)
    const actionValues = character.action_values
    actionValues['Wounds'] = `${newWounds}`

    const response = await client.updateCharacter({ ...character, "action_values": actionValues}, fight)
    if (response.status === 200) {
      await loadFight({jwt, id: fight.id, setFight})
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
      <Stack p={4} spacing={2} component="form" onSubmit={submitWounds}>
        <TextField autoFocus label={label} required name="wounds" value={wounds} onChange={handleChange} />
        <Stack alignItems="flex-end" spacing={2} direction="row">
          <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default WoundsModal
