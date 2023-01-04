import { useState } from 'react'
import { Box, TextField, MenuItem, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from './Fight'

export default function SelectCharacter({ fight, setFight, endpoint }: any) {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization

  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [chars, setChars] = useState([])

  const handleOpen = async () => {
    const response = await fetch(`${endpoint}/all_characters`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      }
    })
    const chars = await response.json()

    const ids = fight.characters.map((char) => char.id)
    const availableChars = chars.filter((char) => {
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

    // api/v1/fights/bfa297b3-64fe-4f5e-9376-d3334f71c9bb/characters/bd3de553-cbd3-47b1-baaa-b6ce757ef43d
    const url = `${endpoint}/fights/${fight.id}/characters/${value}/add`

    const options: RequestInit = {
      method: "POST",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt
      },
      body: JSON.stringify({"character": {"current_shot": 0}})
    }

    const response = await fetch(url, options)
    const data = await response.json()
    await loadFight({endpoint: `${endpoint}/fights`, jwt, id: fight.id, setFight})

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
                chars.map((char) => <MenuItem key={char.id} value={char.id}>{char.name}</MenuItem>)
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
