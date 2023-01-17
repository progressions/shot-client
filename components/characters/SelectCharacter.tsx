import { useMemo, useState, useEffect } from 'react'
import { IconButton, Typography, Stack, Popover, Autocomplete, Box, TextField, MenuItem, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import Client from "../Client"

import PersonIcon from '@mui/icons-material/Person'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'

import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"
import type { Fight, Character, Vehicle } from "../../types/types"
import { defaultCharacter } from "../../types/types"

export default function SelectCharacter() {
  const { jwt, client } = useClient()
  const { setToast } = useToast()
  const { fight, setFight, reloadFight } = useFight()

  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [value, setValue] = useState<Character>(defaultCharacter)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (jwt) {
      const fetchVehicles = async () => {
        const response = await client.getAllVehicles()
        const vehicles = await response.json()

        const ids = fight?.vehicles?.map((vehicle: Vehicle) => vehicle.id)
        const availableVehicles = vehicles.filter((vehicle: Vehicle) => {
          return !ids?.includes(vehicle.id)
        })

        return availableVehicles
      }

      const fetchCharacters = async () => {
        const response = await client.getAllCharacters()
        const chars = await response.json()
        const ids = fight?.characters?.map((char: Character) => char.id)
        const availableChars = chars.filter((char: Character) => {
          return !ids?.includes(char.id)
        })

        return availableChars
      }

      const fetchAndSetOptions = async () => {
        setLoading(true)
        const chars = await fetchCharacters()
        const vehicles = await fetchVehicles()

        setCharacters(chars.concat(vehicles))
        setLoading(false)
      }

      fetchAndSetOptions()
        .catch(console.error)
    }
  }, [jwt, fight, client])

  const handleOpen = async (event: any) => {
    setValue(defaultCharacter)
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

    let response
    if (value.category === "character") {
      response = await client.addCharacter(fight, {id: id})
    } else {
      response = await client.addVehicle(fight, {id: id})
    }
    const character = await response.json()
    setToast({ open: true, message: `${character.name} added.`, severity: "success" })
    setValue(defaultCharacter)
    await reloadFight(fight)
  }

  const getOptionLabel = (character: any) => {
    if (!character.name) return ""

    const carEmoji = "🚗"
    const personEmoji = "👤"

    const emoji = (character.category === "vehicle") ? carEmoji : personEmoji

    return `${emoji} ${character.name} (${character.action_values["Type"]})`
  }

  return (
    <>
      <Button variant="outlined" endIcon={<PersonIcon />} startIcon={<DirectionsCarFilledIcon />} onClick={handleOpen}>Select</Button>
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
          <Stack direction="row" spacing={1}>
            <Autocomplete
              disabled={loading}
              freeSolo
              options={characters}
              sx={{ width: 300 }}
              value={value}
              onChange={handleChange}
              getOptionLabel={getOptionLabel}
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
