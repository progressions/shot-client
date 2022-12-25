import { useState } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Router from "next/router"

export default function Character({ endpoint, fight, char }: any) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false);
  const [character, setCharacter] = useState(char)

  async function editCharacter(character: any) {
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }
  const cancelForm = () => {
    setOpen(false)
  }

  async function deleteCharacter(character: any) {
    const response = await fetch(`${endpoint}/${fight.id}/characters/${character.id}`, {
      method: 'DELETE'
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

  async function handleSubmit() {
    setSaving(true)
    event.preventDefault()
    const JSONdata = JSON.stringify({"character": character})
    console.log(JSONdata)
    // Form the request for sending data to the server.
    const options: RequestInit = {
      // The method is POST because we are sending data.
      method: 'PATCH',
      mode: 'cors',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    const url = `${endpoint}/${fight.id}/characters/${character.id}`
    const response = await fetch(url, options)
    const result = await response.json()
    console.log(result)
    setSaving(false)
    cancelForm()
    Router.reload()
  }

  const handleChange = (event: any) => {
    setCharacter(prevState => ({ ...prevState, [event.target.name]: event.target.value }))
  }

  const defense = character.defense ? `(D${character.defense})` : ''
  const impairments = character.impairments ? `(-${character.impairments})` : ''
  return (
    <>
      <TableRow key={character.id}>
        <TableCell>
          <Stack spacing={1} direction="row">
            <Typography sx={{fontWeight: 'bold'}}>
              {character.name}
            </Typography>
            <Typography>
              {defense}
            </Typography>
            <Typography>
              {impairments}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <IconButton variant="text" onClick={() => {editCharacter(character)}}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteCharacter(character)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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

