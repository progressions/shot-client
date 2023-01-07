import { useState } from 'react'
import { Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../Fight'

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL

const WoundsModal = ({open, setOpen, fight, character, setFight}: any) => {
  const [wounds, setWounds] = useState('')
  const [saving, setSaving] = useState(false)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const handleChange = (event: any) => {
    setWounds(event.target.value)
  }
  const submitWounds = async (event: any) => {
    event.preventDefault()
    const newWounds = (character.action_values["Type"] === "Mook") ? parseInt(character.action_values["Wounds"] || 0) - parseInt(wounds) : parseInt(character.action_values["Wounds"] || 0) + parseInt(wounds)
    const actionValues = character.action_values
    actionValues['Wounds'] = newWounds
    const response = await fetch(`${apiUrl}/api/v1/fights/${fight.id}/characters/${character.id}`, {
      method: 'PATCH',
      body: JSON.stringify({"character": {"action_values": actionValues}}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
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
