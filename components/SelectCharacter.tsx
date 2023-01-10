import { useState } from 'react'
import { Box, TextField, MenuItem, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from './FightDetail'
import Client from "./Client"
import Api from "./Api"

import type { Fight, Character } from "../types/types"

interface SelectCharacterParams {
  fight: Fight,
  setFight: React.Dispatch<React.SetStateAction<Fight>>
}

export default function SelectCharacter({ fight, setFight }: SelectCharacterParams) {
  const api = new Api()
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

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
