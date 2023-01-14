import { useState } from 'react'
import { Box, TextField, MenuItem, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../fights/FightDetail'
import Client from "../Client"

import PersonIcon from '@mui/icons-material/Person'

import { useFight } from "../../contexts/FightContext"
import type { Fight, Character } from "../../types/types"

export default function SelectCharacter() {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const [fight, setFight] = useFight()
  const [value, setValue] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [chars, setChars] = useState<Character[]>([])

  const handleOpen = async (): Promise<void> => {
    const response = await client.getAllCharacters()
    const chars = await response.json()

    const ids = fight?.characters?.map((char: Character) => char.id)
    const availableChars = chars.filter((char: Character) => {
      return !ids?.includes(char.id)
    })

    setValue('')
    setChars(availableChars)
    setOpen(true)
  }

  const handleClose = ():void => {
    setOpen(false)
    setChars([])
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>):void => {
    setValue(event.target.value)
  }

  const handleSubmit = async (event: React.SyntheticEvent):Promise<void> => {
    event.preventDefault()

    const response = await client.addCharacter(fight, {id: value})
    const data = await response.json()
    await loadFight({jwt, id: fight.id as string, setFight})

    setOpen(false)
  }

  return (
    <>
      <Button variant="outlined" startIcon={<PersonIcon />} onClick={handleOpen}>Select</Button>
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
                chars.map((char: Character) => <MenuItem key={char.id} value={char.id}>{char.name}</MenuItem>)
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
