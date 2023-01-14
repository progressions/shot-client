import { useMemo, useState, useEffect } from 'react'
import { IconButton, Typography, Stack, Popover, Autocomplete, Box, TextField, MenuItem, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import { loadFight } from '../fights/FightDetail'
import Client from "../Client"

import PersonIcon from '@mui/icons-material/Person'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import { useToast } from "../../contexts/ToastContext"
import { useFight } from "../../contexts/FightContext"
import type { Fight, Character } from "../../types/types"
import { defaultCharacter } from "../../types/types"

export default function SelectCharacter() {
  const session: any = useSession({ required: true })
  const jwt = session?.data?.authorization
  const client = useMemo(() => (new Client({ jwt })), [jwt])

  const { setToast } = useToast()
  const [fight, setFight] = useFight()
  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [value, setValue] = useState<Character>(defaultCharacter)
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {
    if (jwt) {
      const fetchCharacters = async () => {
        const response = await client.getAllCharacters()
        const chars = await response.json()
        const ids = fight?.characters?.map((char: Character) => char.id)
        const availableChars = chars.filter((char: Character) => {
          return !ids?.includes(char.id)
        })

        return availableChars
      }
      const getAvailableCharacters = async () => {
        const options = await fetchCharacters()

        setCharacters(options)
      }

      getAvailableCharacters()
        .catch(console.error)
    }
  }, [jwt, fight, client])

  const handleOpen = async (event: any) => {
    setOpen(true)
    setAnchorEl(event.target)
  }

  const handleChange = (event: any, newValue: any) => {
    if (newValue) {
      setValue(newValue)
    } else {
      setValue(defaultCharacter)
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
    setValue(defaultCharacter)
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
          <Typography variant="h4" gutterBottom>Select Character</Typography>
          <Stack direction="row" spacing={1}>
            <Autocomplete
              freeSolo
              options={characters}
              sx={{ width: 300 }}
              value={value}
              onChange={handleChange}
              getOptionLabel={({name, id}: any) => name}
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
