import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Paper, Popover } from '@mui/material'
import { useSession } from 'next-auth/react'
import { BlockPicker } from 'react-color'
import { loadFight } from '../Fight'

export default function CharacterModal({ open, setOpen, endpoint, fight, setFight, character:activeCharacter }: any) {
  const [picker, setPicker] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const [saving, setSaving] = useState(false);

  const [character, setCharacter] = useState(activeCharacter || {fight_id: fight.id, name: '', defense: null, current_shot: 0, impairments: null, color: '', action_values: {}})
  const method = character ? 'PATCH' : 'POST'

  function handleClose() {
    cancelForm()
  }

  const handleChange = (event: any) => {
    setCharacter((prevState: any) => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const handleAVChange = (event: any) => {
    const { action_values } = character
    setCharacter((prevState: any) => ({ ...prevState, action_values: { ...action_values, [event.target.name]: event.target.value } }))
  }

  const handleColor = (color: any) => {
    setCharacter((prevState: any) => ({ ...prevState, color: color?.hex }))
    setPicker(false)
    setAnchorEl(null)
  }

  const cancelForm = () => {
    setCharacter(character || {fight_id: fight.id, name: '', defense: null, current_shot: 0, impairments: null, color: '', action_values: {}})
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

    const url = character ? `${endpoint}/${fight.id}/characters/${character.id}` : `${endpoint}/${fight.id}/characters`
    const response = await fetch(url, options)
    const data = await response.json()
    setCharacter(data)
    setSaving(false)
    cancelForm()
    await loadFight({endpoint, jwt, id: fight.id, setFight})
  }

  const togglePicker = (event: any) => {
    if (picker) {
      setPicker(false)
      setAnchorEl(null)
    } else {
      setPicker(true)
      setAnchorEl(event.target)
    }
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
            <Stack spacing={2} direction="row" alignItems='center'>
              <TextField label="Current Shot" name="current_shot" value={character.current_shot || ''} onChange={handleChange} />
              <TextField label="Impairments" name="impairments" value={character.impairments || ''} onChange={handleChange} />
              <Box p={2} sx={{width: 10, height: 5, bgcolor: character.color, borderColor: 'primary', border: 1, borderRadius: 2}} onClick={togglePicker} />
              <TextField id="colorPicker" label="Color" name="color" value={character.color || ''} onChange={handleChange} />
            </Stack>
            <Popover anchorEl={anchorEl} open={picker} onClose={() => setPicker(false)} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
              <Paper>
                <BlockPicker color={character.color || ''} onChangeComplete={handleColor} colors={['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF']} />
              </Paper>
            </Popover>
            <Stack direction="row" spacing={2}>
              <TextField label="Attack" sx={{width: 100}} name="Guns" value={character.action_values['Guns'] || ''} onChange={handleAVChange} />
              <TextField label="Defense" sx={{width: 100}} name="Defense" value={character.action_values['Defense'] || ''} onChange={handleAVChange} />
              <TextField label="Fortune" sx={{width: 100}} name="Fortune" value={character.action_values['Fortune'] || ''} onChange={handleAVChange} />
              <TextField label="Toughness" sx={{width: 100}} name="Toughness" value={character.action_values['Toughness'] || ''} onChange={handleAVChange} />
              <TextField label="Speed" sx={{width: 100}} name="Speed" value={character.action_values['Speed'] || ''} onChange={handleAVChange} />
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
