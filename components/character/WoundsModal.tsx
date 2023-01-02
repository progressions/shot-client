import { useState } from 'react'
import { Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../Fight'

const WoundsModal = ({open, setOpen, endpoint, fight, character, setFight}: any) => {
  const [wounds, setWounds] = useState('')
  const [saving, setSaving] = useState(false)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const handleChange = (event: any) => {
    setWounds(event.target.value)
  }
  const submitWounds = async (event: any) => {
    event.preventDefault()
    const newWounds = parseInt(character.action_values["Wounds"]) + parseInt(wounds)
    const actionValues = character.action_values
    actionValues['Wounds'] = newWounds
    const response = await fetch(`${endpoint}/${fight.id}/characters/${character.id}`, {
      method: 'PATCH',
      body: JSON.stringify({"character": {"action_values": actionValues}}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    if (response.status === 200) {
      await loadFight({endpoint, jwt, id: fight.id, setFight})
      setWounds('')
      setOpen(false)
    }
  }
  const cancelForm = () => {
    setWounds('')
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
      <Stack p={4} spacing={2} component="form" onSubmit={submitWounds}>
        <TextField autoFocus label="Wounds" required name="wounds" value={wounds} onChange={handleChange} />
        <Stack alignItems="flex-end" spacing={2} direction="row">
          <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default WoundsModal
