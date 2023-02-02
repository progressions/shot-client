import { useCallback, useMemo, useState, useEffect } from 'react'
import { FormControlLabel, Switch, IconButton, Typography, Stack, Popover, Box, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material'
import { useSession } from 'next-auth/react'
import Client from "../Client"
import GamemasterOnly from "../GamemasterOnly"
import { StyledTextField, StyledAutocomplete } from "../StyledFields"

import PersonIcon from '@mui/icons-material/Person'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled'

import { useToast } from "../../contexts/ToastContext"
import { useClient } from "../../contexts/ClientContext"
import { useFight } from "../../contexts/FightContext"
import type { InputParamsType, Fight, Character, Vehicle } from "../../types/types"
import { defaultCharacter } from "../../types/types"

export default function SelectCharacter() {
  const { user, client } = useClient()
  const { toastSuccess, toastError } = useToast()
  const { fight, setFight, reloadFight } = useFight()

  const [open, setOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [value, setValue] = useState<Character>(defaultCharacter)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [showHidden, setShowHidden] = useState(false)

  const loadCharacters = useCallback(() => {
    if (user) {
      const characterVisibility = (character: Character) => {
        return (showHidden || character.active)
      }

      const fetchVehicles = async () => {
        const response = await client.getAllVehicles()
        const vehicles = await response.json()

        const ids = fight?.vehicles?.map((vehicle: Vehicle) => vehicle.id)
        const availableVehicles = vehicles.filter((vehicle: Vehicle) => {
          return !ids?.includes(vehicle.id)
        }).filter(characterVisibility)

        return availableVehicles
      }

      const fetchCharacters = async () => {
        const response = await client.getAllCharacters()
        const chars = await response.json()
        const ids = fight?.characters?.map((char: Character) => char.id)
        const availableChars = chars.filter((char: Character) => {
          return !ids?.includes(char.id)
        }).filter(characterVisibility)

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
  }, [user, fight, client, showHidden])

  const handleOpen = async (event: React.SyntheticEvent<Element, Event>) => {
    loadCharacters()
    setValue(defaultCharacter)
    setOpen(true)
    setAnchorEl(event.target as Element)
  }

  const show = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    setShowHidden(checked)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: Character) => {
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

    const response = (value.category === "character") ?
      await client.addCharacter(fight, {id: id})
    : await client.addVehicle(fight, {id: id})

    if (response.status === 200) {
      const character = await response.json()
      toastSuccess(`${character.name} added.`)
      setValue(defaultCharacter)
    } else {
      toastError()
    }
    await reloadFight(fight)
  }

  const getOptionLabel = (character: Character) => {
    if (!character.name) return ""

    const carEmoji = "🚗"
    const personEmoji = "👤"

    const emoji = (character.category === "vehicle") ? carEmoji : personEmoji

    return `${emoji} ${character.name} (${character.action_values["Type"]})`
  }

  return (
    <>
      <Button variant="contained" color="secondary" endIcon={<PersonIcon />} startIcon={<DirectionsCarFilledIcon />} onClick={handleOpen}>Select</Button>
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
            <StyledAutocomplete
              disabled={loading}
              freeSolo
              options={characters}
              sx={{ width: 300 }}
              value={value}
              onChange={handleChange}
              getOptionLabel={getOptionLabel}
              renderInput={(params: InputParamsType) => <StyledTextField autoFocus {...params} label="Character" />}
            />
            <Button type="submit" size="small" variant="contained">
              <PersonAddIcon />
            </Button>
            <GamemasterOnly user={user}>
              <FormControlLabel label="All" control={<Switch checked={showHidden} />} onChange={show} />
            </GamemasterOnly>
          </Stack>
        </Box>
      </Popover>
    </>
  )
}
