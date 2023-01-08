import { useState } from 'react'
import { Box, TextField, MenuItem, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from './Fight'
import Client from "./Client"
import Api from "./Api"

export default function SelectCharacter({ fight, setFight }: any) {
  const api = new Api()
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [chars, setChars] = useState([])

  const handleOpen = async () => {
    const response = await client.getAllCharacters()
    const chars = await response.json()

    const ids = fight.characters.map((char: any) => char.id)
    const availableChars = chars.filter((char: any) => {
      return !ids.includes(char.id)
    })

    setValue('')
    setChars(availableChars)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setChars([])
  }

  const handleChange = (event: any) => {
    setValue(event.target.value)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    const response = await client.addCharacter(fight, {id: value})
    const data = await response.json()
    await loadFight({jwt, id: fight.id, setFight})

    setOpen(false)
  }

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>Select Character</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        disableRestoreFocus
      >
        <form onSubmit={handleSubmit}>
        <DialogTitle>Select Character</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a character to add to the fight
          </DialogContentText>
          <Box sx={{width: 300}} py={2}>
            <TextField label="Character" name="character" fullWidth select value={value} onChange={handleChange}>
              {
                chars.map((char: any) => <MenuItem key={char.id} value={char.id}>{char.name}</MenuItem>)
              }
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} variant="contained">Select</Button>
        </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
