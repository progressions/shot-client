import { useState, useEffect } from 'react'
import { IconButton, Typography, Stack, Popover, Autocomplete, Box, TextField, MenuItem, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../fights/FightDetail'
import Client from "../Client"

import PersonIcon from '@mui/icons-material/Person'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import type { Fight, Character } from "../../types/types"

export default function SelectCharacter() {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = new Client({ jwt })

  const { setToast } = useToast()
  const [fight, setFight] = useFight()
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [value, setValue] = useState({label: "", id: null})
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    const getAvailableCharacters = async () => {
      const response = await client.getAllCharacters()
      const chars = await response.json()
      const ids = fight.characters.map((char: Character) => char.id)
      const availableChars = chars.filter((char: Character) => {
        return !ids?.includes(char.id)
      })

      const defaultOptions = [{label: "None", id: ""}]
      const options = availableChars.map((character) => {
        return { label: character.name, id: character.id }
      })

      const results = defaultOptions.concat(options)
      setCharacters(results)
    }

    getAvailableCharacters()
      .catch(console.err)
  }, [fight])

  const handleOpen = async (event) => {
    setOpen(true)
    setAnchorEl(event.target)
  }

  const handleChange = (event, newValue) => {
    if (newValue) {
      setValue(newValue)
    } else {
      setValue({label: "None", id: ""})
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (event: React.SyntheticEvent):Promise<void> => {
    event.preventDefault()

    const { id } = value

    if (!id) return

    const response = await client.addCharacter(fight, {id: id})
    const character = await response.json()
    setToast({ open: true, message: `Character ${character.name} added.`, severity: "success" })
    setValue({label: "None", id: ""})
    await loadFight({jwt, id: fight.id as string, setFight})
  }

  return (
    <>
      <Button variant="outlined" startIcon={<PersonIcon />} onClick={handleOpen}>Select</Button>
      <Popover
        disableAutoFocus={true}
        disableEnforceFocus={true}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Box component="form" onSubmit={handleSubmit} sx={{width: 400}} p={2}>
          <Typography variant="h4">Select Character</Typography>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              freeSolo
              options={characters}
              sx={{ width: 300 }}
              value={value}
              onChange={handleChange}
              getOptionLabel={({label, id}) => label}
              renderInput={(params) => <TextField autoFocus {...params} label="Character" />}
            />
            <Button type="submit" size="small" variant="contained">
              <PersonAddIcon />
            </Button>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
