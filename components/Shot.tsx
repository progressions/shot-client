import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Modal from '@mui/material/Modal'
import Dialog from '@mui/material/Dialog'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField'
import Router from "next/router"

function Character({ fight, char }: any) {
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

  async function handleSubmit() {
  }
  const handleChange = (event: any) => {
    // setCharacter(prevState => ({ ...prevState, [event.target.name]: event.target.value }))
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

export default function Shot({ fight, endpoint, shot, characters }: any) {
  async function deleteCharacter(character: any) {
    const response = await fetch(`${endpoint}/${fight.id}/characters/${character.id}`, {
      method: 'DELETE'
    })
    if (response.status === 200) {
      Router.reload()
    }
  }

  return (
    <>
      <TableRow key={shot}>
        <TableCell key={shot}>
          <Typography variant="h4">{shot || 0}</Typography>
        </TableCell>
        <TableCell />
      </TableRow>
      {characters.map((character: any) => {
        return (
          <Character fight={fight} char={character} />
        )
      })}
    </>
  )
}
