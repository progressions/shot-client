import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Router from "next/router"
import { useSession } from 'next-auth/react'

export default function CharacterModal(props: any) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const open = props.open
  const setOpen = props.setOpen
  const [saving, setSaving] = useState(false);

  const { endpoint, fight } = props
  const [character, setCharacter] = useState(props.character || {fight_id: fight.id, name: '', defense: null, current_shot: 0, impairments: null, color: ''})
  const method = props.character ? 'PATCH' : 'POST'

  function handleClose() {
    cancelForm()
  }

  const handleChange = (event: any) => {
    setCharacter((prevState: any) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const cancelForm = () => {
    setCharacter(props.character || {fight_id: fight.id, name: '', defense: null, current_shot: 0, impairments: null, color: ''})
    setOpen(false)
  }

  async function handleSubmit(event: any) {
    setSaving(true)
    event.preventDefault()
    const JSONdata = JSON.stringify({"character": character})
    // Form the request for sending data to the server.
    const options: RequestInit = {
      // The method is POST because we are sending data.
      method: method,
      mode: 'cors',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    const url = props.character ? `${endpoint}/${fight.id}/characters/${character.id}` : `${endpoint}/${fight.id}/characters`
    const response = await fetch(url, options)
    const result = await response.json()
    setSaving(false)
    cancelForm()
    Router.reload()
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableRestoreFocus
      >
        <Box p={4} component="form" onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Stack direction="row">
              <TextField autoFocus label="Name" fullWidth required name="name" value={character.name} onChange={handleChange} />
            </Stack>
            <Stack spacing={2} direction="row">
              <TextField label="Current Shot" name="current_shot" value={character.current_shot || ''} onChange={handleChange} />
              <TextField label="Defense" name="defense" value={character.defense || ''} onChange={handleChange} />
              <TextField label="Impairments" name="impairments" value={character.impairments || ''} onChange={handleChange} />
              <TextField label="Color" name="color" value={character.color || ''} onChange={handleChange} />
            </Stack>
            <Stack alignItems="flex-end" spacing={2} direction="row">
              <Button variant="outlined" disabled={saving} onClick={cancelForm}>Cancel</Button>
              <Button variant="contained" type="submit" disabled={saving}>Save Changes</Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>
    </>
  )
}
