import { useState } from 'react'
import { Stack, TextField, Button, Dialog } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../Fight'

const ActionModal = ({open, setOpen, endpoint, fight, character, setFight}) => {
  const [shots, setShots] = useState(3)
  const [saving, setSaving] = useState(false)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const handleChange = (event) => {
    setShots(event.target.value)
  }
  const submitAction = async (event) => {
    event.preventDefault()
    const response = await fetch(`${endpoint}/${fight.id}/characters/${character.id}/act`, {
      method: 'PATCH',
      body: JSON.stringify({"shots": shots}),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    if (response.status === 200) {
      await loadFight({endpoint, jwt, id: fight.id, setFight})
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
